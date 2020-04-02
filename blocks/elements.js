// base walls
let Walls = {
  'wall1': wall(scene.w/2.5, 0.3*scene.h, props.walls.w,
    props.walls.h, 'wall1'),
  'wall2': wall(scene.w/2.5 + props.walls.w, 0.7*scene.h, props.walls.w,
    props.walls.h, 'wall2'),
  'wall4': wall(646.5, 0.62*scene.h, props.walls.w/2, props.walls.h, 'wall4'),
  'wall6': wall(scene.w/2-175, 0.6*scene.h, props.walls.w/1.5, props.walls.h, 'wall6'),
  'wall7': wall(scene.w/2+175, 0.6*scene.h, props.walls.w/1.5, props.walls.h, 'wall7')
};
Body.setAngle(Walls.wall4, -Math.PI/4);
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
let plank = rect(defPlank, {'label': 'plank'});

var constraint = Constraint.create({
    pointA: {x: plank.position.x, y: plank.position.y},
    bodyB: plank,
    length: 0
});

let seesawElems = {skeleton, plank, constraint}
Walls.seesaw = seesawElems;
