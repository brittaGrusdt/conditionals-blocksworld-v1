var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;
    Constraint = Matter.Constraint;

var scene = {w: 800, h: 400};
props = {'blocks': {'w':40, 'h': 80},
         'walls': {'w': 200, 'h': 20},
         'bottom': {'w': scene.w, 'h': 20}
        };
options = {
  'walls': {isStatic: true, restitution: 1},
  'balls': {isStatic: false, restitution: 1, friction: 0},
  'blocks': {isStatic: false, restitution: .01, friction: 0.05}
}

// Proportion of blocks that's on top of their base walls
let prior = {'high': 0.3,
             'uncertain': 0.5,
             'low': 0.8};
cols = {
  'red': '#E74C3C',
  'blue': '#2471A3',
  'green': '#28B463',
  'purple': '#AF7AC5',
  'brown': '#975019',
  'darkbrown': '#874400',
  'grey': '#E3DFDC',
  'darkgrey': '#666C70',
  'black': '#191817'
}
cols.blocks = [cols.purple, cols.green];

wall = function(x, y, w, h, label, col=cols.grey, opts={}){
  opts = Object.assign(opts, options.walls, {render: {fillStyle: col}});
  opts = Object.assign(opts, {'id': label});
  return Bodies.rectangle(x, y, w, h, opts);
}

block = function(base, propOnBase, w, h, color='#884EA0', horizontal=false){
  let w_new = horizontal ? h : w;
  let h_new = horizontal ? w : h;
  let x = propOnBase < 0 ? base.bounds.min.x - propOnBase * w_new - w_new/2 :
    base.bounds.max.x + (1-propOnBase) * w_new - w_new/2;
  let obj = Bodies.rectangle(x, base.bounds.min.y - h_new/2, w_new, h_new, options.blocks);
  obj.render.fillStyle = color;
  return obj;
}

// base walls
let walls = {
  'wall1': wall(scene.w/2.5, 0.3*scene.h, props.walls.w,
    props.walls.h, 'wall1'),
  'wall2': wall(scene.w/2.5 + props.walls.w, 0.7*scene.h, props.walls.w,
    props.walls.h, 'wall2')
};

// ground of scene
var bottom = wall(scene.w/2, scene.h - props.bottom.h/2, scene.w, props.bottom.h, 'bottom');

ball = function(x, y, r, label, color, opts=options.balls){
  opts = Object.assign(opts, {'id': label,
                              'render': {'fillStyle': color}
                             });
  return Bodies.circle(x, y, r, opts);
}

radians = function(angle){
  return (2 * Math.PI / 360) * angle;
}

move = function(obj, pos_hit, angle, force){
  let pos = pos_hit == "center" ? obj.position : {};
  let x = Math.cos(radians(angle)) * force * obj.mass;
  let y = Math.sin(radians(angle)) * force * obj.mass;
  Body.applyForce(obj, pos, {x, y});
}
