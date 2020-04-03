// base walls
let Walls = {
  'wall1': wall(scene.w/2.5, 0.25*scene.h, props.walls.w,
    props.walls.h, 'wall1'),
  'wall2': wall(scene.w/2.55 + props.walls.w, 0.6*scene.h, props.walls.w,
    props.walls.h, 'wall2'),
  'wall4': wall(643.5, 0.52*scene.h, props.walls.w/2, props.walls.h, 'wall4'),
  'wall6': wall(scene.w/2-175, 0.6*scene.h, props.walls.w/1.5, props.walls.h, 'wall6'),
  'wall7': wall(scene.w/2+175, 0.6*scene.h, props.walls.w/1.5, props.walls.h, 'wall7')
};
Body.setAngle(Walls.wall4, -Math.PI/4);
Walls.wall3 = wall(Walls.wall2.bounds.min.x - props.walls.w/16,
  Walls.wall2.position.y,
  props.walls.w/8, props.walls.h, 'wall3');
Walls.wall5 = wall(Walls.wall4.bounds.max.x+19,
                   Walls.wall4.bounds.min.y + props.walls.h/2,
                   props.walls.w/3, props.walls.h, 'wall5');

// ground of scene
const Bottom = wall(scene.w/2, scene.h - props.bottom.h/2, scene.w,
  props.bottom.h, 'bottom', cols.grey);

// seesaw
let stick = wall(scene.w/2,
  scene.h - props.bottom.h - props.seesaw.stick.h / 2,
  props.seesaw.stick.w,
  props.seesaw.stick.h, 'stick', col=cols.darkgrey);

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

let seesawElems = {skeleton, plank, constraint}
Walls.seesaw = seesawElems;

// Extra Blocks used in some trials
// @arg colors [leftDown, rightDown, leftUp, rightUp]
extraBlocks = function(labels, colors, horiz=true){
  let blocks = {};
  for(var i=0; i<labels.length; i++){
    var id = labels[i];
    let t = (id==="left_down" || id==="right_up") ? 1 : -1;
    let base = id==="left_down" ? Walls.wall6 :
               id==="right_down" ? Walls.wall7 :
               id==="left_up" ? blocks["left_down"] :
               blocks["right_down"];
    blocks[id] = block(base, 0.6*t, props.blocks.w, props.blocks.h, colors[i], id, horiz)
  }
  return blocks;
}
