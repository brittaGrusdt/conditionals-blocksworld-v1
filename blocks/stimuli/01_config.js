const DEBUG = true;
// var MODE = "color-vision"
// var MODE = "train"
var MODE = "test"
// var MODE = "experiment"

var scene = {w: 800, h: 400};
props = {'blocks': {'w':40, 'h': 80},
         'walls': {'w': 200, 'h': 20},
         'balls': {'radius': 16, 'color': cols.purple},
         'bottom': {'w': scene.w, 'h': 20},
         'seesaw': {'stick': {'w': 20, 'h': 80},
                    'plank': {'w': 220, 'h': 10},
                    'link': {'w': 5, 'h': 10}
                  }
       };

OPTS = {
  'walls': {isStatic: true, render: {fillStyle: cols.grey}},
  'balls': {isStatic: false, restitution: 0, friction: 0.001, density: 0.1},
  'blocks': {isStatic: false, density: 0.006, restitution: .02}, //, friction: 0.05},
  'seesaw_plank': {isStatic: false},
  'ramp45' : {render: {fillStyle: cols.black}},
  'ramp30' : {render: {fillStyle: cols.brown}},
  'ramp25' : {render: {fillStyle: cols.purple}},
  'ramp20' : {render: {fillStyle: cols.orange}},
  'ramp15' : {render: {fillStyle: cols.yellow}}
}

let Relations = ['a_implies_c', 'a_iff_c', 'independent'];
// Proportion of blocks that's on top of their base walls
// let PRIOR = {'high': 0.35, 'uncertain': 0.54, 'low': 0.68, 'very_low': 0.85}
let PRIOR = {'high': 0.35, 'uncertain': 0.51, 'low': 0.68, 'very_low': 0.85}

// for independent trials, one block is shifted to the right depending on prior
let independent_shift = {"high": 12, "uncertain": 25, "low": 85, "very_low": 100};
let iff_shift = {"high": 12, "uncertain": 25, "low": 70, "very_low": 100};

let overlap_shift = {"angle45": 25, "angle30": 14.5, "angle15": 7,
  "angle25": 10, "angle20": 7}

let SIMULATION = {'duration': 5000};
