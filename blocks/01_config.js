var scene = {w: 800, h: 400};
props = {'blocks': {'w':40, 'h': 80},
         'walls': {'w': 200, 'h': 20},
         'balls': {'diameter': 16},
         'bottom': {'w': scene.w, 'h': 20},
         'seesaw': {'stick': {'w': 20, 'h': 70},
                    'plank': {'w': 220, 'h': 10},
                    'link': {'w': 5, 'h': 10}
                  }
       };

options = {
  'walls': {isStatic: true, restitution: 0.01},
   // at density=0.02, the block also makes the second block fall!
  'balls': {isStatic: false, restitution: 0, friction: 0.001, density: 0.04},
  'blocks': {isStatic: false, restitution: .01, friction: 0.05},
  'seesaw_plank': {isStatic: false}
}

let relations = ['a_implies_c', 'a_iff_c', 'independent'];
// Proportion of blocks that's on top of their base walls
let prior = {'high': 0.35, 'uncertain': 0.5, 'low': 0.68}
