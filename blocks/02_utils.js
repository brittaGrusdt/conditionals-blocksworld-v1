block = function(base, propOnBase, w, h, color, label, horizontal=false){
  let w_new = horizontal ? h : w;
  let h_new = horizontal ? w : h;
  let x = propOnBase < 0 ? base.bounds.min.x - propOnBase * w_new - w_new/2 :
    base.bounds.max.x + (1-propOnBase) * w_new - w_new/2;
  let obj = Bodies.rectangle(x, base.bounds.min.y - h_new/2, w_new, h_new, options.blocks);
  obj.render.fillStyle = color;
  obj.label = label;
  return obj;
}

wall = function(x, y, w, h, label, col=cols.grey, opts={}){
  opts = Object.assign(opts, options.walls, {render: {fillStyle: col}, 'id': label});
  return Bodies.rectangle(x, y, w, h, opts);
}

rect = function(props, opts={}){
    return Bodies.rectangle(props.x, props.y, props.w, props.h, opts);
}

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

getConditions = function(){
  let keys = _.keys(prior);
  let probs = [];
  keys.forEach(function(p){
    let vals = new Array(keys.length).fill(p);
    probs = probs.concat(_.zip(vals, keys));
  });
  let combis = [];
  probs.forEach(function(ps){
    relations.forEach(function(r){
      combis.push(ps.concat(r))
    })
  })
  return combis
}

filterConditions = function(conditions, val, keep=true){
  let filtered = _.filter(conditions, function(arr){
    return keep ? arr.includes(val) : !arr.includes(val)
  })
  return filtered
}

assignColors = function(){
  let col1 = _.random(0, 1);
  let col2 = col1 === 1 ? 0 : 1;
  return [col1, col2];
}

addObjs2World = function(stimulus){
  let keys = _.keys(stimulus);
  keys = _.filter(keys, function(k){return k!== "data"});
  let objs = [Bottom];
  keys.forEach(function(k){
    if(k === "seesaw"){
      objs = objs.concat(_.values(stimulus[k]));
    } else {
      objs = objs.concat(stimulus[k])
    }
      // stimulus.walls.forEach(function(val){
        // if(val !== 'none'){
          // objs.push(Walls[val]);
        // }
      // });
    // } else if(k === "seesaw"){
  });
  World.add(engine.world, objs);
}
