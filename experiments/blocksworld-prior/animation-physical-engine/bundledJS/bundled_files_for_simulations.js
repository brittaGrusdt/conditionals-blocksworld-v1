var _ = require('../node_modules/underscore/underscore.js');
var Matter = require('../node_modules/matter-js/build/matter.js');

let mapProperty2Val = function(data, key){
  let prop = key.split('.')[1]
  return(PlatformProp2Val[prop][data[key]])
}

let yPos = function(objH, baseH, baseY){
  // check if obj is defined (if not property equals -1)
  return objH==-1 ? -1 : baseY - baseH / 2 - objH / 2
}

let blockXpos = function(blockW, baseW, baseX, whichEdge, prior){
  let shiftBaseEdge = whichEdge == "left" ? -1 : 1
  let shiftBlockEdge = whichEdge == "left" ? 1 : -1
  let shared = Prior2ProportionOnBase[prior] * blockW
  let baseEdge = baseX + shiftBaseEdge * (baseW / 2)
  let blockEdgeOnBase = baseEdge  + shared * shiftBlockEdge
  let x = blockEdgeOnBase + shiftBaseEdge * (blockW / 2)
  return x
}

//get min and max x center-position for obj
getMinMax = function(obj, base){
  let min = base.x - base.width / 2 - obj.width/2 + 5;
  let max = base.x + base.width / 2 + obj.width/2 - 5;
  min = (min - obj.width / 2) < 0 ? obj.width/2 : min;
  max = (max + obj.width / 2) > CANVAS.width ? CANVAS.width-(obj.width/2) : max;
  return [min, max]
}

randomNbInRange = function(minMax){
   return Math.random() * (minMax[1] - minMax[0]) + minMax[0];
}

downloadSceneDefinitions = function(data) {
    let csv = 'stimulus, position, before_x, before_y, width, height, id\n';
    data.forEach(function(trial) {
      console.log(trial)
      for (var i=2; i< trial.length; i++){
        let vals = [trial[0], trial[1]]
        vals = vals.concat(trial[i].x, trial[i].y, trial[i].width,
          trial[i].height, trial[i].properties.label);
        csv += vals.join(',');
        csv += "\n";
      }
    });
    // console.log(csv);
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'sceneData.csv';
    hiddenElement.click();
}

let MODE = "train";
// let MODE = "experiment";
// let MODE = "";

// // canvas size
const CANVAS = {"width": 800, "height": 300}
const SIMULATION = {"duration": 5000}

// default values for width/height of platforms
let platformH = 100;
let platformW = 150;
// min dist of platforms to left side and from distractor to platform
const Dist2Side = 0

const COLOR = {"platforms": "#B6AFBD",  // "#FFBC42",
               "distractor": "#AF5558", //"#900C3F",
               "ground": "black",
               "blocks": ["#1BB635", "#0496FF"],  // green, blue
               "seesaw": {"plank": "darkorange", "stick": "darkgray"}}

const DENSITIES = {"default": 0.001, "blocks": 0.1, "seesawPlank": 0.2, "platforms": 0.4}
const FRICTIONS = {"default": 0.8, "platforms": 0.8}
const RESTITUITIONS = {"default": 0} // default is inelastic

const BLOCKS = {"width": 40, "height": 80,
                "minDist2Edge": 5,"step": 10
               };
// proportion of this value of the width of the block will touch the base
const Prior2ProportionOnBase = {"low": 0.625, "high": 0.375, "uncertain": 0.5}
let platformDist = 2 * platformW
const PlatformProp2Val =
  {"width": {"default": platformW, "narrow": platformW / 2, "very_narrow": platformW / 3},
   "height": {"default": platformH, "high": platformH * 2},
   "dist": {"default": platformDist, "short": platformDist / 2,
            "very_short": platformDist / 3,
            "extreme_short": platformDist / 4}
  };

const SceneEdges = {"left": Dist2Side,
                    "right": CANVAS.width - PlatformProp2Val["width"]["narrow"] -
                    Dist2Side
                   };
const SceneArea = SceneEdges["right"] - SceneEdges["left"]


let groundH = 20;
const GROUND = initWorldObj("static", "ground", COLOR.ground,
                            x=CANVAS.width / 2,
                            y=CANVAS.height - groundH / 2,
                            width=CANVAS.width,
                            height=groundH
                           );

let seesawStickHeight = PlatformProp2Val.height.default / 1.5;
let seesawPlankHeight = 10;
let seesawLinkHeight = 5;

let seesawPodestWidth = 0.75 * BLOCKS.height;
let seesawPodestHeight =  0.3 * BLOCKS.height;

const SeesawStick = initWorldObj("static", "seesawStick", COLOR.seesaw.stick,
                                  x= Dist2Side + SceneArea / 2,
                                  y=yPos(seesawStickHeight, GROUND.height,
                                         GROUND.y),
                                  width=20,
                                  height=seesawStickHeight
                                );
const SeesawLink = initWorldObj("static", "seesawLink", COLOR.distractor,
                                x=SeesawStick.x,
                                y=yPos(seesawLinkHeight, SeesawStick.height,
                                  SeesawStick.y),
                                width=10,
                                height =  seesawLinkHeight
                              );
const SeesawPlank = initWorldObj("seesawPlank", "seesawPlank", COLOR.seesaw.plank,
                                  x=SeesawStick.x,
                                  y=yPos(seesawPlankHeight, SeesawLink.height,
                                    SeesawLink.y),
                                  width=2.5 * BLOCKS.height,
                                  height=10
                                );
const SeesawPodest = initWorldObj("block", "seesawPodest", COLOR.distractor,
                                  x=SeesawStick.x + 0.1 * seesawPodestWidth,
                                  y=yPos(seesawPodestHeight, SeesawPlank.height,
                                         SeesawPlank.y),
                                  width=seesawPodestWidth,
                                  height=seesawPodestHeight
                                );

let distractorPlatformW = PlatformProp2Val["width"]["narrow"];
let distractorPlatformH = PlatformProp2Val["height"]["default"];
let distractorPlatformX = CANVAS.width - distractorPlatformW / 2;
let distractorPlatformY = yPos(distractorPlatformH, GROUND.height, GROUND.y);
const DISTRACTOR = {
  "platform": initWorldObj("platform", "distractorPlatform", COLOR.platforms,
                           x=distractorPlatformX,
                           y=distractorPlatformY,
                           width=distractorPlatformW,
                           height=distractorPlatformH
                          ),
  "block":
    initWorldObj("block", "distractorBlock", COLOR.distractor,
                 x=blockXpos(BLOCKS.width, distractorPlatformW, distractorPlatformX,
                             "left", "uncertain"),
                 y=yPos(BLOCKS.height, distractorPlatformH, distractorPlatformY),
                 width=BLOCKS.width,
                 height=BLOCKS.height
                )
};

const CATEGORIES = {
  "prior": ["high", "low", "uncertain"],
  "orientation": ["vertical", "horizontal"],
  "position": ["side", "stack_A_on_C", "stack_C_on_A"],
  "platform.type": ["basic1", "basic2", "seesaw"],
  "platform.height": ["default", "high"],
  "platform.width": ["default", "narrow", "very_narrow"],
  "platform.dist": ["default", "short", "very_short", "extreme_short"]
};


/*
* @param kind static, block, default
*/
function initWorldObj(kind, label, color, x=0, y=0, width=0, height=0){
  let obj = {"x": x, "y": y, "width": width, "height": height,
             "properties": {label: label,
                            render: {"fillStyle": color},
                            restituition: RESTITUITIONS.default,
                            density: DENSITIES.default,
                            isStatic: false,
                            friction: FRICTIONS.default
                           }
            };
  if (kind == "block"){
    obj.properties.density = DENSITIES.blocks;
  } else if (kind == "platform") {
    obj.properties.density = DENSITIES.platforms;
  }
  if (kind == "static"){
    obj.properties.isStatic = true;
  }
  if (kind == "seesawPlank"){
    obj.properties.density = DENSITIES.seesawPlank;
  }
  return obj
}



// OLD
// const canvH = 400;
// const canvW = 800;
//
// groundH = 20;
//
// platformH = 100;
// platformW = 150;
// const platformY = canvH - (platformH / 2) - groundH;
// const platformX = canvW / 3
//
// const platform2H = platformH + platformH / 1.5
// const CONFIG = {
//   "simulation": {"duration": 1000},
//
//   "blocks": {"width": 40, "height": 60, "dist2Edge": 5, "step": 10, "friction": 0.75},
//
//   "canvas": {"width": canvW, "height": canvH},
//
//   "ground": {"width": canvW, "height": groundH,
//              "x": canvW / 2, "y": canvH - groundH / 2
//             },
//
//   "platform": {"width": platformW, "height": platformH,
//                "x": platformX, "y": platformY,
//                "yTop": platformY - platformH / 2
//              },
//
//   "platform2": {"close": {"width": platformW, "height": platform2H,
//                           "x": (platformX + (platformW / 2)) + 1.5 * platformW,
//                           "y": canvH - (platform2H / 2) - groundH
//                           },
//                 "far": {"width": platformW, "height": platform2H,
//                         "x": (platformX + (platformW / 2)) + 3 * platformW,
//                         "y": canvH - (platform2H / 2) - groundH
//                         }
//                 }
//
// };
//
// CONFIG.distractors = {"width": CONFIG.blocks.width,
//                       "height": CONFIG.blocks.height * 3}

const Constraint = Matter.Constraint;
/**
* Determines minimal and maximal x value for (center of) a block that is put on
* top of another block.
*
* @param {Object} bounds  coordinates of bounds of block beneath
* @param {number} width  width of block for which xrange is determined
* @param {number} dist2Edge minimal distance to edge of block beneath
*
* @return {Array<number>} all possible x values of block on top
*/
getXRange = function(bounds, width, dist2Edge, step){
  var xMin = bounds.min.x - (width / 2) + dist2Edge
  var xMax = bounds.max.x + (width / 2) - dist2Edge
  return _.range(xMin, xMax, step)
}


/**
 * Creates a block with the given properties.
 *
 * @param {Matter.Bodies.rectangle} coords  coordinates
 * @param {number} coords.x x value of center of block to create
 * @param {number} coords.y y value of center of block to create
 * @param {number} coords.width width of block to create
 * @param {number} coords.height height of block to create
 *
 * @param {Object} properties properties of block to create
 * @param {string} properties.color color of block to create
 * @param {Boolean} properties.static whether block shall be static
 *
 * @return {Matter.Bodies.rectangle} a single block
 */
makeBlock = function(data){
  var block = Matter.Bodies.rectangle(data.x, data.y, data.width, data.height,
                                      data.properties);
  block.add2World = true;
  return(block)
}

setBlockExtensions = function(obj, orientation){
  obj.width = orientation == "vertical" ? BLOCKS.width : BLOCKS.height
  obj.height = orientation == "vertical" ? BLOCKS.height : BLOCKS.width
}

/**
*
*/
setPlatformExtensions = function(obj, data, platform){
  obj.width = mapProperty2Val(data, platform + ".width")
  obj.height = mapProperty2Val(data, platform + ".height")
}

setup2Blocks1Base = function(data, b1, b2, base){
  if(data["AC.position"] == "side"){
    b1.x = blockXpos(b1.width, base.width, base.x, "left", data.pa)
    b2.x = blockXpos(b2.width, base.width, base.x, "right", data.pc)
    b1.y = yPos(b1.height, base.height, base.y)
    b2.y = yPos(b2.height, base.height, base.y)

  } else if(data["AC.position"] == "stack_A_on_C"){
      b2.x = blockXpos(b2.width, base.width, base.x, "left", data.pc)
      b1.x = blockXpos(b1.width, b2.width, b2.x, "right", data.pa)
      b2.y = yPos(b2.height, base.height, base.y)
      b1.y = yPos(b1.height, b2.height, b2.y)

  } else {
      // block C stacked on A
      b1.x = blockXpos(b1.width, base.width, base.x, "left", data.pa)
      b2.x = blockXpos(b2.width, b1.width, b1.x, "right", data.pc)
      b1.y = yPos(b1.height, base.height, base.y)
      b2.y = yPos(b2.height, b1.height, b1.y)
    }
}

setupBasic1 = function(data, p1, b1, b2){
  p1.x = Dist2Side + SceneArea / 2
  p1.y = yPos(p1.height, GROUND.height, GROUND.y);
  setup2Blocks1Base(data, b1, b2, p1);
}

setupBasic2 = function(data, p1, p2, b1, b2){
  let w1 = mapProperty2Val(data, "platform1.width")
  let w2 = mapProperty2Val(data, "platform2.width")
  let w3 = mapProperty2Val(data, "platform.dist")
  let width = w1 + w2 + w3
  let offsetX = (SceneArea - width) / 2

  // x,y platforms
  p1.x = Dist2Side + offsetX + mapProperty2Val(data, "platform1.width") / 2;
  p2.x = SceneEdges.right - offsetX - p2.width / 2;
  p1.y = yPos(p1.height, GROUND.height, GROUND.y);
  p2.y = yPos(p2.height, GROUND.height, GROUND.y);

  // x,y blocks
  let edgeB1 = "right";
  if(data.id == "S93-1674"){
    edgeB1 = "left";
  }
  b1.x = blockXpos(b1.width, p1.width, p1.x, edgeB1, data.pa)
  b2.x = blockXpos(b2.width, p2.width, p2.x, "left", data.pc)
  b1.y = yPos(b1.height, p1.height, p1.y)
  b2.y = yPos(b2.height, p2.height, p2.y)
}

setLocationObjs = function(objs, data){
  let pType = data["platform.type"]
  if (pType == "seesaw"){
    setup2Blocks1Base(data, objs.b1, objs.b2, objs.plank);
    if (data.id == "S97-1674") {
      objs.b2.x = objs.podest.x - 0.5 * objs.b2.width;
      objs.b1.x = objs.b2.x + objs.b2.width / 2 + objs.b1.width / 2;
      objs.b2.y -= objs.podest.height
      objs.b1.y -= objs.podest.height
    } else if(data.id == "S42-806") {
        // let offset = objs.stick.x - objs.b2.x - 20
        // objs.b1.x += offset
        objs.b1.x = objs.stick.x
        objs.b2.x = objs.stick.x
      }
  } else {
    if(pType == "basic1") {
      setupBasic1(data, objs.p1, objs.b1, objs.b2)
        if(data.id == "S30-805-dep"){
          objs.b1.x += objs.p1.width / 3;
          objs.b2.x += objs.p1.width / 3;
        }
    } else {
      setupBasic2(data, objs.p1, objs.p2, objs.b1, objs.b2);
    }
  }

}

initBlocks = function(data){
  let colors = Math.random() > 0.5 ? [0, 1] : [1, 0]
  // let colors = [1, 0]; // group1
  // let colors = [0, 1]; // group2
  let b1 = initWorldObj("block", "block1", COLOR.blocks[colors[0]])
  let b2 = initWorldObj("block", "block2", COLOR.blocks[colors[1]]);
  setBlockExtensions(b1, data["A.orientation"]);
  setBlockExtensions(b2, data["C.orientation"]);
  return {b1, b2}
}

initPlatforms = function(data){
  let sceneType = data["platform.type"]
  let objs = {}
  if (sceneType.startsWith("basic")){
    let p1 = initWorldObj("platform", "platform1", COLOR.platforms);
    setPlatformExtensions(p1, data, "platform1")
    objs.p1 = p1

    if(sceneType == "basic2") {
      let p2 = initWorldObj("platform", "platform2", COLOR.platforms);
      setPlatformExtensions(p2, data, "platform2")
      objs.p2 = p2
    }
  } else {
    objs.stick = SeesawStick;
    objs.plank = SeesawPlank;
    objs.link = SeesawLink;
    if (data.id == "S97-1674") {
      objs.podest = SeesawPodest;
    }
  }
  return objs
}

getObjects = function(data){
  let blocks = initBlocks(data)
  let platforms = initPlatforms(data)
  let distractor = {"distractorPlatform": DISTRACTOR.platform,
                    "distractorBlock": DISTRACTOR.block};
  let ground = {"ground": GROUND};
  let objs = Object.assign({}, blocks, platforms, distractor, ground)
  return objs
}


getRandomTrainData = function(){
  let train1_pa = _.sample(["high", "uncertain"]);
  let orientation1 = _.sample(CATEGORIES.orientation);
  let train_data = [
    {"pa": train1_pa,
     "pc": train1_pa=="uncertain" ? "high" : _.sample(CATEGORIES.prior),
     "A.orientation": orientation1,
     // if platforms are close the two blocks should touch because in that case,
     // the form a stable bridge which we want to avoid here.
     "C.orientation": orientation1 == "vertical" ? "horizontal" : "vertical",
     "platform.type": "basic2",
     "AC.position": _.sample(CATEGORIES.position),
     // set to low due to space
     "platform1.height": "default",
     "platform1.width": _.sample(CATEGORIES["platform.width"]),
     "platform2.height": "default",
     "platform2.width": _.sample(CATEGORIES["platform.width"]),
     "platform.dist": "short",
     "id": "train1",
    },
    {"pa": "high",
     "pc": "low",
     "A.orientation": "vertical",
     // if platforms are close the two blocks should touch because in that case,
     // the form a stable bridge which we want to avoid here.
     "C.orientation": "vertical",
     "platform.type": "basic2",
     "AC.position": "-1",
     // set to low due to space
     "platform1.height": "high",
     "platform1.width": "default",
     "platform2.height": "default",
     "platform2.width": "default",
     "platform.dist": "short",
     "id": "train2",
   },
    {"pa": _.sample(CATEGORIES.prior),
     "pc": _.sample(CATEGORIES.prior),
     "A.orientation": _.sample(CATEGORIES.orientation),
     "C.orientation": _.sample(CATEGORIES.orientation),
     "platform.type": "basic1",
     //for basic1 only use stacked blocks since it's easier to generate randomly
     "AC.position": _.sample(["stack_A_on_C", "stack_C_on_A"]),
     // set to low due to space
     "platform1.height": "default",
     "platform1.width": _.sample(CATEGORIES["platform.width"]),
     "id": "train3"
   },
   {"pa": _.sample(CATEGORIES.prior),
    "pc": _.sample(CATEGORIES.prior),
    "A.orientation": _.sample(CATEGORIES.orientation),
    "C.orientation": _.sample(CATEGORIES.orientation),
    "platform.type": "seesaw",
    //for seesaw only use stacked blocks since it's easier to generate randomly
    "AC.position": _.sample(["stack_A_on_C", "stack_C_on_A"]),
    "id": "train4"
    }
];
  return train_data
}


/**
* returns an object, keys: labels, values: x-y-width-height-properties 
*/
defineScene = function(data){
  objs = getObjects(data);
  setLocationObjs(objs, data)
  return objs
}

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

// Module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;
    Events = Matter.Events;
    Runner = Matter.Runner;
    Mouse = Matter.Mouse;
    MouseConstraint = Matter.MouseConstraint;

let engine;
let render;

let globalObjPropsBefore = {};
let globalObjPropsAfter = {};

clearWorld = function(worldObjects){
  removeBodies(worldObjects);
  // // World.clear(engine.world, deep = true) // doesn't remove static objects
  engine.events = {};
  Engine.clear(engine);
}

savePositionsAfterSimulation = function(){
  engine.world.bodies.forEach(function (body) {
    globalObjPropsAfter[body.label] = JSON.parse(JSON.stringify(body.position));
  });
  // document.getElementById("greenAfterX").innerHTML = "X after:" + globalObjPropsAfter["block1"].x
  // document.getElementById("greenAfterY").innerHTML = "Y after:" + globalObjPropsAfter["block1"].y
}

addStopRenderAndClearWorldEvent = function(){
  // after duration of simulation, freeze and save data
  Events.on(engine, 'afterUpdate', function (event) {
    // only do this once after specified nb of ms passed
    if (engine.timing.timestamp >= SIMULATION.duration) {
      console.log(engine.timing.timestamp)
      freezeAnimation();
      // document.getElementById("timestamp").innerHTML = "timestamp:" + engine.timing.timestamp;
      // This freezes what is rendered at this point in time
      Render.stop(render);
      // save body positions + labels after animation
      savePositionsAfterSimulation();
      clearWorld(worldObjects);
    }
  });
}

setupEngineWithRenderer = function(place2Render){
  // create engine
  engine = Engine.create({
    timing: {
      timeScale: 1
    }
  });

  render = Render.create({
    element: place2Render,
    engine: engine,
    options: {
      width: CANVAS.width,
      height: CANVAS.height,
      // showAngleIndicator: true,
      // showCollisions: true,
      // showVelocity: true,
      wireframes: false,
      background: 'transparent'
    }
  });
}

setupEngine = function(place2Render){
  // create engine
  engine = Engine.create({
    timing: {
      timeScale: 1
    }
  });
}

var freezeAnimation = function () {
  engine.timing.timeScale = 0
}


/**
 * shows world to model with given objects.
 *
 * animation is started but directly freezed.
 *
 * @param {Array<Matter.Bodies>} worldObjects
 * @param {Element} place2Render
 */
var setupWorld = function(worldObjects, place2Render=null){
  place2Render === null ? setupEngine() : setupEngineWithRenderer(place2Render);
  // setupEngine(place2Render);
  worldObjects.forEach(function(obj){
    if(obj.add2World){
      World.add(engine.world, obj)
    }
  })
  // save start positions of objects + labels
  engine.world.bodies.forEach(function (body) {
    globalObjPropsBefore[body.label] = JSON.parse(JSON.stringify(body.position));
  });
  // document.getElementById("greenBeforeX").innerHTML = 'before x: ' + globalObjPropsBefore["block1"].x
  // document.getElementById("greenBeforeY").innerHTML = 'before y: ' + globalObjPropsBefore["block1"].y
}

// show simulated world
var showScene = function (){
  Render.run(render);
}

/**
 * runs animation of the simulated world;requires prior call of setupWorld.
 */
var runAnimation = function () {
  addStopRenderAndClearWorldEvent();
  Engine.run(engine);
}

function removeBodies(arr) {
	for (var i=0;i<arr.length;i++) {
		var body = arr[i];
		World.remove(engine.world, body);
	}
}

var forwardAnimation = function(worldObjects){
  var n = 0
  while(n < 500) {
    Engine.update(engine, 10.0)
    n = n + 1
  }
  savePositionsAfterSimulation();
}

/**
* Determines whether relevant objects fell during simulation.
*
* Adds ratio of x/y-values, and based on this whether object fell, of all bodies
* other than ground or platforms.
*
* @return {Array<Object>} list of objects containing the objects label, whether
* it fell, whether it touches the ground, how much it moved in x-direction and
* how much it moved in y-direction.
*/
var simulationEffects = function(){
  let results = {};
  let dataBlocks = _.pick(globalObjPropsBefore, 'block1', 'block2');
  var entries = Object.entries(dataBlocks);
  for (var i=0; i< entries.length; i++){
      let label = entries[i][0];
      // console.log(label)
      let posBefore = entries[i][1];
      var posAfter = globalObjPropsAfter[label]
      // console.log(posAfter)

      // does the block touch the ground? (lies either on long or short side)
      let yHorizontal = GROUND.y - GROUND.height / 2 - BLOCKS.width / 2;
      let yVertical = GROUND.y - GROUND.height / 2 - BLOCKS.height / 2;
      let onGroundVertical = Math.round(posAfter.y - yVertical) == 0;
      let onGroundHorizontal = Math.round(posAfter.y - yHorizontal) == 0;
      let onGround = onGroundVertical || onGroundHorizontal;

      // how much did the block move?
      var movedX = Math.abs(Math.round(posAfter.x - posBefore.x))
      var movedY = Math.round(posAfter.y - posBefore.y)

      // did the block fall?
      var fell = movedY != 0;

      results[label] = {onGround, fell, movedX, movedY};
  }
  return(results)
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
