// assignment block to base wall
let relation2walls = ['a_implies_c', 'c_implies_a', 'independent'];
                      // 'ac_bidirectional' TODO! special wall

// combis will combinations of P(A) and P(C) from [high, low, uncertain]
// 0-8: p(A) high
// 9-17: p(A) uncertain
// 18-26 p(A) low
var combis = [];

blocks = function(){
  let keys = _.keys(prior);
  let probs = [];
  keys.forEach(function(p){
    let vals = new Array(keys.length).fill(p);
    probs = probs.concat(_.zip(vals, keys));
  });
  probs.forEach(function(ps){
    relation2walls.forEach(function(r){
      combis.push(ps.concat(r))
    })
  })

  let col1,
      col2;
  let stimuli = {}
  for(var i=0; i<combis.length; i++){
    col1 = _.random(0, 1);
    col2 = col1 === 1 ? 0 : 1;
    let vals = combis[i];
    let relation = vals[2];
    let sides = relation === "independent" ? [-1, 1] :
                relation === "c_implies_a" ? [-1, 1] : [1, -1];

    let horizontal = false;
    let bases = ['wall1', 'wall2'];
    if(relation === "c_implies_a"){
      horizontal = true;
      bases = ['none', 'wall1'];
    }

    let block2 = block(walls[bases[1]], prior[vals[1]] * sides[1],
      props.blocks.w, props.blocks.h, cols.blocks[col2], horizontal);

    let baseBlock1 = relation === "c_implies_a" ? block2 : walls[bases[0]];
    let block1 = block(baseBlock1, prior[vals[0]] * sides[0], props.blocks.w,
      props.blocks.h, cols.blocks[col1], horizontal);

    stimuli['id' + i] = {'wall1': bases[0], 'wall2': bases[1], 'data': vals,
      block1, block2};
  }
  return stimuli
}






// var constraint = Constraint.create({
//           stiffness: 0.4,
//           bodyA: wall22,
//           bodyB: wall2,
//           pointA: { x: canvasW/2, y: 0},
//       });
// constraint.render.visible = false;
