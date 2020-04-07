// ground of scene
const Bottom = wall(scene.w/2, scene.h - props.bottom.h/2, scene.w,
  props.bottom.h, 'bottom', cols.grey);

// base walls
let W1 = wall(x=320, y=100, w=props.walls.w, h=props.walls.h, 'w1_high');
let W2 = wall(x= W1.bounds.max.x - 10, y=240, w=props.walls.w, h=props.walls.h, 'w2_low');

let W3 = wall(W2.position.x+4, W2.position.y, props.walls.w + 25, props.walls.h,
  'wall_ind_low_right')

tiltedWallTest = function(angle){

  let w_top, w_tilted, ball1;

  if (Math.abs(angle) === 45){
    w_tilted = wall(W3.bounds.max.x + 50, W3.position.y - 50,
      Math.pow(10,2)*Math.sqrt(2), props.walls.h, 'wall_ind_tilted_' + angle)
    w_top = wall(W3.bounds.max.x - 4 + 100 + props.walls.w/2,
      W3.position.y - 100, props.walls.w, props.walls.h, 'wall_ind_up');

  } else if (Math.abs(angle) === 30){
    w_tilted = wall(W3.bounds.max.x + 50, W3.position.y - 25,
      Math.sqrt(Math.pow(10, 4) + Math.pow(50, 2)), props.walls.h,
      'wall_ind_tilted_' + angle)
    w_top = wall(W3.bounds.max.x - 4 + 100 + props.walls.w/2,
      W3.position.y - 50, props.walls.w, props.walls.h, 'wall_ind_up');
  } else {
    console.warn('only 30 and 45 degrees defined');
  }
  ball1 = ball(w_top.bounds.min.x - 4, w_top.bounds.min.y - props.balls.radius,
               props.balls.radius, 'ball', cols.purple);
  Body.setAngle(w_tilted, radians(angle));
  return [w_tilted, w_top, ball1]
}
let [W4_0, W5_0, Ball_0] = tiltedWallTest(-45);
let [W4_1, W5_1, Ball_1] = tiltedWallTest(-30);

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

let Walls = {'test': {}, 'train': {}};
// The first two list entries are respectively the bases for block1 and block2
Walls.test = {'independent': [W1, W3], // tilted wall+ball added dep on prior
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

// important to generate a NEW ball for each trial, otherwise if the same object
// is used again, it will have moved after the first trial... (stupid me!)
ballTrainIndependentTrials = function(){
  return ball(x=152, y=175-props.walls.h/2-props.balls.radius, r=props.balls.radius,
    'ball', props.balls.color);
}

Walls.train.independent = [
  wall(x=100, y=175, w=100, h=props.walls.h, 'wallTopLeft')
];
Walls.train.independent_steep = [
  wall(x=200, y=225, w=Math.pow(10,2)*Math.sqrt(2), h=props.walls.h, 'wallTilted45'),
  wall(x=250+props.walls.w*1.5/2, y=275, w=props.walls.w*1.5, h=props.walls.h, 'wallDownRight45'),
];
Walls.train.independent_plane = [
  wall(x=200, y=200, w=Math.sqrt(12500), h=props.walls.h, 'wallTilted30'),
  wall(x=250+props.walls.w*1.5/2, y=225, w=props.walls.w*1.5, h=props.walls.h, 'wallDownRight30')
];
Body.setAngle(Walls.train.independent_steep[0], radians(45));
Body.setAngle(Walls.train.independent_plane[0], radians(22.5));


let W8 = wall(x=scene.w/2, y=scene.h/2, w=props.walls.w, h=props.walls.h, 'wallMiddle');
Walls.train.uncertain = [W8]

Walls.train.a_implies_c = [
  wall(400, 100, props.walls.w, props.walls.h, 'wall_ac_top_left'),
  wall(100 + props.walls.w/2 - 10, 240, props.walls.w,
    props.walls.h, 'wall_ac_low_right')
]

Walls.train.a_iff_c = [
  wall(x=100, y=125, w=100, h=props.walls.h, 'wallTopLeft'),
  wall(x=200, y=175, w=Math.pow(10,2)*Math.sqrt(2), h=props.walls.h, 'wallTilted'),
].concat([W7, skeleton, plank, constraint]);
Body.setAngle(Walls.train.a_iff_c[1], radians(45));
