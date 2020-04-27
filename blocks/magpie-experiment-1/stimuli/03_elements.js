let Walls = {'test': {}, 'train': {}, 'tilted': {}};

// ground of scene
const Bottom = wall(label='bottom', x=scene.w/2, y=scene.h - props.bottom.h/2,
  w=scene.w, h=props.bottom.h);

// base walls
// let W1 = wall(x=320, y=100, w=props.walls.w, h=props.walls.h, 'wallUpLeft');
// let W2 = wall(x= W1.bounds.max.x - 10, y=240, w=props.walls.w, h=props.walls.h, 'wallLowRight');
// let W3 = wall(W2.position.x+4, W2.position.y, props.walls.w + 25, props.walls.h,'wallRampLowInd')
// let W4 = wall(x=550, y=100, w=props.walls.w, h=props.walls.h, 'wallUpRight');
// let W5 = wall(x=420, y=120, w=props.walls.w/1.5, h=props.walls.h, 'wallShortUpLeft');
// let P1 = wall(x=570, y=Bottom.bounds.min.y - 100/2, w=150, h=100, 'platform1');
// let WP1 = wall(x= W1.bounds.max.x - 10, y=220, w=props.walls.w/1.5, h=props.walls.h, 'wallLowRightP1');

let W1 = wall('w1_upLeft', 320, 100);
let W1_2 = wall('w1_2_upRight', 480, 100);

let W2 = wall('w2_lowRight', 420 - 10, 240);

let W3 = wall('w3_rampLowInd', 410+4, 240, props.walls.w + 25)
let W3_2 = wall('w3_2_rampLowInd', 390-4, 240, props.walls.w + 25)

let W4 = wall('w4_upRight', 550, 100);
let W5 = wall('w5_shortUpRight', 420, 120, props.walls.w/1.5);
let W5_2 = wall('w5_2_shortUpLeft', 380, 120, props.walls.w/1.5);

let P1 = wall('platform1', 570, Bottom.bounds.min.y - 100/2, 150, 100);
let WP1 = wall('wp1', 420 - 10, 220, props.walls.w/1.5);
let P2 = wall('platform2', 230, Bottom.bounds.min.y - 100/2, 150, 100);
let WP2 = wall('wp2', 380 + 10, 220, props.walls.w/1.5);


// This is important because, it gets scaled in some trials! Therefore different
// instances are needed!
baseRampTrain = function(){
  return wall('base_wall_ramp', 250+(props.walls.w+25)/2, 225, props.walls.w+25)
}

makeRamp = function(angle, tilt_increase, wallLow){
  let overlap = overlap_shift[ "angle" + Math.abs(angle)];

  let pos = tilt_increase ? {shift_x: 1, w_low_x_edge: wallLow.bounds.max.x} :
    {shift_x: -1, w_low_x_edge: wallLow.bounds.min.x};

  // 1. sin(angle) = h/w_tillted and 2. h² + w_low² = ramp²
  let r = radians(Math.abs(angle))
  let ramp_width = Math.sqrt(Math.pow(100, 2) / (1 - Math.pow(Math.sin(r), 2)))

  let hMiddle = Math.sqrt(Math.pow(ramp_width/2, 2) -
    Math.pow(Math.cos(r)*ramp_width/2, 2));
  let ramp_y = wallLow.position.y - hMiddle;

  let ramp_x = pos.w_low_x_edge + pos.shift_x*ramp_width/2 - pos.shift_x*overlap
  let ramp = wall('ramp' + angle, ramp_x, ramp_y, ramp_width);
  pos.x_edge_w_top = tilt_increase ? ramp.bounds.max.x : ramp.bounds.min.x;

  let wallTop_y = ramp.position.y - hMiddle + props.walls.h/2;
  // let wallTop_y = ramp.bounds.min.y - props.walls.h/2 - 25;

  let wallTop = wall(label = 'ramp_top' + angle,
    x = pos.x_edge_w_top + pos.shift_x * props.walls.w/2 - pos.shift_x * overlap,
    y = wallTop_y - props.walls.h/2
  );
  pos.x_ball = tilt_increase ? wallTop.bounds.min.x - 4 : wallTop.bounds.max.x + 4;

  let a = Math.abs(angle)
  let col = a=== 45 ? cols.blue : a === 30 ? cols.purple : a===25 ?
    cols.orange : a===20 ? cols.yellow : cols.brown;

  let ball1 = ball(pos.x_ball, wallTop.bounds.min.y - props.balls.radius,
                   props.balls.radius, 'ball1', col);
  Body.setAngle(ramp, -pos.shift_x * r);
  return {'tilted': ramp, 'top': wallTop, 'ball': ball1}
}

// let W6 = wall(225, 240, props.walls.w/1.5, props.walls.h, 'wall_seesaw_left');
// let W7 = wall(575, 240, props.walls.w/1.5, props.walls.h, 'wall_seesaw_right');
let W6 = function(){return wall('wall_seesaw_left', 225, 240, props.walls.w/1.5)};
let W7 = function(){return wall('wall_seesaw_right', 575, 240, props.walls.w/1.5)};


// seesaw
seesaw = function(pos){
  let stick = wall('stick', x=pos,
    y=scene.h - props.bottom.h - props.seesaw.stick.h / 2,
    w=props.seesaw.stick.w, h=props.seesaw.stick.h,
    opts={render: {fillStyle: cols.darkgrey}}
  );

  let link = wall('link', pos, stick.bounds.min.y - props.seesaw.link.h/2,
    props.seesaw.link.w, props.seesaw.link.h, {render: {fillStyle: cols.darkbrown}}
  );

  let skeleton = Body.create({'parts': [stick, link],
    'isStatic': true,
    'label': 'skeleton'
  });

  let defPlank = Object.assign({x: pos,
    y: link.bounds.min.y - props.seesaw.plank.h/2,
  }, props.seesaw.plank);
  let plank = rect(defPlank, {'label':'plank', 'render':{'fillStyle':cols.plank}})

  var constraint = Constraint.create({
    pointA: {x: plank.position.x, y: plank.position.y},
    bodyB: plank,
    stiffness: 0.7,
    length: 0
  });
  return {stick, link, skeleton, plank, constraint}
}

// The first two list entries are respectively the bases for block1 and block2
Walls.test = {'independent': [[W1, W3], [W1_2, W3_2]], // tilted wall+ball added dep on prior
              'a_implies_c': [[W5, P1, WP1], [W5_2, P2, WP2]],
              'a_iff_c': []
              };

Walls.test.seesaw_trials = function(offset){
  let objs = seesaw(scene.w/2 + offset)
  let bases = [W6(), W7()];
  bases.forEach(function(wall, i){
    Body.setPosition(wall, {x: wall.position.x + offset, y: wall.position.y})
  });
  let walls = bases.concat([objs.skeleton]);
  return {'walls': walls, 'dynamic': [objs.plank, objs.constraint]}
}

Walls.test.tilted = {};
Walls.test.tilted['independent'] = function(tilt, increase, base){
  let angle = tilt === "steep" ? -45 : -30;
  return _.values(makeRamp(angle, increase, base))
}

Walls.test.tilted["a_implies_c"] = function(tilt, increase, base){
  let angle = tilt === "steep" ? -45 : tilt === 'plane' ? -20 : -30;
  return _.values(makeRamp(angle, increase, base))
}

Walls.test.tilted['a_iff_c'] = function(tilt, increase, base){
  let angle = tilt === "steep" ? -25 : tilt === 'plane' ? -15 : null;
  return _.values(makeRamp(angle, increase, base))
}

//// Elements for TRAINING TRIALS //////
Walls.train.independent = [W4];
Walls.train.tilted_independent =  function(tilt, increase, base) {
  let angle = tilt === "steep" ? -45 : -30;
  let ramp =  makeRamp(angle, increase, base)
  return _.values(ramp)
}

//let W8 = wall(x=scene.w/2, y=scene.h/2, w=props.walls.w, h=props.walls.h, 'wallMiddle');
let W8 = wall('w8_middle_left', (1/4) * scene.w, scene.h/3);
let W9 = wall('w9_middle_right', (3/4) * scene.w, scene.h/3);
let W10 = wall('w10_right_low', (2/3) * scene.w, (3/4) * scene.h);
Walls.train.uncertain = [W8, W9, W10]

Walls.train.a_implies_c = [
  wall('wall_ac_top_left', 400, 100),
  wall('wall_ac_low_right', 100 + props.walls.w/2 - 10, 240)
];

Walls.train.seesaw_trials = function(){
  let objs = seesaw(scene.w/2)
  let angle = 45;
  let ramp = wall('ramp', 200, 175, Math.pow(10,2)*Math.sqrt(2), props.walls.h,
    OPTS['ramp'+angle]);
  Body.setAngle(ramp, radians(angle));
  // first two elements are bases for blocks!
  let walls = [wall('wallTopLeft', 100, 125, 100), W7(), ramp].concat([objs.skeleton]);
  return {'walls': walls, 'dynamic': [objs.plank, objs.constraint]}
}
