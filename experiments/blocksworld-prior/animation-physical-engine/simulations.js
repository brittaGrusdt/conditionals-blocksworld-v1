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
  let sceneData = defineScene(scene);
  let counts = {"ac_fallen": 0, "a_fallen": 0, "c_fallen": 0, "none_fallen": 0,
                "ac_touchGround": 0, "a_touchGround": 0,
                "c_touchGround": 0, "none_touchGround": 0};
  for(var i=0; i<wiggles.length; i++){
    // adjust wiggled block positions
    // console.log(sceneData);
    sceneData.b1.x = Number(parseFloat(wiggles[i].block1).toPrecision(5));
    sceneData.b2.x = Number(parseFloat(wiggles[i].block2).toPrecision(5));
    worldObjects = createSceneObjs(scene["platform.type"], sceneData, false);
    setupWorld(worldObjects);
    forwardAnimation(worldObjects);
    let effects = simulationEffects();

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
    return val / wiggles.length;
  });
  counts["n_wiggles"] = wiggles.length;
  counts["stimulus"] = scene.id;

  return(counts)
};

const neatCsv = require('neat-csv');
const fs = require('fs');

fs.readFile('../analysis/wiggles.csv', async (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  let wiggles_all = await neatCsv(data);
  let scene_ids = _.pluck(dataAll, 'id');

  let effects = [];
  scene_ids.forEach(function(id){
  // let id = scene_ids[0];
    let definition = _.filter(dataAll, function(scene){
      return (scene.id).localeCompare(id) == 0
    })[0];
    // console.log(definition)
    let wiggles = _.filter(wiggles_all, function(wiggle){
      return (wiggle.stimulus).localeCompare(id) == 0
    });
    // console.log(wiggles)
    effects.push(simulateProbs(definition, wiggles));
  });
  console.log(effects[0])
  let fn = 'simulationProbabilities.csv'

  const fastcsv = require('fast-csv');
  const ws = fs.createWriteStream(fn);
  fastcsv
    .write(effects, { headers: true })
    .pipe(ws);
})
