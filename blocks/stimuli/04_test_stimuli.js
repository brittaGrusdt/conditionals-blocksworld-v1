// conditions cotains combis of P(A) and P(C) from [high, low, uncertain]
var Conditions = getConditions();

make2ColoredBlocks = function(bases, ps_fall, sides){
  let priors = [PRIOR[ps_fall[0]], PRIOR[ps_fall[1]]];
  let colors = assignColors(); // colors randomly assigned
  // let colors = [1, 0];
  let blocks = [];
  priors.forEach(function(p, i){
    let l = i===0 ? "A" : "C";
    let b = blockOnBase(bases[i], priors[i] * sides[i], cols.blocks[colors[i]],
      'block' + l, ps_fall[i] === "low" || ps_fall[i] === "uncertain");
    blocks.push(b);
  })
  return blocks
}

dataXblockIff = function(priors_blocks){
  let xblock_side =
    (priors_blocks.includes("low")) ? _.indexOf(priors_blocks,"low") :
    (priors_blocks.includes("high") && priors_blocks.includes("uncertain")) ?
      _.indexOf(priors_blocks, "uncertain") : _.random(0, 1);

  let id = xblock_side === 0 ? "xblock_left" : "xblock_right";
  let xblock = makeXBlockIff(id, cols.darkgrey);
  let sides_blocks = xblock_side === 0 ? [-1, -1] : [1, 1]

  return {xblock, 'xblock_side': id.split("_")[1], "sides": sides_blocks}
}

getTestStimuli = function(conditions, relations){
  let stimuli = {}
  relations.forEach(function(rel){
    stimuli[rel] = {};
    let walls = Walls.test[rel];
    let bases = walls.slice(0,2);
    let sides = rel === "independent" ? [-1, -1] :
                rel === "a_implies_c" ? [1, 1] : [1, -1]
    let priors = conditions[rel]
    let data = conditions[rel];

    for(var i=0; i<data.length; i++){
      // let priors_blocks = priors[i];
      let pb1 = priors[i][0]
      let pb2 = priors[i][1]
      let id = rel + '_' + pb1[0] + pb2[0];

      let blocks = [];
      let objs = [];
      let ac_uncertain = priors[i].slice(0,2).join("-")==="uncertain-uncertain";
      if(rel === "a_iff_c" && !ac_uncertain) {
        // add extra block for iff-trials when prior is not uncertain-uncertain
        let updates = dataXblockIff(priors[i])
        let baseB1 = updates.xblock_side === "left" ? updates.xblock : bases[0]
        let baseB2 = updates.xblock_side === "left" ? bases[1] : updates.xblock;
        blocks = make2ColoredBlocks([baseB1, baseB2], priors[i], updates.sides);
        blocks.push(updates.xblock);
      }  else if (rel === "a_implies_c"){
          let bX1 = block(P1.position.x, P1.bounds.min.y, cols.darkgrey, 'bX1', true)
          //let bX2 = blockOnBase(bX1, -1 * PRIOR["very_low"], cols.orange, 'bX2', true);
          let b1 = blockOnBase(bases[0], PRIOR[pb1], cols.blocks[0], 'blockA', true);
          let b2 = blockOnBase(bX1, PRIOR["very_low"], cols.blocks[1], 'blockC', true);
          blocks = blocks.concat([b1, b2, bX1]);
      } else {
        blocks = make2ColoredBlocks(bases, priors[i], sides);
      }

      if(rel === "independent"){
        // second block has to be moved further away from edge depending on prior
        // and angle of tilted wall has to be adjusted
        let b2 = blocks[1];
        let shift = independent_shift[pb2];
        Matter.Body.setPosition(b2, {x: b2.position.x + shift, y: b2.position.y});
      }
      if(rel !== "a_iff_c") {
        // in a->c and independent trials add ramp walls
        if(pb2 === "high") {
          objs = objs.concat(Walls.test.tilted[rel + '_steep']);
        } else if (pb2 === "low") {
          objs = objs.concat(Walls.test.tilted[rel + '_plane']);
        } else {
            let x = rel === "independent" ? Walls.test.tilted[rel + '_plane'] :
              Walls.test.tilted[rel + '_middle'];
            objs = objs.concat(x);
        }
      }
      objs = objs.concat(walls);
      stimuli[rel][id] = {"objs": blocks.concat(objs), "meta": priors[i]};
    }
  })
  return stimuli
}

let TestStimuli = getTestStimuli(Conditions, Relations);
