blockOnBase = function(base, propOnBase, color, label, horiz=false) {
  let w = horiz ? props.blocks.h : props.blocks.w;
  let h = horiz ? props.blocks.w : props.blocks.h;
  // when propOnBase is negative, block is put on left side of the base, else right side
  let edge = propOnBase < 0 ? "min" : "max"
  let factor = propOnBase < 0 ? - propOnBase : (1-propOnBase)
  let x = base.bounds[edge]["x"] + factor * w - w / 2;

  let opts = Object.assign({'render': {'fillStyle': color}, label}, OPTS.blocks)
  return Bodies.rectangle(x, base.bounds.min.y - h / 2, w, h, opts);
}

block = function(x, y_min_base, col, label, horiz=false, opts={}){
  let w = horiz ? props.blocks.h : props.blocks.w;
  let h = horiz ? props.blocks.w : props.blocks.h;
  opts = Object.assign(opts, {'render': {'fillStyle': col}, label}, OPTS.blocks)
  return Bodies.rectangle(x, y_min_base - h/2, w, h, opts);
}

rect = function(props, opts={}){
  opts = Object.assign(opts, OPTS.blocks);
  return Bodies.rectangle(props.x, props.y, props.w, props.h, opts);
}

wall = function(label, x, y, w=props.walls.w, h=props.walls.h, opts={}){
  opts = Object.assign({label}, opts, OPTS.walls);
  return Bodies.rectangle(x, y, w, h, opts);
}

ball = function(x, y, r, label, color, opts={}){
  opts = Object.assign({label, 'render': {'fillStyle': color}}, opts,OPTS.balls)
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

let lengthOnBase = function(p_fall, horiz){
  return horiz ? PRIOR[p_fall] * props.blocks.h : PRIOR[p_fall] * props.blocks.w
}

sortConditions = function(conditions){
  let filtered = {};
  let iff = [];
  Relations.forEach(function(rel){
    filtered[rel] = [];
  })
  conditions.forEach(function(arr){
    // in iff trials, prior a-b = prior b-a, use only once
    if(arr[2] === "a_iff_c") {
      let pr = arr.slice(0,2).join("_")
      let add = false;
      if(!iff.includes(arr[1] + "_" + arr[0])){
        iff.push(pr);
        add = true;
      }
      if(add) {
        filtered[arr[2]].push(arr)
      }
    }else {
      filtered[arr[2]].push(arr);
    }
  });
  return filtered
}

/**
*@return Object with key-val pairs:
 independent: [[pa,pc,"independent"], ...]
 a_iff_c: [[pa,pc, "a_iff_c"], ...]
 a_implies_c: [[pa, pc, "a_implies_c"], ...]
**/
getConditions = function(){
  let keys = _.keys(PRIOR);
  let probs = [];
  keys.forEach(function(p){
    let vals = new Array(keys.length).fill(p);
    probs = probs.concat(_.zip(vals, keys));
  });
  let combis = [];
  probs.forEach(function(ps){
    Relations.forEach(function(r){
      combis.push(ps.concat(r))
    })
  })
  return sortConditions(combis);
}

assignColors = function(){
  let col1 = _.random(0, 1);
  let col2 = col1 === 1 ? 0 : 1;
  return [col1, col2];
}
