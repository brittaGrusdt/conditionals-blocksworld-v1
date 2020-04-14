let TrainStimuli = {
  'map_category': {"independent": {}, "uncertain": {}, "a_implies_c": {},
                   "a_iff_c": {}},
  'list_all': []
};

// INDPENDENT TRIALS
trials_independent = function(){
  let data = {}
  let bases = _.times(3, lowWallIndependent);
  let baseXmax = bases[0].bounds.max.x;
  let baseYmin = bases[0].bounds.min.y;

  // plane uncertain falls
  let bA = rect(Object.assign({w: props.blocks.h, h: props.blocks.w,
    x: baseXmax - lengthOnBase("uncertain", true) - 25 + props.blocks.h/2,
    y: baseYmin - props.blocks.w/2}),
    {render: {fillStyle: cols.train_blocks[0]}, id: "blockA"}
  );
  // steep falls
  let bB = rect(Object.assign({w: props.blocks.h, h: props.blocks.w},
    {x: 350,
     y: 225 - props.walls.h/2 - props.blocks.w/2}),
    {render: {fillStyle:  cols.train_blocks[1]}, id: "blockB"}
  );
  // plane uncertain doesnt fall
  let bC = rect(Object.assign({w: props.blocks.h, h: props.blocks.w,
    x: baseXmax -lengthOnBase("low", true) + 30 + props.blocks.h/2,
    y: baseYmin - props.blocks.w/2}
  ), {render: {fillStyle: cols.train_blocks[1]}, id: "blockC"}
  );

  let meta = {
    "blockA": ["uncertain", "-","train-independent-plane-falls"],
    "blockB": ["high","-", "train-independent-steep-falls"],
    "blockC": ["uncertain", "-", "train-independent-plane-doesnt-fall"]
  };
  // 2.trial: steep and plane tilted walls are different
  [bA, bC].forEach(function(block, i){
    let id = "independent_" + i;
    let base = bases[i]
    let ramp_elems = Walls.train.independent_plane();
    let w = [base].concat(ramp_elems);
    if(block.id === "blockC") {
      Matter.Body.scale(w[0], 1.18, 1);
      Matter.Body.setPosition(w[0], {x: w[0].position.x + 28, y: w[0].position.y})
    }
    let objs = {'objs': w.concat([block]), 'meta': meta[block.id], id: id}
    data[id] = objs
  });
  // 3. trial has different base!
  let w = [bases[2]].concat(Walls.train.independent_steep());
  data["independent_2"] = {
    objs: w.concat([bB]), meta: meta.blockB, id: "independent_2"
  };
  return data
}

// TRAIN UNCERTAINTY BLOCKS TO FALL
blockTrainUnc = function(offset, side, color, horiz=false) {
  let x = side === "left" ? W8.bounds.min.x : W8.bounds.max.x
  let size = horiz ? {w: props.blocks.h, h: props.blocks.w} :
    {w: props.blocks.w, h: props.blocks.h};
  let block = rect(Object.assign(size,
    {x: x, y: W8.position.y - props.walls.h/2 - size.h/2}),
    {render: {fillStyle: color}}
  );
  Body.setPosition(block, {x: block.position.x + offset, y: block.position.y})
  return(block);
}

trials_uncertain = function(){
  let data = {}
  let meta = [
    ["falls-horiz", "doesnt-fall", 'train-uncertain'],
    ["doesnt-fall-horiz","falls", 'train-uncertain']
  ];
  let bA = blockTrainUnc(0.5, "left", cols.train_blocks[0], horiz=true); // falls
  let bB = blockTrainUnc(-2.5, "right", cols.train_blocks[1]); // doesn't fall
  let bD = blockTrainUnc(2.5, "left", cols.train_blocks[0], horiz=true); // doesn't fall
  let bC = blockTrainUnc(-1, "right", cols.train_blocks[1]); // falls

  [[bA, bB], [bC, bD]].forEach(function(blocks, i){
    let id = "uncertain_" + i
    data[id] = {objs: Walls.train.uncertain.concat(blocks),
      meta: meta[i], id}
    });
  return data
}

// A implies C TRIALS
trials_ac = function(){
  let data = {};
  let p_fall = [
    ["high", "low", 'train-a-implies-c-c-falls'],
    ["uncertain", "uncertain", 'train-a-implies-c-c-falls'],
    ["uncertain", "uncertain", "train-a-implies-c-c-doesnt-fall"]
  ];
  let ac1Up = block(Walls.train.a_implies_c[0], -prior[p_fall[0][0]],
    cols.train_blocks[0], 'blockUp', undefined, undefined,horiz=true); //upper wall
  let ac1Low = block(Walls.train.a_implies_c[1], prior[p_fall[0][1]],
    cols.train_blocks[1], 'blockLow');//lower wall

  let ac2Up = block(Walls.train.a_implies_c[0], -prior[p_fall[1][0]],
    cols.train_blocks[1], 'blockUp'); //upper wall
  Body.setPosition(ac2Up, {x: ac2Up.position.x-1, y: ac2Up.position.y});
  let ac2Low = block(Walls.train.a_implies_c[1], prior[p_fall[1][1]],
    cols.train_blocks[0], 'blockLow', undefined, undefined, horiz=true); //lower wall

  let ac3Up = block(Walls.train.a_implies_c[0], -prior[p_fall[1][0]],
    cols.train_blocks[0], 'blockUp'); //upper wall
  Body.setPosition(ac3Up, {x: ac3Up.position.x-1, y: ac3Up.position.y});
  let ac3Low = block(Walls.train.a_implies_c[1], prior[p_fall[1][1]],
    cols.train_blocks[1], 'blockLow', undefined, undefined, horiz=true); //lower wall
  Body.setPosition(ac3Low, {x: ac3Low.position.x-2, y: ac3Low.position.y});
// [bA, bB], [bC, bD],
  [[ac1Up, ac1Low], [ac2Up, ac2Low], [ac3Up, ac3Low]].forEach(function(blocks,i){
    let id = "a_implies_c_" + i
    data[id] = {objs: Walls.train.a_implies_c.concat(blocks),
      meta: p_fall[i], id}
    });
    return data
}

// Seesaw TRIALS
trials_iff = function(){
  data = {};
  let w = Walls.train.a_iff_c[0]
  let bA = rect(Object.assign(props.blocks,
    {x: w.bounds.max.x, y: w.bounds.min.y - props.blocks.h/2}),
    {render: {fillStyle: cols.train_blocks[1]}, id: 'blockA'});
  let bB = rect(Object.assign(props.blocks,
    {x: W7.bounds.min.x + 3, y: W7.bounds.min.y - props.blocks.h/2}),
    {render: {fillStyle: cols.train_blocks[0]}, id: 'blockB'});

  [[bA, bB]].forEach(function(blocks, i){
    let id = "a_iff_c_" + i
    data[id] = {objs: Walls.train.a_iff_c.concat(blocks),
                meta: ["uncertain", "low", "train-iff"], id}
  });
  return data
}

TrainStimuli.map_category["a_iff_c"] = trials_iff();
TrainStimuli.map_category["uncertain"] = trials_uncertain();
TrainStimuli.map_category["independent"] = trials_independent();
TrainStimuli.map_category["a_implies_c"] = trials_ac();

// put all train stimuli into array independent of kind
let train_keys = _.keys(TrainStimuli.map_category);
train_keys.forEach(function(kind){
  let arr = _.values(TrainStimuli.map_category[kind]);
  TrainStimuli.list_all = TrainStimuli.list_all.concat(arr);
});

getTrainStimulus = function(kind, nb) {
  let stimulus = TrainStimuli.map_category[kind][kind + "_" + nb];
  return stimulus
};
