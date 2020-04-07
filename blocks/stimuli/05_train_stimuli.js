let TrainStimuli = {
  'map_category': {"independent": {}, "uncertain": {}, "a_implies_c": {},
                   "a_iff_c": {}},
  'list_all': []
};

// INDPENDENT TRIALS
trials_independent = function(){
  let data = {"independent": {}}
  let blockA = rect(Object.assign(props.blocks,
    {x:350, y: 275 - props.walls.h/2 - props.blocks.h/2}),
    {render: {fillStyle: cols.pinkish}}
  );
  let blockB = rect(Object.assign({w: props.blocks.w, h: props.blocks.h},
    {x:450, y: 275 - props.walls.h/2 - props.blocks.h/2}),
    {render: {fillStyle: cols.pinkish}, label: "blockB"}
  );
  let blockC = rect(Object.assign(props.blocks,
    {x:450, y: Walls.train.independent_plane[1].bounds.min.y - props.blocks.h/2}),
    {render: {fillStyle: cols.pinkish}, label: "blockB"}
  );
  let meta = [["low", "-", "train-independent-steep-doesnt-fall"],
  ["low","-", "independent-steep-falls"], ["low", "-","train-independent-plane-doesnt-fall"]];

  [blockA, blockB].forEach(function(block, i){
    let id = "independent_" + i;
    let w = Walls.train.independent.concat(Walls.train.independent_steep);
    let objs = {objs: w.concat([block]), meta: meta[i], id: id}
    data[id] = objs
  });
  let w = Walls.train.independent.concat(Walls.train.independent_plane);
  data["independent_2"] = {
    objs: w.concat([blockC]), meta: meta[2], id: "independent_2"
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
  let data = {"uncertain": {}}
  let meta = [
    ["falls-horiz", "doesnt-fall", 'train-uncertain'],
    ["doesnt-fall-horiz","falls", 'train-uncertain']
  ];
  let bA = blockTrainUnc(0.5, "left", cols.red, horiz=true); // falls
  let bB = blockTrainUnc(-2.5, "right", cols.orange); // doesn't fall
  let bD = blockTrainUnc(2.5, "left", cols.red, horiz=true); // doesn't fall
  let bC = blockTrainUnc(-1, "right", cols.orange); // falls

  [[bA, bB], [bC, bD]].forEach(function(blocks, i){
    let id = "uncertain_" + i
    data[id] = {objs: Walls.train.uncertain.concat(blocks),
      meta: meta[i], id}
    });
  return data
}

// A implies C TRIALS
trials_ac = function(){
  let data = {'a_implies_c': {}};
  let p_fall = [
    ["high", "low", 'train-a-implies-c-c-falls'],
    ["uncertain", "uncertain", 'train-a-implies-c-c-falls'],
    ["uncertain", "uncertain", "train-a-implies-c-c-doesnt-fall"]
  ];
  let bA = block(Walls.train.a_implies_c[0], -prior[p_fall[0][0]], cols.red, 'blockA',
  undefined, undefined,horiz=true); //upper wall
  let bB = block(Walls.train.a_implies_c[1], prior[p_fall[0][1]], cols.orange, 'blockB');//lower wall

  let bC = block(Walls.train.a_implies_c[0], -prior[p_fall[1][0]], cols.orange, 'blockC'); //upper wall
  Body.setPosition(bC, {x: bC.position.x-1, y: bC.position.y});
  bD = block(Walls.train.a_implies_c[1], prior[p_fall[1][1]], cols.red,
    'blockD', undefined, undefined, horiz=true); //lower wall

    let bE = block(Walls.train.a_implies_c[1], prior[p_fall[1][1]], cols.darkgrey, 'blockE',
    undefined, undefined, horiz=true); //lower wall
    Body.setPosition(bE, {x: bE.position.x-2, y: bE.position.y});

    [[bA, bB], [bC, bD], [bC, bE]].forEach(function(blocks, i){
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
    {x: w.bounds.max.x, y: w.bounds.min.y - props.blocks.h/2,
      render: {fillStyle: cols.pinkish}})
    );
    let bB = rect(Object.assign(props.blocks,
      {x: W7.bounds.min.x + 3, y: W7.bounds.min.y - props.blocks.h/2,
        render: {fillStyle: cols.olive}}
      ));
      [[bA, bB]].forEach(function(blocks, i){
        let id = "a_iff_c_" + i
        data[id] = {objs: Walls.train.a_iff_c.concat(blocks),
          meta: ["uncertain", "low", "train-iff"], id}
        });
  return data
}

// TrainStimuli.map_category["independent"] = trials_independent();
// TrainStimuli.map_category["uncertain"] = trials_uncertain();
TrainStimuli.map_category["a_implies_c"] = trials_ac();
// TrainStimuli.map_category["a_iff_c"] = trials_iff();

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
