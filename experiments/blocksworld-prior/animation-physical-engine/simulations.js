const gaussian = require('gaussian');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

prepareWiggleData = function(){
  let results = [];
  dataAll.forEach(function(scene){
    let sceneDef = defineScene(scene);
    let platforms = scene["platform.type"] == "basic2" ?
    [sceneDef.p1, sceneDef.p2] : scene["platform.type"] == "seesaw" ?
    [sceneDef.plank] : [sceneDef.p1];
    let blockData = [scene.id, scene["AC.position"], sceneDef.b1, sceneDef.b2];
    results.push(blockData.concat(platforms))
  });
  let data = [];
  let csv = 'stimulus,position,before_x,before_y,width,height,id\n';
  results.forEach(function(trial) {
    // console.log(trial)
    for (var i=2; i< trial.length; i++){
      let vals = {'stimulus': trial[0],
                  'position': trial[1],
                  'before_x': trial[i].x,
                  'before_y': trial[i].y,
                  'width': trial[i].width,
                  'height': trial[i].height,
                  'id': trial[i].properties.label
                }
      // vals = vals.concat(trial[i].x, trial[i].y, trial[i].width,
      //   trial[i].height, trial[i].properties.label);
      // csv += vals.join(',');
      // csv += "\n";
      data.push(vals);
    }
  });
  return data
  // return encodeURI(csv);
}


/**
* Estimates probability tables P(A, C) with A/C: first/second block falls.
*
* Runs given configuration of scenes n times to estimate
* probabilities by frequencies.
*
* @param {Array<Object>} targets containing relevant blocks and platform
* @param {Matter.bodies.rectangle} target.block1 first relevant block
* @param {Matter.bodies.rectangle} target.block2 second relevant block
* @param {Matter.bodies.rectangle} target.platform holds block1 and block2
*
* @param {number} n number of simulations of each configuration
*
@return {Array<Object>} keys: target (with target.probTable (Object<string, number>) added,
* e.g. {"gb": 0.2, "ngnb": 0.2, "gnb": ... }) // oder gibt es sowas wie eine namedList?
*
*/
var simulateProbs = function(scene, wiggles){
  console.log('simulate probs for: ' + scene.id);
  let sceneData = defineScene(scene);
  let counts = {"ac_fallen": 0, "a_fallen": 0, "c_fallen": 0, "none_fallen": 0,
                "ac_touchGround": 0, "a_touchGround": 0,
                "c_touchGround": 0, "none_touchGround": 0};
  let n = wiggles.block1.length;
  for(var i=0; i<n; i++){
    // adjust wiggled block positions
    // console.log(sceneData);
    sceneData.b1.x = Number(parseFloat(wiggles.block1[i]));
    sceneData.b2.x = Number(parseFloat(wiggles.block2[i]));
    worldObjects = createSceneObjs(scene["platform.type"], sceneData, false);
    setupWorld(worldObjects);
    forwardAnimation(worldObjects);
    let effects = simulationEffects();
    clearWorld(worldObjects);
    // frequencies block1, block2 touching ground
    if(effects["block1"]["onGround"]){
      if(effects["block2"]["onGround"]){
        counts["ac_touchGround"] += 1;
      } else{
        counts["a_touchGround"] += 1;
      }
    } else {
      if(effects["block2"]["onGround"]){
        counts["c_touchGround"] += 1;
      } else {
        counts["none_touchGround"] += 1;
      }
    }
    // frequencies block1, block2 falling
    if(effects["block1"]["fell"]){
      if(effects["block2"]["fell"]){
        counts["ac_fallen"] += 1;
      } else{
        counts["a_fallen"] += 1;
      }
    } else {
      if(effects["block2"]["fell"]){
        counts["c_fallen"] += 1;
      } else {
        counts["none_fallen"] += 1;
      }
    }
  }
  // compute frequency
  counts = _.mapObject(counts, function(val, key) {
    return val / n;
  });
  counts["n_wiggles"] = n;
  counts["stimulus"] = scene.id;
  return(counts)
};

/** @arg block: block to be wiggled
** @arg base: object beneath block
*/
let doWiggle = function(block, base, kind, N, sigma){
  let wiggles = [];
  _.range(1, N+1).forEach(function(val){
    // Inverse transform sampling method
    var sample = gaussian(block.before_x, sigma).ppf(Math.random());
    wiggles.push(sample);
  })
  return wiggles
}

// stimulus contains block1, block2 + their platforms
let wiggle = function(stimulus, N, sigma){
  // console.log('wiggle objs: ')
  // console.log(stimulus)
  let block1 = _.filter(stimulus, function(obj){return obj.id==="block1"})[0]
  let block2 = _.filter(stimulus, function(obj){return obj.id=="block2"})[0]
  let pos = _.uniq(_.pluck(stimulus, 'position'))[0]
  let stim = _.uniq(_.pluck(stimulus, 'stimulus'))[0]
  // one of: block1, block2, p1, p2, seesaw
  let obj_ids = _.pluck(stimulus, 'id')
  let platform; let x_block1; let x_block2;
  if(pos == "-1") {
    // on two separate platforms (basic2)
    let p1 = _.filter(stimulus, function(obj){return obj.id=="platform1"})[0]
    let p2 = _.filter(stimulus, function(obj){return obj.id=="platform2"})[0]
    x_block1 = doWiggle(block1, p1, "basic2", N, sigma)
    x_block2 = doWiggle(block2, p2, "basic2", N, sigma)
  } else {
    // on a single platform (basic1 or seesaw)
    let kind = '';
    if(obj_ids.includes("platform1")){
      kind = "basic1";
      platform = _.filter(stimulus, function(obj){return obj.id=="platform1"})[0]
    } else {
      kind="seesaw";
      platform = _.filter(stimulus, function(obj){return obj.id=="seesawPlank"})[0]
    }
    if(pos == "stack_C_on_A"){
      x_block1 = doWiggle(block1, platform, kind, N, sigma);
      x_block2 = doWiggle(block2, block1, kind, N, sigma)
    } else if(pos == "stack_A_on_C") {
      x_block1 = doWiggle(block1, block2, kind, N, sigma)
      x_block2 = doWiggle(block2, platform, kind, N, sigma)
    } else if(pos == "side"){
      x_block1 = doWiggle(block1, platform, kind, N, sigma)
      x_block2 = doWiggle(block2, platform, kind, N, sigma)
    }
  }
  let wiggles = {block1: x_block1, block2: x_block2, stimulus: stim}
  let wiggledArray = []
  _.range(0,N).forEach(function(i){
    wiggledArray.push({block1: x_block1[i], block2: x_block2[i], stimulus: stim,
      block1_before: block1.before_x, block2_before: block2.before_x});
  });

  let csvWriter = createCsvWriter({
      path: 'wiggles.csv',
      header: [
          {id: 'block1', title: 'block1'},
          {id: 'block2', title: 'block2'},
          {id: 'stimulus', title: 'stimulus'},
          {id: 'block1_before', title: 'block1_before'},
          {id: 'block2_before', title: 'block2_before'}
      ]
  });
  csvWriter.writeRecords(wiggledArray)       // returns a promise
      .then(() => {
          console.log('...wrote wiggles to wiggles.csv!');
      });
  return wiggles
}

run = function(N, sigma){
  let stimuli = _.uniq(_.pluck(dataAll, 'id'));
  // let stimuli = ["S1-121"];
  // let stimuli =  ["S89-1642"];
  let definitions = prepareWiggleData();
  // console.log(definitions)
  let effects = [];
  stimuli.forEach(function(id){
    let sceneDefWiggles = _.filter(definitions, function(obj){
      return obj.stimulus === id
    })
    let wiggles = wiggle(sceneDefWiggles, N, sigma)
    let sceneDef = _.filter(dataAll, function(obj){
      return obj.id === id
    })[0];
    effects.push(Object.assign({sigma}, simulateProbs(sceneDef, wiggles)));
  });
  return effects;
}

const fs = require('fs');

let fn = 'simulationProbabilities.csv'
const ws = fs.createWriteStream(fn, { flag: 'a' });
// let sigmas = [1.75, 2.5]
let sigmas = [0.5, 1, 2.5]
let N = 1000;

let results = []
sigmas.forEach(function(sigma){
  console.log('sigma: ' + sigma);
  let effects = run(N, sigma);
  results = results.concat(effects);
  console.log(results);
});

const csvWriter = createCsvWriter({
    path: fn,
    header: [
        {id: 'sigma', title: 'sigma'},
        {id: 'ac_fallen', title: 'ac_fallen'},
        {id: 'a_fallen', title: 'a_fallen'},
        {id: 'c_fallen', title: 'c_fallen'},
        {id: 'none_fallen', title: 'none_fallen'},
        {id: 'ac_touchGround', title: 'ac_touchGround'},
        {id: 'a_touchGround', title: 'a_touchGround'},
        {id: 'c_touchGround', title: 'c_touchGround'},
        {id: 'none_touchGround', title: 'none_touchGround'},
        {id: 'n_wiggles', title: 'n_wiggles'},
        {id: 'stimulus', title: 'stimulus'}
    ]
});


csvWriter.writeRecords(results)       // returns a promise
    .then(() => {
        console.log('...Done');
    });
