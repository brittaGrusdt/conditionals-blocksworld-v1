makeColorVisionStimuli = function(){
  let stimuli = [];
  let base = wall('w_center', scene.w/2, scene.h/2, props.walls.w,
    props.walls.h, {'render': {'fillStyle': cols.grey}})
  let cols_blocks = cols.train_blocks.concat(cols.test_blocks);
  let cols_distractors = [cols.darkbrown, cols.darkgrey, cols.darkgrey, cols.darkbrown]

  for(var trial=0; trial<4; trial++) {
    let id = 'color' + trial;
    let col_block = cols_blocks[trial];
    let col_dist = cols_distractors[trial];

    let xBlock = block(base.position.x, base.bounds.min.y, col_dist,
      'xb' + trial, true)
    let b = blockOnBase(xBlock, -0.7, col_block, 'b' + trial, true)
    stimuli.push({'objs': [base, xBlock, b], 'meta': ['', '', ''], id});
  }
  return stimuli
}
