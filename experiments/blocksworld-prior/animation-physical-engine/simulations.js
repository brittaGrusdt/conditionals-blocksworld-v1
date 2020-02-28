require('./03_helpers_towers.js')
require('./04_worlds.js')
require('./05_animation.js')
getEffects = function(data){
  console.log(data)
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
  let sceneData = defineScene(scene);
  worldObjects = createSceneObjs(scene["platform.type"], sceneData, false);
  let results = [];
  for(var i=0; i<wiggles.length; i++){
    // adjust wiggled block positions
    sceneData.b1.x = wiggles[i].block1
    sceneData.b2.x = wiggles[i].block2
    setupWorld(worldObjects, document.body)
    let data = forwardAnimation(worldObjects);
    // did blocks touch the ground?
    let effects = getEffects(data);
    results.push(effects);
  }
  // compute frequency

  return(results)
};

const neatCsv = require('neat-csv');
const fs = require('fs');
fs.readFile('../analysis/wiggles.csv', async (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  let wiggles = await neatCsv(data);
  console.log(wiggles)
})

dataAll.forEach(function(scene){
  simulateProbs(scene);
});
