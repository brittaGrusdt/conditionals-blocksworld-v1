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
var simulateProbs = function(scene, n, sigma){
  let sceneData = defineScene(scene);
  worldObjects = createSceneObjs(scene["platform.type"], sceneData, false);
  let results = [];
  for(var i=0; i<n; i++){
    // TODO wiggle; sample
    setupWorld(worldObjects, document.body)
    let data = forwardAnimation(worldObjects);
    results.push(data);
  }
  return(results)
};



// worlds.js

// OLD
// var ground = makeBlock(
//   CONFIG.ground, {static: true, color: "black", label: "ground"});
//
// var platform = makeBlock(CONFIG.platform,
//   {static: true, color: "darkgray", label: "platform"}
// );
//
// var allRelevantBlocks = createColorCounterbalancedBlocks(platform)
// var distractorTowers = createDistractorTowers();
//
// ////////////////////////////////////////////////////////////////////////////////
// // 3. properties for a random particular single scene
// let relationBlocks = "stacked"
// // let relationBlocks = "side"
// // let colorCode = 0
// let colorCode = 1
// let relationDistractor = "close"
// // let relationDistractor = "far"
// ////////////////////////////////////////////////////////////////////////////////
//
// // 4. choose scene
// let nSituations = allRelevantBlocks[relationBlocks][colorCode].length
// idxScene = Math.floor(Math.random() * nSituations);
// idxScene=85
// let situation1 = allRelevantBlocks[relationBlocks][colorCode][idxScene]
//
// let distractorElems = distractorTowers[relationDistractor]
// let nDistractors = distractorElems.distractors.length
// let idxDistractor = Math.floor(Math.random() * nDistractors);
// let distractor1 = distractorElems.distractors[idxDistractor].distractor
//
// // 5. create + simulate world
// let allBlocks = [situation1.block1, situation1.block2]
// let worldDynamic = allBlocks.concat([distractor1])
//
// let objsStatic = [ground, platform]
// let worldStatic = objsStatic.concat(distractorElems.platform)
//
// let worldObjects = worldDynamic.concat(worldStatic)
