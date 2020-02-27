// 1. get data
let dataAll = [
  {"pa_given_c": "uncertain", "platform2.width": "narrow", "platform.type": "basic2", "must_not_be_large": "none", "id": "S1-121", "C.orientation": "vertical", "pc": "high", "pa": "high", "platform1.height": "high", "pc_given_a": "uncertain", "AC.position": "-1", "dependence.c": "1", "platform2.height": "high", "req.exp2.not.small": "", "Comment-dependency": "slightly_dep", "must_not_be_small": "", "A.orientation": "vertical", "platform.dist": "short", "platform1.width": "narrow", "req.exp2.not.large": "", "dependence.a": "1", "comment1": "\nNeeds training example", "comment2": "both become less likely given the other"},
  {"pa_given_c": "uncertain", "platform2.width": "narrow", "platform.type": "basic2", "must_not_be_large": "none", "id": "S10-203", "C.orientation": "vertical", "pc": "low", "pa": "high", "platform1.height": "high", "pc_given_a": "low", "AC.position": "-1", "dependence.c": "0", "platform2.height": "default", "req.exp2.not.small": "", "Comment-dependency": "slightly_dep", "must_not_be_small": "", "A.orientation": "vertical", "platform.dist": "short", "platform1.width": "narrow", "req.exp2.not.large": "", "dependence.a": "1", "comment1": "p(A|C) uncertain because of space", "comment2": "-1"},
  {"pa_given_c": "high", "platform2.width": "-1", "platform.type": "basic1", "must_not_be_large": "none", "id": "S12-203", "C.orientation": "vertical", "pc": "low", "pa": "high", "platform1.height": "default", "pc_given_a": "low", "AC.position": "side", "dependence.c": "0", "platform2.height": "-1", "req.exp2.not.small": "A", "Comment-dependency": "independent", "must_not_be_small": "", "A.orientation": "vertical", "platform.dist": "-1", "platform1.width": "default", "req.exp2.not.large": "C", "dependence.a": "0", "comment1": "-1", "comment2": "-1"},
  {"pa_given_c": "uncertain", "platform2.width": "narrow", "platform.type": "basic2", "must_not_be_large": "none", "id": "S15-443", "C.orientation": "vertical", "pc": "uncertain", "pa": "high", "platform1.height": "high", "pc_given_a": "low", "AC.position": "-1", "dependence.c": "1", "platform2.height": "high", "req.exp2.not.small": "", "Comment-dependency": "slightly_dep", "must_not_be_small": "", "A.orientation": "vertical", "platform.dist": "short", "platform1.width": "narrow", "req.exp2.not.large": "", "dependence.a": "1", "comment1": "p(A|C) uncertain because of space,\nP(C|A) low because A would fall more to the right", "comment2": "both become less likely given the other"},
  {"pa_given_c": "uncertain", "platform2.width": "narrow", "platform.type": "basic2", "must_not_be_large": "none", "id": "S20-468", "C.orientation": "vertical", "pc": "uncertain", "pa": "high", "platform1.height": "high", "pc_given_a": "uncertain", "AC.position": "-1", "dependence.c": "0", "platform2.height": "default", "req.exp2.not.small": "", "Comment-dependency": "slightly_dep", "must_not_be_small": "", "A.orientation": "vertical", "platform.dist": "short", "platform1.width": "narrow", "req.exp2.not.large": "", "dependence.a": "1", "comment1": "similar to S10-203", "comment2": "-1"},
  {"pa_given_c": "high", "platform2.width": "-1", "platform.type": "basic1", "must_not_be_large": "none", "id": "S22-468", "C.orientation": "vertical", "pc": "uncertain", "pa": "high", "platform1.height": "default", "pc_given_a": "uncertain", "AC.position": "side", "dependence.c": "0", "platform2.height": "-1", "req.exp2.not.small": "A", "Comment-dependency": "independent", "must_not_be_small": "", "A.orientation": "vertical", "platform.dist": "-1", "platform1.width": "default", "req.exp2.not.large": "", "dependence.a": "0", "comment1": "-1", "comment2": "-1"},
  {"pa_given_c": "low", "platform2.width": "-1", "platform.type": "basic1", "must_not_be_large": "ac", "id": "S30-805", "C.orientation": "vertical", "pc": "low", "pa": "low", "platform1.height": "default", "pc_given_a": "low", "AC.position": "side", "dependence.c": "0", "platform2.height": "-1", "req.exp2.not.small": "", "Comment-dependency": "independent", "must_not_be_small": "", "A.orientation": "vertical", "platform.dist": "-1", "platform1.width": "default", "req.exp2.not.large": "A_C", "dependence.a": "0", "comment1": "-1", "comment2": "-1"},
  {"pa_given_c": "uncertain", "platform2.width": "narrow", "platform.type": "basic2", "must_not_be_large": "ac", "id": "S32-806", "C.orientation": "vertical", "pc": "low", "pa": "low", "platform1.height": "high", "pc_given_a": "low", "AC.position": "-1", "dependence.c": "0", "platform2.height": "default", "req.exp2.not.small": "", "Comment-dependency": "slightly_dep", "must_not_be_small": "", "A.orientation": "vertical", "platform.dist": "short", "platform1.width": "narrow", "req.exp2.not.large": "A_C", "dependence.a": "1", "comment1": "needs air draft", "comment2": "similar to S20-468"},
  {"pa_given_c": "high", "platform2.width": "narrow", "platform.type": "basic2", "must_not_be_large": "", "id": "S34-806", "C.orientation": "vertical", "pc": "low", "pa": "low", "platform1.height": "default", "pc_given_a": "low", "AC.position": "-1", "dependence.c": "0", "platform2.height": "high", "req.exp2.not.small": "", "Comment-dependency": "causally_dep", "must_not_be_small": "", "A.orientation": "horizontal", "platform.dist": "very_short", "platform1.width": "narrow", "req.exp2.not.large": "", "dependence.a": "2", "comment1": "-1", "comment2": "-1"},
  {"pa_given_c": "uncertain", "platform2.width": "-1", "platform.type": "seesaw", "must_not_be_large": "", "id": "S42-806", "C.orientation": "horizontal", "pc": "low", "pa": "low", "platform1.height": "-1", "pc_given_a": "uncertain", "AC.position": "stack_A_on_C", "dependence.c": "1", "platform2.height": "-1", "req.exp2.not.small": "", "Comment-dependency": "causally_dep", "must_not_be_small": "", "A.orientation": "horizontal", "platform.dist": "-1", "platform1.width": "-1", "req.exp2.not.large": "", "dependence.a": "1", "comment1": "New\nNeeds training example", "comment2": "should be stacked perfectly in the middle; \nOr perfectly on each edge"},
  {"pa_given_c": "high", "platform2.width": "-1", "platform.type": "basic1", "must_not_be_large": "", "id": "S44-806", "C.orientation": "horizontal", "pc": "low", "pa": "low", "platform1.height": "default", "pc_given_a": "uncertain", "AC.position": "stack_A_on_C", "dependence.c": "1", "platform2.height": "-1", "req.exp2.not.small": "", "Comment-dependency": "causally_dep", "must_not_be_small": "", "A.orientation": "vertical", "platform.dist": "-1", "platform1.width": "narrow", "req.exp2.not.large": "", "dependence.a": "2", "comment1": "needs training example", "comment2": "both become more likely given the other, one of them more so"},
  {"pa_given_c": "high", "platform2.width": "-1", "platform.type": "basic1", "must_not_be_large": "", "id": "S54-806", "C.orientation": "horizontal", "pc": "low", "pa": "low", "platform1.height": "default", "pc_given_a": "high", "AC.position": "stack_C_on_A", "dependence.c": "2", "platform2.height": "-1", "req.exp2.not.small": "", "Comment-dependency": "dependent", "must_not_be_small": "", "A.orientation": "horizontal", "platform.dist": "-1", "platform1.width": "narrow", "req.exp2.not.large": "", "dependence.a": "2", "comment1": "similar to S42-806 and S97-1674\nDifficult\nNeeds training", "comment2": "both become more likely given the other"},
  {"pa_given_c": "low", "platform2.width": "narrow", "platform.type": "basic2", "must_not_be_large": "", "id": "S55-1006", "C.orientation": "horizontal", "pc": "uncertain", "pa": "low", "platform1.height": "default", "pc_given_a": "low", "AC.position": "-1", "dependence.c": "1", "platform2.height": "default", "req.exp2.not.small": "", "Comment-dependency": "dependent", "must_not_be_small": "", "A.orientation": "vertical", "platform.dist": "short", "platform1.width": "narrow", "req.exp2.not.large": "", "dependence.a": "0", "comment1": "difficult", "comment2": "-1"},
  {"pa_given_c": "low", "platform2.width": "-1", "platform.type": "basic1", "must_not_be_large": "", "id": "S57-1007", "C.orientation": "vertical", "pc": "uncertain", "pa": "low", "platform1.height": "default", "pc_given_a": "uncertain", "AC.position": "side", "dependence.c": "0", "platform2.height": "-1", "req.exp2.not.small": "", "Comment-dependency": "independent", "must_not_be_small": "", "A.orientation": "vertical", "platform.dist": "-1", "platform1.width": "default", "req.exp2.not.large": "A", "dependence.a": "0", "comment1": "-1", "comment2": "-1"},
  {"pa_given_c": "low", "platform2.width": "-1", "platform.type": "basic1", "must_not_be_large": "", "id": "S59-1007", "C.orientation": "vertical", "pc": "uncertain", "pa": "low", "platform1.height": "default", "pc_given_a": "high", "AC.position": "stack_C_on_A", "dependence.c": "1", "platform2.height": "-1", "req.exp2.not.small": "", "Comment-dependency": "causally_dep", "must_not_be_small": "", "A.orientation": "horizontal", "platform.dist": "-1", "platform1.width": "narrow", "req.exp2.not.large": "", "dependence.a": "0", "comment1": "similar to S55-1006", "comment2": "-1"},
  {"pa_given_c": "uncertain", "platform2.width": "very_narrow", "platform.type": "basic2", "must_not_be_large": "", "id": "S63-1039", "C.orientation": "vertical", "pc": "uncertain", "pa": "low", "platform1.height": "default", "pc_given_a": "high", "AC.position": "-1", "dependence.c": "1", "platform2.height": "default", "req.exp2.not.small": "", "Comment-dependency": "causally_dep", "must_not_be_small": "", "A.orientation": "vertical", "platform.dist": "extreme_short", "platform1.width": "very_narrow", "req.exp2.not.large": "", "dependence.a": "1", "comment1": "New\nsimilar to S10-203", "comment2": "horizontal"},
  {"pa_given_c": "high", "platform2.width": "-1", "platform.type": "basic1", "must_not_be_large": "none", "id": "S7-130", "C.orientation": "vertical", "pc": "high", "pa": "high", "platform1.height": "default", "pc_given_a": "high", "AC.position": "side", "dependence.c": "0", "platform2.height": "-1", "req.exp2.not.small": "A_C", "Comment-dependency": "independent", "must_not_be_small": "ac", "A.orientation": "vertical", "platform.dist": "-1", "platform1.width": "default", "req.exp2.not.large": "", "dependence.a": "0", "comment1": "-1", "comment2": "-1"},
  {"pa_given_c": "low", "platform2.width": "default", "platform.type": "basic2", "must_not_be_large": "", "id": "S8-202", "C.orientation": "vertical", "pc": "low", "pa": "high", "platform1.height": "default", "pc_given_a": "low", "AC.position": "-1", "dependence.c": "0", "platform2.height": "default", "req.exp2.not.small": "", "Comment-dependency": "slightly_causally_dep", "must_not_be_small": "", "A.orientation": "vertical", "platform.dist": "very_short", "platform1.width": "default", "req.exp2.not.large": "", "dependence.a": "2", "comment1": "similar to S55-1006", "comment2": "-1"},
  {"pa_given_c": "low", "platform2.width": "default", "platform.type": "basic2", "must_not_be_large": "", "id": "S83-1609", "C.orientation": "vertical", "pc": "uncertain", "pa": "uncertain", "platform1.height": "default", "pc_given_a": "low", "AC.position": "-1", "dependence.c": "1", "platform2.height": "default", "req.exp2.not.small": "", "Comment-dependency": "slightly_dep", "must_not_be_small": "", "A.orientation": "vertical", "platform.dist": "short", "platform1.width": "default", "req.exp2.not.large": "", "dependence.a": "1", "comment1": "-1", "comment2": "both become less likely given the other, \nSimilar to S15-443"},
  {"pa_given_c": "uncertain", "platform2.width": "-1", "platform.type": "basic1", "must_not_be_large": "", "id": "S89-1642", "C.orientation": "vertical", "pc": "uncertain", "pa": "uncertain", "platform1.height": "default", "pc_given_a": "uncertain", "AC.position": "side", "dependence.c": "0", "platform2.height": "-1", "req.exp2.not.small": "", "Comment-dependency": "independent", "must_not_be_small": "", "A.orientation": "vertical", "platform.dist": "-1", "platform1.width": "default", "req.exp2.not.large": "", "dependence.a": "0", "comment1": "-1", "comment2": "-1"},
  {"pa_given_c": "high", "platform2.width": "narrow", "platform.type": "basic2", "must_not_be_large": "", "id": "S93-1674", "C.orientation": "vertical", "pc": "uncertain", "pa": "uncertain", "platform1.height": "default", "pc_given_a": "uncertain", "AC.position": "-1", "dependence.c": "0", "platform2.height": "high", "req.exp2.not.small": "", "Comment-dependency": "slightly_causally_dep", "must_not_be_small": "", "A.orientation": "horizontal", "platform.dist": "extreme_short", "platform1.width": "narrow", "req.exp2.not.large": "", "dependence.a": "1", "comment1": "similar to S59-1007\n", "comment2": "-1"},
  {"pa_given_c": "high", "platform2.width": "-1", "platform.type": "seesaw", "must_not_be_large": "", "id": "S97-1674", "C.orientation": "horizontal", "pc": "uncertain", "pa": "uncertain", "platform1.height": "-1", "pc_given_a": "high", "AC.position": "side", "dependence.c": "1", "platform2.height": "-1", "req.exp2.not.small": "", "Comment-dependency": "causally_dep", "must_not_be_small": "", "A.orientation": "horizontal", "platform.dist": "-1", "platform1.width": "-1", "req.exp2.not.large": "", "dependence.a": "1", "comment1": "-1", "comment2": "Both become more likely given the other;\nSimilar to S42-806"},
  {"pa_given_c": "high", "platform2.width": "-1", "platform.type": "seesaw", "must_not_be_large": "none", "id": "S7-130-dep", "C.orientation": "horizontal", "pc": "high", "pa": "high", "platform1.height": "-1", "pc_given_a": "high", "AC.position": "side", "dependence.c": "dep", "platform2.height": "-1", "req.exp2.not.small": "", "Comment-dependency": "causally_dep", "must_not_be_small": "", "A.orientation": "horizontal", "platform.dist": "-1", "platform1.width": "-1", "req.exp2.not.large": "", "dependence.a": "dep", "comment1": "such that not sure in which direction the blocks fall; side or stacked, try out", "comment2": "-1"},
  {"pa_given_c": "low", "platform2.width": "-1", "platform.type": "basic1", "must_not_be_large": "", "id": "S30-805-dep", "C.orientation": "horizontal", "pc": "low", "pa": "low", "platform1.height": "default", "pc_given_a": "low", "AC.position": "stack_A_on_C", "dependence.c": "dep", "platform2.height": "-1", "req.exp2.not.small": "", "Comment-dependency": "dependent", "must_not_be_small": "", "A.orientation": "horizontal", "platform.dist": "-1", "platform1.width": "default", "req.exp2.not.large": "", "dependence.a": "dep", "comment1": "pc should be 0, directly on top of platform", "comment2": "-1"},
  {"pa_given_c": "uncertain", "platform2.width": "-1", "platform.type": "seesaw", "must_not_be_large": "", "id": "S89-1642-dep", "C.orientation": "horizontal", "pc": "uncertain", "pa": "uncertain", "platform1.height": "-1", "pc_given_a": "uncertain", "AC.position": "side", "dependence.c": "dep", "platform2.height": "-1", "req.exp2.not.small": "", "Comment-dependency": "causally_dep", "must_not_be_small": "", "A.orientation": "horizontal", "platform.dist": "-1", "platform1.width": "-1", "req.exp2.not.large": "", "dependence.a": "dep", "comment1": "one on each side such that unclear whether in balance or not", "comment2": "-1"}
]

let id2TrialData = {};

dataAll.forEach(function(trial){
  id2TrialData[trial.id] = trial;
});


// Create a point constraint that pins the center of the plank to fixed point in
// space, so it can't move
platformConstraints = function(platforms) {
  let constraints = [];
  platforms.forEach(function(platform){
    let c = Constraint.create({pointA: {x: platform["position"]["x"], y: platform["position"]["y"]},
                              bodyB: platform,
                              stiffness: 0.7,
                              length: 0,
                              render: {visible: false}
                            });
    c.add2World = true;
    constraints.push(c);
  })
  return constraints
}

makeConstraints = function(pType, mapID2Objs) {
  let constraints = [];

  let platforms = [mapID2Objs.distractorPlatform];
  if (pType == "seesaw"){
    platforms.push(mapID2Objs.seesawStick, mapID2Objs.seesawLink);
    let c1 = Constraint.create({
        pointA: {x: mapID2Objs["seesawPlank"]["position"]["x"],
                 y: mapID2Objs["seesawPlank"]["position"]["y"]},
        bodyB: mapID2Objs["seesawPlank"],
        stiffness: 0.5,
        length: 0,
        render: {visible: true}
      });
    c1.add2World = true;
    constraints.push(c1);

    let c2 = Constraint.create({pointA: {x: mapID2Objs["compoundSeesaw"]["position"]["x"],
                                y: mapID2Objs["compoundSeesaw"]["position"]["y"]},
                                bodyB: mapID2Objs["compoundSeesaw"],
                                stiffness: 0.7,
                                length: 0,
                                render: {visible: false}
                              });
    c2.add2World = true;
    constraints.push(c2);

  } else {
      platforms.push(mapID2Objs.platform1)
      if (pType == "basic2"){
        platforms.push(mapID2Objs.platform2);
      }
    }

  let pConstraints = platformConstraints(platforms);
  constraints = constraints.concat(pConstraints);

  return constraints
}

randomStacked = function(b1, b2, basis){
  let b1Range;
  let b2Range;
  // y values get smaller the closer to the top (0,0)!
  if(b1.y < b2.y){
    // console.log('b1 on b2')
    // b1 on b2 on basis
    b2Range = getMinMax(b2, basis);
    b2.x = randomNbInRange(b2Range);
    b1Range = getMinMax(b1, b2);
    b1.x = randomNbInRange(b1Range);
  } else {
    // console.log('b2 on b1')
    // b2 on b1 on basis
    b1Range = getMinMax(b1, basis)
    b1.x = randomNbInRange(b1Range);
    b2Range = getMinMax(b2, b1);
    b2.x = randomNbInRange(b2Range);
  }
}


randomizeLocationsTraining = function(pType, mapID2Def){
  if(pType !== "basic2"){
    // for basic2 we use predefined high-uncertain or uncertain-high or high - high
    // values to avoid that the first training trial is a trial where nothing
    // actually happens
    // stack random
    let base = pType == "seesaw" ? mapID2Def.plank : mapID2Def.p1;
    randomStacked(mapID2Def.b1, mapID2Def.b2, base);
  }
}

createSceneObjs = function(pType, mapID2Definitions, training){
  let objs = Object.values(mapID2Definitions);
  let map2WorldObjs = {}

  if(training){
    randomizeLocationsTraining(pType, mapID2Definitions, objs);
    let distRange = getMinMax(mapID2Definitions.distractorBlock, mapID2Definitions.distractorPlatform);
    mapID2Definitions.distractorBlock.x = randomNbInRange(distRange);
  }
  objs.forEach(function(obj){
    let block = makeBlock(obj);
    map2WorldObjs[obj.properties.label] = block;
  });

  if(pType == "seesaw"){
    let seesaw = Matter.Body.create({parts: [map2WorldObjs.seesawStick,
                                             map2WorldObjs.seesawLink],
                                     label: "compoundSeesaw"});
    seesaw.add2World = true;
    // only add compound body, not its parts
    map2WorldObjs.seesawStick.add2World = false;
    map2WorldObjs.seesawLink.add2World = false;

    map2WorldObjs.compoundSeesaw = seesaw

  }
  let allSceneObjs = Object.values(map2WorldObjs)

  let constraints = makeConstraints(pType, map2WorldObjs);
  constraints.forEach(function(obj){
    allSceneObjs.push(obj)
  });
  return allSceneObjs
}


// 2. choose and create scene
let idxScene = Math.floor(Math.random()*10)
// idxScene =  9
// console.log(dataAll[idxScene].id)

let allScenes;
let sceneProps;
let worldObjects;

if(MODE === "experiment"){
  allScenes =   getRandomTrainData();

} else {
    if(MODE === "train"){
      allScenes = getRandomTrainData();
      idxScene = Math.floor(Math.random() * allScenes.length);
      // idxScene = 2;
      sceneProps = allScenes[idxScene];
    } else {
      sceneProps = dataAll[idxScene]
      }
    let sceneData = defineScene(sceneProps);
    worldObjects = createSceneObjs(sceneProps["platform.type"], sceneData, MODE === "train");
}
