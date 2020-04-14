const DEBUG = true;
// var MODE = "train"
// var MODE = "test"
var MODE = "experiment"

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

options = {
  'walls': {isStatic: true, restitution: 0.01},
   // at density=0.02, the block also makes the second block fall!
  'balls': {isStatic: false, restitution: 0, friction: 0.001, density: 0.1},
  'blocks': {isStatic: false, restitution: .02, friction: 0.05, density: 0.006},
  'seesaw_plank': {isStatic: false}
}

let Relations = ['a_implies_c', 'a_iff_c', 'independent'];
// Proportion of blocks that's on top of their base walls
let prior = {'high': 0.35, 'uncertain': 0.54, 'low': 0.68}


// for independent trials, one block is shifted to the right depending on prior
let independent_shift = {"high": 12, "low": 85, "uncertain": 25};
let overlap_shift = {"angle45": 25, "angle30": 14.5}

let SIMULATION = {'duration': 5000};
