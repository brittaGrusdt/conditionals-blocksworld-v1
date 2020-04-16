blockOnBase = function(base, propOnBase, color, label, w=props.blocks.w,
  h=props.blocks.h, horiz=false) {
  let w_new = horiz ? h : w;
  let h_new = horiz ? w : h;
  let x = propOnBase < 0 ? base.bounds.min.x - propOnBase * w_new - w_new/2 :
    base.bounds.max.x + (1-propOnBase) * w_new - w_new/2;
  let obj = Bodies.rectangle(x, base.bounds.min.y - h_new/2, w_new, h_new, options.blocks);
  obj.render.fillStyle = color;
  obj.id = label;
  return obj;
}
block = function(pos, col, id, horiz=false, opts={}){
  let w = horiz ? props.blocks.h : props.blocks.w;
  let h = horiz ? props.blocks.w : props.blocks.h;
  opts = Object.assign(opts, {id, 'render': {'fillStyle': col}});
  return Bodies.rectangle(pos.x, pos.y_min - h/2, w, h, opts);
}

rect = function(props, opts={}){
  return Bodies.rectangle(props.x, props.y, props.w, props.h, opts);
}

wall = function(x, y, w, h, label, col=cols.grey, opts={}){
  opts = Object.assign(opts, options.walls, {render: {fillStyle: col}, 'id': label});
  return Bodies.rectangle(x, y, w, h, opts);
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

let lengthOnBase = function(p_fall, horizontal){
    return horizontal ? prior[p_fall] * props.blocks.h : prior[p_fall] * props.blocks.w;
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
  let keys = _.keys(prior);
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
