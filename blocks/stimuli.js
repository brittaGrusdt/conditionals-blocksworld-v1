// conditions cotains combis of P(A) and P(C) from [high, low, uncertain]
var conditions = getConditions();

createStimuli = function(){
  let trials_iff = _stimuli_iff(conditions["a_iff_c"], "a_iff_c");
  let trials_ac = _stimuli(conditions["a_implies_c"], "a_implies_c");
  let trials_ind = _stimuli(conditions["independent"], "independent");
  let trials = Object.assign(trials_iff, trials_ac, trials_ind);
  return trials;
}

_add_blocks = function(bases, data, sides){
  let priors = [prior[data[0]], prior[data[1]]];
  let colors = assignColors();
  let b1 = block(base=bases[0], propOnBase=priors[0] * sides[0],
    w=props.blocks.w, h=props.blocks.h, color=cols.blocks[colors[0]],
    'block1', horizontal = data[0]==="low" || data[0]==="uncertain");

  let b2 = block(base=bases[1], propOnBase=priors[1] * sides[1],
    w=props.blocks.w, h=props.blocks.h, color=cols.blocks[colors[1]],
    'block2', horizontal = data[1]==="low" || data[1]==="uncertain");
  return [b1, b2]
}

// add addtional walls and ball for all independent trials
_add_scene_ind = function(prior){
  let ball1 = ball(Walls['wall5'].bounds.min.x - 4,
                   Walls['wall5'].bounds.min.y - props.balls.diameter,
                   props.balls.diameter, 'ball', cols.purple);
  let objs = [Walls.wall4, Walls.wall5, ball1]
  let w3 = Walls.wall3;
  if(prior === "low"){
    objs.push(w3);
  } else if(prior === "uncertain"){
    let extend = 30
    w3.setPosition = {x: w3.position.x - extend, y: w3.position.y}
    w3.setWidth = w3.bounds.max.x - w3.bounds.min.x + 2*extend;
    objs.push(w3);
  }
  return objs
}

/**
* @arg data [[pa, pc],..] conditions for priors of events A,C (high/uncertain/low)
* @arg relation str one of <independent, a_implies_c>
**/
_stimuli = function(data, relation){
  let bases = [Walls.wall1, Walls.wall2]
  // on which edge of the platform the blocks will be placed (right:1/left:-1)
  let sides = relation==="independent" ? [-1,-1] : [1, -1];

  let stimuli = {};
  for(var i=0; i<data.length; i++){
    let id = 'id_'+relation+'_'+i;
    let priors = data[i];
    stimuli[id] = {};
    let blocks = _add_blocks(bases, data[i], sides);
    if(relation === "independent"){
      stimuli[id].other = _add_scene_ind(priors[1]);
      let b2 = blocks[1];
      let shift = independent_shift[priors[1]];
      Matter.Body.setPosition(b2, {x: b2.position.x + shift, y: b2.position.y});
    }
    stimuli[id] = Object.assign(stimuli[id],
      {'walls': bases, 'data': data[i], blocks}
    );
  }
  return stimuli
}

_stimuli_iff = function(data, relation='a_iff_c'){
  let stimuli = {};
  let bases = [Walls['wall6'], Walls['wall7'],]
  // let labels =  {'left': ['left_down', 'left_up'], 'right': ['right_down', 'right_up']};
  let labels =  {'left': ['left_down'], 'right': ['right_down']};
  for(var i=0; i<data.length; i++){
    let d = data[i]
    let side = (d.includes("high") && d.includes("low")) ? _.indexOf(d,"low") :
               (d.includes("high") && d.includes("uncertain")) ? _.indexOf(d, "uncertain") :
               _.random(0, 1);
    let ids = side == 0 ? labels.left : labels.right;
    let xblocks = extraBlocks(ids, [cols.darkgrey]);
    let blockBases = side === 0 ? [xblocks.left_down, Walls.wall7] : [Walls.wall6, xblocks.right_down];
    let sides = side === 0 ? [-1, -1] : [1, 1]
    let blocks = _add_blocks(blockBases, d, sides);
    stimuli['id_'+relation+'_'+i] = {'walls': bases, 'seesaw': Walls.seesaw,
        'data': d, 'blocks': blocks.concat(_.values(xblocks))};
  }
  return stimuli
};
