makeColorVisionStimuli = function(){
  let stimuli = [];
  let bases = [W6(), W7()]
  let cols_blocks = [cols.train_blocks, cols.test_blocks]
  let cols_distractors = [[cols.olive, cols.darkgrey], [cols.darkgrey, cols.olive]]

  let blocks = [];
  for(var trial=0; trial<=1; trial++) {
    let id = 'color' + trial;
    let cols_b = cols_blocks[trial];
    let cols_d = cols_distractors[trial];

    let xBlock1 = block(bases[0].position.x, bases[0].bounds.min.y, cols_d[0], 'xb1', true)
    let b1 = blockOnBase(xBlock1, -0.7, cols_b[0], 'b1', true)

    let xBlock2 = block(bases[1].position.x, bases[1].bounds.min.y, cols_d[1], 'xb2', true)
    let b2 = blockOnBase(xBlock2, 0.7, cols_b[1], 'b2', true)
    blocks = blocks.concat([b1, b2, xBlock1, xBlock2]);

    stimuli.push({'objs': blocks.concat(bases), 'meta': ['', '', ''], id});
  }
  return stimuli
}
