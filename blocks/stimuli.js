// conditions cotains combis of P(A) and P(C) from [high, low, uncertain]
// 0-8: p(A) high
// 9-17: p(A) uncertain
// 18-26 p(A) low
var conditions = getConditions();

createStimuli = function(){
  let trials_iff = _stimuli_iff();
  let trials_ac = _stimuli(filterConditions(conditions, "a_implies_c"),
    "a_implies_c");
  let trials_ind = _stimuli(filterConditions(conditions, "independent"),
    "independent");
  let trials = Object.assign(trials_iff, trials_ac, trials_ind);
  return trials;
}

_add_blocks = function(bases, data, sides){
  let priors = [prior[data[0]], prior[data[1]]];
  let colors = assignColors();
  let b1 = block(base=bases[0], propOnBase=priors[0] * sides[0],
    w=props.blocks.w, h=props.blocks.h, color=cols.blocks[colors[0]],
    'block1', horizontal=false);

  let b2 = block(base=bases[1], propOnBase=priors[1] * sides[1],
    w=props.blocks.w, h=props.blocks.h, color=cols.blocks[colors[1]],
    'block2', horizontal=false);
  return [b1, b2]
}

// add addtional walls and ball for all independent trials
_add_scene_ind = function(){
  let ball1 = ball(Walls['wall5'].bounds.min.x - 4,
                   Walls['wall5'].bounds.min.y - props.balls.diameter,
                   props.balls.diameter, 'ball', cols.purple);
  return [Walls.wall4, Walls.wall5, ball1]
}

_stimuli = function(data, relation){
  let bases = [Walls.wall1, Walls.wall2]
  let sides = relation==="independent" ? [-1,-1] : [1, -1];

  let stimuli = {};
  for(var i=0; i<data.length; i++){
    let id = 'id_'+relation+'_'+i;
    let priors = data[i];
    stimuli[id] = {};
    let blocks = _add_blocks(bases, data[i], sides);
    if(relation === "independent"){
      stimuli[id].other = _add_scene_ind();
      let b2 = blocks[1];
      let shift = priors[1] === "high" ? 20 :
        priors[1] === "low" ? 85 : 25;
      Matter.Body.setPosition(b2, {x: b2.position.x + shift, y: b2.position.y});
    }
    stimuli[id] = Object.assign(stimuli[id],
      {'walls': bases, 'data': data[i], blocks}
    );
  }
  return stimuli
}

_stimuli_iff = function(){
  let stimuli = {};
  let bases = [Walls['wall6'], Walls['wall7'],]
  let data = filterConditions(conditions, "a_iff_c");
  let relation = 'a_iff_c'
  for(var i=0; i<data.length; i++){
    let b01 = block(Walls['wall6'], .6, props.blocks.w, props.blocks.h,
      cols.black, 'b01', horizontal=true);
    let b02 = block(b01, -0.6, props.blocks.w, props.blocks.h, cols.darkgrey,
      'b02', horizontal=true);
    let blocks = _add_blocks([b02, Walls['wall7']], data[i], [1, -1])

    stimuli['id_'+relation+'_'+i] = {'walls': bases, 'seesaw': Walls.seesaw,
        'data': data[i], 'blocks': blocks.concat([b01, b02])};
  }
  return stimuli
};
