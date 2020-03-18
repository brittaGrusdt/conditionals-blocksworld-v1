// 1. get data
let dataAll =
[{"id": "S1-121", "req.exp1.not.small": "", "req.exp1.not.large": "none", "req.exp2.not.small": "", "req.exp2.not.large": "", "pa": "high", "pc": "high", "pc_given_a": "uncertain", "pa_given_c": "uncertain", "Comment-dependency": "slightly_dep", "dependence.c": "1", "dependence.a": "1", "AC.position": "-1", "A.orientation": "vertical", "C.orientation": "vertical", "platform.type": "basic2", "platform1.height": "high", "platform1.width": "narrow", "platform2.height": "high", "platform2.width": "narrow", "platform.dist": "short", "comment1": "\nNeeds training example", "comment2": "both become less likely given the other"},
{"id": "S10-203", "req.exp1.not.small": "", "req.exp1.not.large": "none", "req.exp2.not.small": "", "req.exp2.not.large": "", "pa": "high", "pc": "low", "pc_given_a": "low", "pa_given_c": "uncertain", "Comment-dependency": "slightly_dep", "dependence.c": "0", "dependence.a": "1", "AC.position": "-1", "A.orientation": "vertical", "C.orientation": "vertical", "platform.type": "basic2", "platform1.height": "high", "platform1.width": "narrow", "platform2.height": "default", "platform2.width": "narrow", "platform.dist": "short", "comment1": "p(A|C) uncertain because of space", "comment2": "-1"},
{"id": "S12-203", "req.exp1.not.small": "", "req.exp1.not.large": "none", "req.exp2.not.small": "A", "req.exp2.not.large": "C", "pa": "high", "pc": "low", "pc_given_a": "low", "pa_given_c": "high", "Comment-dependency": "independent", "dependence.c": "0", "dependence.a": "0", "AC.position": "side", "A.orientation": "vertical", "C.orientation": "vertical", "platform.type": "basic1", "platform1.height": "default", "platform1.width": "default", "platform2.height": "-1", "platform2.width": "-1", "platform.dist": "-1", "comment1": "-1", "comment2": "-1"},
{"id": "S15-443", "req.exp1.not.small": "", "req.exp1.not.large": "none", "req.exp2.not.small": "", "req.exp2.not.large": "", "pa": "high", "pc": "uncertain", "pc_given_a": "low", "pa_given_c": "uncertain", "Comment-dependency": "slightly_dep", "dependence.c": "1", "dependence.a": "1", "AC.position": "-1", "A.orientation": "vertical", "C.orientation": "vertical", "platform.type": "basic2", "platform1.height": "high", "platform1.width": "narrow", "platform2.height": "high", "platform2.width": "narrow", "platform.dist": "short", "comment1": "p(A|C) uncertain because of space,\nP(C|A) low because A would fall more to the right", "comment2": "both become less likely given the other"},
{"id": "S20-468", "req.exp1.not.small": "", "req.exp1.not.large": "none", "req.exp2.not.small": "", "req.exp2.not.large": "", "pa": "high", "pc": "uncertain", "pc_given_a": "uncertain", "pa_given_c": "uncertain", "Comment-dependency": "slightly_dep", "dependence.c": "0", "dependence.a": "1", "AC.position": "-1", "A.orientation": "vertical", "C.orientation": "vertical", "platform.type": "basic2", "platform1.height": "high", "platform1.width": "narrow", "platform2.height": "default", "platform2.width": "narrow", "platform.dist": "short", "comment1": "similar to S10-203", "comment2": "-1"},
{"id": "S22-468", "req.exp1.not.small": "", "req.exp1.not.large": "none", "req.exp2.not.small": "A", "req.exp2.not.large": "", "pa": "high", "pc": "uncertain", "pc_given_a": "uncertain", "pa_given_c": "high", "Comment-dependency": "independent", "dependence.c": "0", "dependence.a": "0", "AC.position": "side", "A.orientation": "vertical", "C.orientation": "vertical", "platform.type": "basic1", "platform1.height": "default", "platform1.width": "default", "platform2.height": "-1", "platform2.width": "-1", "platform.dist": "-1", "comment1": "-1", "comment2": "-1"},
{"id": "S30-805", "req.exp1.not.small": "", "req.exp1.not.large": "ac", "req.exp2.not.small": "", "req.exp2.not.large": "A_C", "pa": "low", "pc": "low", "pc_given_a": "low", "pa_given_c": "low", "Comment-dependency": "independent", "dependence.c": "0", "dependence.a": "0", "AC.position": "side", "A.orientation": "vertical", "C.orientation": "vertical", "platform.type": "basic1", "platform1.height": "default", "platform1.width": "default", "platform2.height": "-1", "platform2.width": "-1", "platform.dist": "-1", "comment1": "-1", "comment2": "-1"},
{"id": "S32-806", "req.exp1.not.small": "", "req.exp1.not.large": "ac", "req.exp2.not.small": "", "req.exp2.not.large": "A_C", "pa": "low", "pc": "low", "pc_given_a": "low", "pa_given_c": "uncertain", "Comment-dependency": "slightly_dep", "dependence.c": "0", "dependence.a": "1", "AC.position": "-1", "A.orientation": "vertical", "C.orientation": "vertical", "platform.type": "basic2", "platform1.height": "high", "platform1.width": "narrow", "platform2.height": "default", "platform2.width": "narrow", "platform.dist": "short", "comment1": "needs air draft", "comment2": "similar to S20-468"},
{"id": "S34-806", "req.exp1.not.small": "", "req.exp1.not.large": "", "req.exp2.not.small": "", "req.exp2.not.large": "", "pa": "low", "pc": "low", "pc_given_a": "low", "pa_given_c": "high", "Comment-dependency": "causally_dep", "dependence.c": "0", "dependence.a": "2", "AC.position": "-1", "A.orientation": "horizontal", "C.orientation": "vertical", "platform.type": "basic2", "platform1.height": "default", "platform1.width": "narrow", "platform2.height": "high", "platform2.width": "narrow", "platform.dist": "very_short", "comment1": "-1", "comment2": "-1"},
{"id": "S42-806", "req.exp1.not.small": "", "req.exp1.not.large": "", "req.exp2.not.small": "", "req.exp2.not.large": "", "pa": "low", "pc": "low", "pc_given_a": "uncertain", "pa_given_c": "uncertain", "Comment-dependency": "causally_dep", "dependence.c": "1", "dependence.a": "1", "AC.position": "stack_A_on_C", "A.orientation": "horizontal", "C.orientation": "horizontal", "platform.type": "seesaw", "platform1.height": "-1", "platform1.width": "-1", "platform2.height": "-1", "platform2.width": "-1", "platform.dist": "-1", "comment1": "New\nNeeds training example", "comment2": "should be stacked perfectly in the middle; \nOr perfectly on each edge"},
{"id": "S44-806", "req.exp1.not.small": "", "req.exp1.not.large": "", "req.exp2.not.small": "", "req.exp2.not.large": "", "pa": "low", "pc": "low", "pc_given_a": "uncertain", "pa_given_c": "high", "Comment-dependency": "causally_dep", "dependence.c": "1", "dependence.a": "2", "AC.position": "stack_A_on_C", "A.orientation": "vertical", "C.orientation": "horizontal", "platform.type": "basic1", "platform1.height": "default", "platform1.width": "narrow", "platform2.height": "-1", "platform2.width": "-1", "platform.dist": "-1", "comment1": "needs training example", "comment2": "both become more likely given the other, one of them more so"},
{"id": "S54-806", "req.exp1.not.small": "", "req.exp1.not.large": "", "req.exp2.not.small": "", "req.exp2.not.large": "", "pa": "low", "pc": "low", "pc_given_a": "high", "pa_given_c": "high", "Comment-dependency": "dependent", "dependence.c": "2", "dependence.a": "2", "AC.position": "stack_C_on_A", "A.orientation": "horizontal", "C.orientation": "horizontal", "platform.type": "basic1", "platform1.height": "default", "platform1.width": "narrow", "platform2.height": "-1", "platform2.width": "-1", "platform.dist": "-1", "comment1": "similar to S42-806 and S97-1674\nDifficult\nNeeds training", "comment2": "both become more likely given the other"},
{"id": "S55-1006", "req.exp1.not.small": "", "req.exp1.not.large": "", "req.exp2.not.small": "", "req.exp2.not.large": "", "pa": "low", "pc": "uncertain", "pc_given_a": "low", "pa_given_c": "low", "Comment-dependency": "dependent", "dependence.c": "1", "dependence.a": "0", "AC.position": "-1", "A.orientation": "vertical", "C.orientation": "horizontal", "platform.type": "basic2", "platform1.height": "default", "platform1.width": "narrow", "platform2.height": "default", "platform2.width": "narrow", "platform.dist": "short", "comment1": "difficult", "comment2": "-1"},
{"id": "S57-1007", "req.exp1.not.small": "", "req.exp1.not.large": "", "req.exp2.not.small": "", "req.exp2.not.large": "A", "pa": "low", "pc": "uncertain", "pc_given_a": "uncertain", "pa_given_c": "low", "Comment-dependency": "independent", "dependence.c": "0", "dependence.a": "0", "AC.position": "side", "A.orientation": "vertical", "C.orientation": "vertical", "platform.type": "basic1", "platform1.height": "default", "platform1.width": "default", "platform2.height": "-1", "platform2.width": "-1", "platform.dist": "-1", "comment1": "-1", "comment2": "-1"},
{"id": "S59-1007", "req.exp1.not.small": "", "req.exp1.not.large": "", "req.exp2.not.small": "", "req.exp2.not.large": "", "pa": "low", "pc": "uncertain", "pc_given_a": "high", "pa_given_c": "low", "Comment-dependency": "causally_dep", "dependence.c": "1", "dependence.a": "0", "AC.position": "stack_C_on_A", "A.orientation": "horizontal", "C.orientation": "vertical", "platform.type": "basic1", "platform1.height": "default", "platform1.width": "narrow", "platform2.height": "-1", "platform2.width": "-1", "platform.dist": "-1", "comment1": "similar to S55-1006", "comment2": "-1"},
{"id": "S63-1039", "req.exp1.not.small": "", "req.exp1.not.large": "", "req.exp2.not.small": "", "req.exp2.not.large": "", "pa": "low", "pc": "uncertain", "pc_given_a": "high", "pa_given_c": "uncertain", "Comment-dependency": "causally_dep", "dependence.c": "1", "dependence.a": "1", "AC.position": "-1", "A.orientation": "vertical", "C.orientation": "vertical", "platform.type": "basic2", "platform1.height": "default", "platform1.width": "very_narrow", "platform2.height": "default", "platform2.width": "very_narrow", "platform.dist": "extreme_short", "comment1": "New\nsimilar to S10-203", "comment2": "horizontal"},
{"id": "S7-130", "req.exp1.not.small": "ac", "req.exp1.not.large": "none", "req.exp2.not.small": "A_C", "req.exp2.not.large": "", "pa": "high", "pc": "high", "pc_given_a": "high", "pa_given_c": "high", "Comment-dependency": "independent", "dependence.c": "0", "dependence.a": "0", "AC.position": "side", "A.orientation": "vertical", "C.orientation": "vertical", "platform.type": "basic1", "platform1.height": "default", "platform1.width": "default", "platform2.height": "-1", "platform2.width": "-1", "platform.dist": "-1", "comment1": "-1", "comment2": "-1"},
{"id": "S8-202", "req.exp1.not.small": "", "req.exp1.not.large": "", "req.exp2.not.small": "", "req.exp2.not.large": "", "pa": "high", "pc": "low", "pc_given_a": "low", "pa_given_c": "low", "Comment-dependency": "slightly_causally_dep", "dependence.c": "0", "dependence.a": "2", "AC.position": "-1", "A.orientation": "vertical", "C.orientation": "vertical", "platform.type": "basic2", "platform1.height": "default", "platform1.width": "default", "platform2.height": "default", "platform2.width": "default", "platform.dist": "very_short", "comment1": "similar to S55-1006", "comment2": "-1"},
{"id": "S83-1609", "req.exp1.not.small": "", "req.exp1.not.large": "", "req.exp2.not.small": "", "req.exp2.not.large": "", "pa": "uncertain", "pc": "uncertain", "pc_given_a": "low", "pa_given_c": "low", "Comment-dependency": "slightly_dep", "dependence.c": "1", "dependence.a": "1", "AC.position": "-1", "A.orientation": "vertical", "C.orientation": "vertical", "platform.type": "basic2", "platform1.height": "default", "platform1.width": "default", "platform2.height": "default", "platform2.width": "default", "platform.dist": "very_short", "comment1": "-1", "comment2": "both become less likely given the other, \nSimilar to S15-443"},
{"id": "S89-1642", "req.exp1.not.small": "", "req.exp1.not.large": "", "req.exp2.not.small": "", "req.exp2.not.large": "", "pa": "uncertain", "pc": "uncertain", "pc_given_a": "uncertain", "pa_given_c": "uncertain", "Comment-dependency": "independent", "dependence.c": "0", "dependence.a": "0", "AC.position": "side", "A.orientation": "vertical", "C.orientation": "vertical", "platform.type": "basic1", "platform1.height": "default", "platform1.width": "default", "platform2.height": "-1", "platform2.width": "-1", "platform.dist": "-1", "comment1": "-1", "comment2": "-1"},
{"id": "S93-1674", "req.exp1.not.small": "", "req.exp1.not.large": "", "req.exp2.not.small": "", "req.exp2.not.large": "", "pa": "uncertain", "pc": "uncertain", "pc_given_a": "uncertain", "pa_given_c": "high", "Comment-dependency": "slightly_causally_dep", "dependence.c": "0", "dependence.a": "1", "AC.position": "-1", "A.orientation": "horizontal", "C.orientation": "vertical", "platform.type": "basic2", "platform1.height": "default", "platform1.width": "narrow", "platform2.height": "high", "platform2.width": "narrow", "platform.dist": "extreme_short", "comment1": "similar to S59-1007\n", "comment2": "-1"},
{"id": "S97-1674", "req.exp1.not.small": "", "req.exp1.not.large": "", "req.exp2.not.small": "", "req.exp2.not.large": "", "pa": "uncertain", "pc": "uncertain", "pc_given_a": "high", "pa_given_c": "high", "Comment-dependency": "causally_dep", "dependence.c": "1", "dependence.a": "1", "AC.position": "side", "A.orientation": "horizontal", "C.orientation": "horizontal", "platform.type": "seesaw", "platform1.height": "-1", "platform1.width": "-1", "platform2.height": "-1", "platform2.width": "-1", "platform.dist": "-1", "comment1": "-1", "comment2": "Both become more likely given the other;\nSimilar to S42-806"},
{"id": "S7-130-dep", "req.exp1.not.small": "", "req.exp1.not.large": "none", "req.exp2.not.small": "", "req.exp2.not.large": "", "pa": "high", "pc": "high", "pc_given_a": "high", "pa_given_c": "high", "Comment-dependency": "causally_dep", "dependence.c": "dep", "dependence.a": "dep", "AC.position": "side", "A.orientation": "horizontal", "C.orientation": "horizontal", "platform.type": "seesaw", "platform1.height": "-1", "platform1.width": "-1", "platform2.height": "-1", "platform2.width": "-1", "platform.dist": "-1", "comment1": "such that not sure in which direction the blocks fall; side or stacked, try out", "comment2": "-1"},
{"id": "S30-805-dep", "req.exp1.not.small": "", "req.exp1.not.large": "", "req.exp2.not.small": "", "req.exp2.not.large": "", "pa": "low", "pc": "low", "pc_given_a": "low", "pa_given_c": "low", "Comment-dependency": "dependent", "dependence.c": "dep", "dependence.a": "dep", "AC.position": "stack_A_on_C", "A.orientation": "horizontal", "C.orientation": "horizontal", "platform.type": "basic1", "platform1.height": "default", "platform1.width": "default", "platform2.height": "-1", "platform2.width": "-1", "platform.dist": "-1", "comment1": "pc should be 0, directly on top of platform", "comment2": "-1"},
{"id": "S89-1642-dep", "req.exp1.not.small": "", "req.exp1.not.large": "", "req.exp2.not.small": "", "req.exp2.not.large": "", "pa": "uncertain", "pc": "uncertain", "pc_given_a": "uncertain", "pa_given_c": "uncertain", "Comment-dependency": "causally_dep", "dependence.c": "dep", "dependence.a": "dep", "AC.position": "side", "A.orientation": "horizontal", "C.orientation": "horizontal", "platform.type": "seesaw", "platform1.height": "-1", "platform1.width": "-1", "platform2.height": "-1", "platform2.width": "-1", "platform.dist": "-1", "comment1": "one on each side such that unclear whether in balance or not", "comment2": "-1"}]

let id2TrialData = {};
dataAll.forEach(function(trial){
  id2TrialData[trial.id] = trial;
});
// _.map(id2TrialData, function(x){console.log(x.id)})

// Create a point constraint that pins the center of the plank to fixed point in
// space, so it can't move
platformConstraints = function(platforms) {
  let constraints = [];
  platforms.forEach(function(platform){
    let c = Constraint.create({pointA: {x: platform["position"]["x"],
                                        y: platform["position"]["y"]},
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
let ids = ["S1-121", "S10-203", "S12-203", "S15-443", "S20-468","S22-468",
           "S30-805", "S32-806", "S34-806", "S42-806", "S44-806", "S54-806",
           "S55-1006", "S57-1007", "S59-1007", "S63-1039", "S7-130", "S8-202", "S83-1609", "S89-1642", "S93-1674", "S97-1674", "S7-130-dep",
           "S30-805-dep", "S89-1642-dep"];
console.log(ids.length)

// let idxScene = Math.floor(Math.random()*10)
let idxScene = 15;
// let sceneID = ids[idxScene];
let sceneID = "S97-1674";

let allScenes;
let sceneProps;
let worldObjects;

if(MODE === "experiment"){
  allScenes =   getRandomTrainData();
} else {
    if(MODE === "train"){
      allScenes = getRandomTrainData();
      idxScene = Math.floor(Math.random() * allScenes.length);
      sceneProps = allScenes[idxScene];
    } else {
      sceneProps = _.filter(dataAll, function(trial){
        return trial.id === sceneID;
      })[0];
    }
    let sceneData = defineScene(sceneProps);
    worldObjects = createSceneObjs(sceneProps["platform.type"], sceneData,
                                    MODE === "train");
}
