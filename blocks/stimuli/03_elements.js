let Walls = {'test': {}, 'train': {}, 'tilted': {}};

// ground of scene
const Bottom = wall(scene.w/2, scene.h - props.bottom.h/2, scene.w,
  props.bottom.h, 'bottom', cols.grey);

// base walls
let W1 = wall(x=320, y=100, w=props.walls.w, h=props.walls.h, 'wallUpLeft');
let W2 = wall(x= W1.bounds.max.x - 10, y=240, w=props.walls.w, h=props.walls.h, 'wallLowRight');
let W3 = wall(W2.position.x+4, W2.position.y, props.walls.w + 25, props.walls.h,'wallRampLow')

lowWallIndependent = function(){
  return wall(x=250+(props.walls.w+25)/2, y=225, w=props.walls.w+25,
    h=props.walls.h, 'wallDownRight')
}

rampIndependent = function(angle, tilt_increase){
  let wallLow = lowWallIndependent();
  let overlap = overlap_shift["angle"+Math.abs(angle)];
  let shift_x, w_low_x_edge;
  if (tilt_increase) {
    w_low_x_edge = wallLow.bounds.max.x;
    shift_x = 1;
  } else {
    w_low_x_edge =  wallLow.bounds.min.x;
    shift_x = -1;
  }
  // 1. sin(angle) = h/w_tillted and 2. h² + w_low² = ramp²
  let r = radians(Math.abs(angle))
  let ramp_width = Math.sqrt(Math.pow(100, 2) / (1 - Math.pow(Math.sin(r), 2)))

  let hMiddle = Math.sqrt(Math.pow(ramp_width/2, 2) - Math.pow(Math.cos(r)*ramp_width/2, 2));
  let ramp_y = wallLow.position.y - hMiddle;

  let ramp = wall(w_low_x_edge + shift_x * ramp_width/2 - shift_x * overlap,
    ramp_y, ramp_width, props.walls.h, 'ramp' + angle)

  let wallTop_y = ramp.position.y - hMiddle + props.walls.h/2;
  let x = tilt_increase ? ramp.bounds.max.x : ramp.bounds.min.x;
  let wallTop = wall(x + shift_x * props.walls.w/2 - shift_x * overlap,
    wallTop_y - props.walls.h/2, props.walls.w, props.walls.h, 'ramp_top'+angle);
  if (tilt_increase) {
    ball_x = wallTop.bounds.min.x - 4
  } else {
    ball_x = wallTop.bounds.max.x + 4
  }
  let ball1 = ball(ball_x, wallTop.bounds.min.y - props.balls.radius,
                   props.balls.radius, 'ball1', cols.purple);
  Body.setAngle(ramp, -shift_x * r);
  return {'tilted': ramp, 'top': wallTop, 'ball': ball1}
}
Walls.tilted = {
  'angle45': _.values(rampIndependent(W3, -45, true)),
  'angle30': _.values(rampIndependent(W3, -30, true))
}
let W6 = wall(225, 240, props.walls.w/1.5, props.walls.h, 'wall_seesaw_left');
let W7 = wall(575, 240, props.walls.w/1.5, props.walls.h, 'wall_seesaw_right');

// seesaw
let stick = wall(scene.w/2, scene.h - props.bottom.h - props.seesaw.stick.h / 2,
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

// Elements for TRAINING TRIALS

Walls.train.independent_steep = _.values(rampIndependent(-45, false));
Walls.train.independent_plane = _.values(rampIndependent(-30, false));

let W8 = wall(x=scene.w/2, y=scene.h/2, w=props.walls.w, h=props.walls.h, 'wallMiddle');
Walls.train.uncertain = [W8]

Walls.train.a_implies_c = [
  wall(400, 100, props.walls.w, props.walls.h, 'wall_ac_top_left'),
  wall(100 + props.walls.w/2 - 10, 240, props.walls.w,
    props.walls.h, 'wall_ac_low_right')
]

Walls.train.a_iff_c = [
  wall(x=100, y=125, w=100, h=props.walls.h, 'wallTopLeft'),
  wall(x=200, y=175, w=Math.pow(10,2)*Math.sqrt(2), h=props.walls.h, 'ramp'),
].concat([W7, skeleton, plank, constraint]);
Body.setAngle(Walls.train.a_iff_c[1], radians(45));
