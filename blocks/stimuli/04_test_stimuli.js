let TestStimuli = {"independent": {}, "a_implies_c": {}, "a_iff_c": {}};
// conditions cotains combis of P(A) and P(C) from [high, low, uncertain]

// IMPORTANT: DYNAMIC BLOCKS HAVE TO BE ADDED BEFORE STATIC OBJECTS, OTHERWISE
// THEY WILL FALL VERY ODD (JITTERING)
make2ColoredBlocks = function(bases, priors_str, sides){
  let priors = [PRIOR[priors_str[0]], PRIOR[priors_str[1]]];
  let colors = assignColors(); // colors randomly assigned
  // let colors = [1, 0];
  let blocks = [];
  for(var i=0; i<=1; i++){
    let prior = priors[i]
    let l = i===0 ? "A" : "C";
    let b = blockOnBase(bases[i], prior * sides[i], cols.test_blocks[colors[i]],
      'block' + l, priors_str[i] === "low" || priors_str[i] === "uncertain");
      blocks.push(b);
  }
  return blocks
}

testTrials_a_iff_c = function(priors){
  let data_ramp = priors[0] === priors[1] ?
  {side: "right", i:1, 'moveBlock': 1, 'increase': true} :
  {side: "left", i: 0, 'moveBlock': -1, 'increase': false};

  let offset = data_ramp.side === "left" ? 50 : -50;
  let seesaw = Walls.test.seesaw_trials(offset)

  let ramp_walls;
  if (priors[data_ramp.i] === "uncertain" || priors[data_ramp.i] === "low") {
    ramp_walls = Walls.test.tilted.a_iff_c('plane', data_ramp.increase,
      seesaw.walls[data_ramp.i])
  } else {
    ramp_walls = Walls.test.tilted.a_iff_c('steep', data_ramp.increase,
      seesaw.walls[data_ramp.i]);
  }
  let objs = seesaw.dynamic.concat(ramp_walls).concat(seesaw.walls)
  // add 2 blocks + extra block for iff-trials
  let xBlock,
      bases,
      sides,
      factor;
  if (data_ramp.side === "left") {
    factor = -1
    xBlock = blockOnBase(seesaw.walls[1], factor * 0.52, cols.darkgrey, "XblockR", true)
    bases = [seesaw.walls[0], xBlock]
    sides = [1, 1]
  } else {
    factor = 1;
    xBlock = blockOnBase(seesaw.walls[0], factor * 0.52, cols.darkgrey, "XblockL", true)
    bases = [xBlock, seesaw.walls[1]]
    sides = [-1, -1]
  }
  let blocks = [];
  if (priors[0] === "high" && priors[1] === "high") {
    let xBlock2 = blockOnBase(xBlock, 0.52 * -factor, cols.grey, "xBlock2", true)
    blocks.push(xBlock2)
    let idx = factor === -1 ? 1 : 0;
    bases[idx] = xBlock2
    sides[idx] = sides[idx] * -1
  }

  let twoBlocks = make2ColoredBlocks(bases, priors, sides);
  let shift = iff_shift[priors[data_ramp.i]] * data_ramp.moveBlock;
  let b = twoBlocks[data_ramp.i]
  Matter.Body.setPosition(b, {x: b.position.x + shift, y: b.position.y});
  blocks = blocks.concat(twoBlocks).concat(xBlock);
  return blocks.concat(objs);
}

testTrials_ac = function(priors){
  // first block is on top of a wall, second block on top of an extra block
  let blocks = [];
  let p1 = priors[0];
  let p2 = priors[1];
  let data = ['ll', 'hl'].includes(p1[0]+p2[0]) ?
    {ramp_base: WP1, pf: P1, moveBlocksTo: 1, increase: false, idx_w: 0, bX1_x: "min"} :
    {ramp_base: WP2, pf: P2, moveBlocksTo: -1, increase: true, idx_w: 1, bX1_x: "max"};
  let tilt = p2==="high" ? "steep" : p2==="low" ? "plane" : "middle";
  let objs = Walls.test.tilted.a_implies_c(tilt, data.increase, data.ramp_base);
  let walls = Walls.test["a_implies_c"][data.idx_w];
  objs = objs.concat(walls);

  let bX1 = block(data.pf.bounds[data.bX1_x].x + data.moveBlocksTo * 1.5 * props.blocks.h/2,
    data.pf.bounds.min.y, cols.darkgrey, 'bX1', true)
  let b1 = blockOnBase(walls[0], PRIOR[priors[0]] * data.moveBlocksTo, cols.test_blocks[0], 'blockA', true);
  let b2 = blockOnBase(bX1, PRIOR["very_low"] * data.moveBlocksTo, cols.test_blocks[1], 'blockC', true);
  blocks = blocks.concat([b1, b2, bX1]);

  return blocks.concat(objs)
}

testTrials_independent = function(priors){
  let sides = [-1, -1]
  let bases = Walls.test["independent"].slice(0,2);
  // second block has to be moved further away from edge depending on prior
  // and angle of tilted wall has to be adjusted
  let blocks = make2ColoredBlocks(bases, priors, sides);
  let b2 = blocks[1];
  let shift = independent_shift[priors[1]];
  Matter.Body.setPosition(b2, {x: b2.position.x + shift, y: b2.position.y});
  // add ramp walls
  let objs = Walls.test["independent"];
  if(priors[1] === "high") {
    objs = objs.concat(Walls.test.tilted['independent_steep']);
  } else {
    objs = objs.concat(Walls.test.tilted['independent_plane']);
  }
  return blocks.concat(objs);
}

makeTestStimuli = function(conditions, relations){
  relations.forEach(function(rel){
    let sides = rel === "independent" ? [-1, -1] :
                rel === "a_implies_c" ? [1, 1] : [1, -1]
    let priors_all = conditions[rel]

    for(var i=0; i<priors_all.length; i++){
      let priors = priors_all[i];
      let pb1 = priors[0]
      let pb2 = priors[1]
      let id = rel + '_' + pb1[0] + pb2[0];
      let objs = [];
      let blocks = rel === "a_iff_c" ?
        testTrials_a_iff_c(priors) : rel === "a_implies_c" ?
        testTrials_ac(priors) : rel === "independent" ?
        testTrials_independent(priors) : null;

      // objs = objs.concat(Walls.test[rel]);
      TestStimuli[rel][id] = {"objs": blocks.concat(objs), "meta": priors};
    }
  })
}

getTestStimulus = function(rel, p) {
  let stimulus = TestStimuli[rel][rel + "_" + p];
  return stimulus
};

if (MODE === "test") {
  makeTestStimuli(getConditions(), Relations);
}
