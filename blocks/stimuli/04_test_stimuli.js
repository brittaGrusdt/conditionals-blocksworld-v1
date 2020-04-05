// conditions cotains combis of P(A) and P(C) from [high, low, uncertain]
var Conditions = getConditions();

_add_blocks = function(bases, data, sides){
  let priors = [prior[data[0]], prior[data[1]]];
  let colors = assignColors();
  let b1 = block(base=bases[0], propOnBase=priors[0] * sides[0],
    color=cols.blocks[colors[0]], 'block1', undefined, undefined,
    horiz = data[0]==="low" || data[0]==="uncertain");

  let b2 = block(base=bases[1], propOnBase=priors[1] * sides[1],
    color=cols.blocks[colors[1]], 'block2', undefined, undefined,
    horiz = data[1]==="low" || data[1]==="uncertain");
  return [b1, b2]
}

_addXblock = function(priors_blocks){
  let xblock_side =
    (priors_blocks.includes("high") && priors_blocks.includes("low")) ?
      _.indexOf(priors_blocks,"low") :
    (priors_blocks.includes("high") && priors_blocks.includes("uncertain")) ?
      _.indexOf(priors_blocks, "uncertain") : _.random(0, 1);

  let id = xblock_side === 0 ? "xblock_left" : "xblock_right";
  let xblock = extraBlock(id, cols.darkgrey);
  let sides_blocks = xblock_side === 0 ? [-1, -1] : [1, 1]

  return {xblock, 'xblock_side': id.split("_")[1], "sides": sides_blocks}
}

getTestStimuli = function(conditions, relations){
  let stimuli = {}
  relations.forEach(function(rel){
    let walls = Walls.test[rel];
    let bases = walls.slice(0,2);
    let sides = rel === "independent" ? [-1, -1] : [1, -1]
    let priors = conditions[rel]
    let data = conditions[rel];

    for(var i=0; i<data.length; i++){
      let id = rel + '_' + i;
      let priors_blocks = priors[i];

      let blocks;
      if(rel === "a_iff_c"){
        // add extra block for iff-trials
        let updates = _addXblock(priors_blocks)
        let baseB1 = updates.xblock_side === "left" ? updates.xblock : bases[0]
        let baseB2 = updates.xblock_side === "left" ? bases[1] : updates.xblock;
        blocks = _add_blocks([baseB1, baseB2], priors_blocks, updates.sides);
        blocks.push(updates.xblock);
      } else {
        blocks = _add_blocks(bases, priors_blocks, sides);
      }

      if(rel === "independent"){
        // second block has to be moved further away from edge depending on prior
        let b2 = blocks[1];
        let shift = independent_shift[priors[i][1]];
        Matter.Body.setPosition(b2, {x: b2.position.x + shift, y: b2.position.y});
      }
      let objs = walls.concat(bases);
      stimuli[id] = {"objs": objs.concat(blocks), "meta": priors_blocks};
    }
  })

  return stimuli
}
