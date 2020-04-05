let Train_stimuli = {"independent": {}, "uncertain": {}, "a_implies_c": {}};
// INDPENDENT TRIALS
let blockA = rect(Object.assign(props.blocks,
  {x:350, y: 275 - props.walls.h/2 - props.blocks.h/2}),
  {render: {fillStyle: cols.pinkish}}
);
let blockB = rect(Object.assign({w: props.blocks.h, h: props.blocks.w},
  {x:350, y: 275 - props.walls.h/2 - props.blocks.w/2}),
  {render: {fillStyle: cols.pinkish}, label: "blockB"}
);

[blockA, blockB].forEach(function(block, i){
  let id = "independent_" + i
  let objs = {objs: Walls.train.independent.concat([block]), meta: ["", ""]}
  Train_stimuli["independent"][id] = objs
})


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

blockA = blockTrainUnc(1, "left", cols.red, horiz=true); // falls
blockB = blockTrainUnc(-2.5, "right", cols.orange); // doesn't fall
let blockC = blockTrainUnc(-1, "right", cols.orange); // falls
let blockD = blockTrainUnc(2.5, "left", cols.red, horiz=true); // doesn't fall

[[blockA, blockB], [blockC, blockD]].forEach(function(blocks, i){
  let id = "uncertain_" + i
  Train_stimuli["uncertain"][id] = {objs: Walls.train.uncertain.concat(blocks),
    meta: ["", ""]}
});

// A implies C TRIALS
blockA = block(Walls.train.a_implies_c[0], prior["low"], cols.red, 'blockA',
  undefined, undefined,horiz=true); //lower wall
blockB = block(Walls.train.a_implies_c[1], -1 * prior["high"], cols.orange, 'blockB');//upper wall
blockC = block(Walls.train.a_implies_c[0], prior["uncertain"], cols.orange, 'blockC'); //lower wall
Body.setPosition(blockC, {x: blockC.position.x-2, y: blockC.position.y});
blockD = block(Walls.train.a_implies_c[1], -1 * prior["uncertain"], cols.red,
  'blockD', undefined, undefined, horiz=true); //upper wall
[[blockA, blockB], [blockC, blockD]].forEach(function(blocks, i){
  let id = "a_implies_c_" + i
  Train_stimuli["a_implies_c"][id] = {objs: Walls.train.a_implies_c.concat(blocks),
    meta: ["", ""]}
});

getTrainStimulus = function(kind, nb) {
  let stimulus = Train_stimuli[kind][kind + "_" + nb];
  return stimulus
};
