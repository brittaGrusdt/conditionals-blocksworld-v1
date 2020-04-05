// ground of scene
const Bottom = wall(scene.w/2, scene.h - props.bottom.h/2, scene.w,
  props.bottom.h, 'bottom', cols.grey);

// base walls
let W1 = wall(320, 100, props.walls.w, props.walls.h, 'wall_ac_top_left');
let W2 = wall(W1.bounds.max.x - 10 + props.walls.w/2, 240, props.walls.w,
  props.walls.h, 'wall_ac_low_right');
let W3 = wall(W2.position.x+4, W2.position.y, props.walls.w + 25, props.walls.h,
  'wall_ind_low_right')
let W4 = wall(W3.bounds.max.x + 50, W3.position.y - 50, Math.pow(10,2)*Math.sqrt(2),
  props.walls.h, 'wall_ind_tilted')
Body.setAngle(W4, -Math.PI/4);
let W5 = wall(W3.bounds.max.x - 4 + 100 + props.walls.w/2, W3.position.y - 100,
  props.walls.w, props.walls.h, 'wall_ind_up');

let W6 = wall(225, 240, props.walls.w/1.5, props.walls.h, 'wall_seesaw_left');
let W7 = wall(575, 240, props.walls.w/1.5, props.walls.h, 'wall_seesaw_right');

// seesaw
let stick = wall(scene.w/2,
  scene.h - props.bottom.h - props.seesaw.stick.h / 2,
  props.seesaw.stick.w, props.seesaw.stick.h, 'stick', col=cols.darkgrey);

let link = wall(x=scene.w/2, y=stick.bounds.min.y - props.seesaw.link.h/2,
  w=props.seesaw.link.w, h=props.seesaw.link.h, label='link', col=cols.brown);

let skeleton = Body.create({
      'parts': [stick, link],
      'isStatic': true,
      'label': 'skeleton'
  });

let defPlank = Object.assign({'x': scene.w/2,
  'y': link.bounds.min.y - props.seesaw.plank.h/2,
}, props.seesaw.plank);
let plank = rect(defPlank, {'label': 'plank', 'render': {'fillStyle': cols.plank}});

var constraint = Constraint.create({
    pointA: {x: plank.position.x, y: plank.position.y},
    bodyB: plank,
    stiffness: 0.7,
    length: 0
});

// Ball used in independent trials
let ball1 = ball(W5.bounds.min.x - 4, W5.bounds.min.y - props.balls.radius,
                 props.balls.radius, 'ball', cols.purple);

let Walls = {'test': {}, 'train': {}};
// The first two list entries are respectively the bases for block1 and block2
Walls.test = {'independent': [W1, W3, W4, W5, ball1],
             'a_implies_c': [W1, W2],
             'a_iff_c': [W6, W7, skeleton, plank, constraint]
            };

// Extra block used in iff trials
extraBlock = function(label, color, horiz=true){
  let t = label==="xblock_left" ? 1 : -1;
  let base = label==="xblock_left" ? W6 : W7;
  return block(base, 0.6*t, color, label, undefined, undefined, horiz)
}

// Elements for training trials
Walls.train.independent = [
  wall(x=100, y=175, w=100, h=props.walls.h, 'wallTopLeft'),
  wall(x=200, y=225, w=Math.pow(10,2)*Math.sqrt(2), h=props.walls.h, 'wallTilted'),
  wall(x=250+props.walls.w*1.5/2, y=275, w=props.walls.w*1.5, h=props.walls.h, 'wallDownRight'),
  ball(x=150, y=175-props.walls.h/2-props.balls.radius, r=props.balls.radius,
    'ball', props.balls.color)
];
Body.setAngle(Walls.train.independent[1], radians(45));

let W8 = wall(x=scene.w/2, y=scene.h/2, w=props.walls.w, h=props.walls.h, 'wallMiddle');

Walls.train.uncertain = [W8]

Walls.train.a_implies_c = [
  wall(x=W1.position.x, y=W2.position.y, w=props.walls.w, h=props.walls.h, 'w1_low'),
  wall(x=W2.position.x + 35, y=W1.position.y, w=props.walls.w, h=props.walls.h, 'w2_high')
]
