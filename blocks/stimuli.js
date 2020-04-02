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

_add_blocks = function(bases, data, sides=[1, -1]){
  let priors = [prior[data[0]], prior[data[1]]];
  let colors = assignColors();
  let b1 = block(base=bases[0], propOnBase=priors[0] * sides[0],
    w=props.blocks.w, h=props.blocks.h, color=cols.blocks[colors[0]],
    horizontal=false);

  let b2 = block(base=bases[1], propOnBase=priors[1] * sides[1],
    w=props.blocks.w, h=props.blocks.h, color=cols.blocks[colors[1]],
    horizontal=false);
  return [b1, b2]
}

_stimuli = function(data, relation){
  let stimuli = {};
  let bases = [Walls.wall1, Walls.wall2];
  let sides = relation === "independent" ? [-1, 1] :
              relation === "a_implies_c" ? [1, -1] : null;
  for(var i=0; i<data.length; i++){
    let blocks = _add_blocks(bases, data[i], sides);
    stimuli['id_'+relation+'_'+i] = {'walls': bases, 'data': data[i], blocks};
  }
  return stimuli
}

_stimuli_iff = function(){
  let stimuli = {};
  let bases = [Walls['wall6'], Walls['wall7'],]
  let data = filterConditions(conditions, "a_iff_c");
  let relation = 'a_iff_c'
  for(var i=0; i<data.length; i++){
    let b01 = block(Walls['wall6'], .6, props.blocks.w, props.blocks.h, color=cols.black, horizontal=true);
    let b02 = block(b01, -0.6, props.blocks.w, props.blocks.h, color=cols.darkgrey, horizontal=true);
    let blocks = _add_blocks([b02, Walls['wall7']], data[i])

    stimuli['id_'+relation+'_'+i] = {'walls': bases, 'seesaw': Walls.seesaw,
        'data': data[i], 'blocks': blocks.concat([b01, b02])};
  }
  return stimuli
};

// blocks_ac = function(){
//   let stimuli = {};
//   let col1 = _.random(0, 1);
//   let col2 = col1 === 1 ? 0 : 1;
//   let block1 = block(Walls['wall3'], prior['low'] * -1, props.blocks.w,
//     props.blocks.h, cols.blocks[col1], false);
//
//   let block2 = block(Walls['wall2'], prior['low'] * -1, props.blocks.w,
//       props.blocks.h, cols.blocks[col2], false);
//
//   let diameter = 20
//   let circ = ball(Walls['wall5'].bounds.min.x -1,
//                   Walls['wall5'].bounds.min.y - diameter,
//                   diameter, 'ball1', cols.red);
//
//   stimuli['id100'] = {'walls': ['wall3', 'wall2'], 'data': '', block1, block2, circ};
//   return stimuli
// }
