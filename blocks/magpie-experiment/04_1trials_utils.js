// TRAINING TRIALS
pseudoRandomTrainTrials = function(){
  let order = Array(8).fill('');
  let categories = ["uncertain", "a_implies_c"]
  let indices = [0, 1]
  let cat0 = _.sample(categories)
  let nb0 = _.sample(indices)
  order[0] = TrainStimuli.map_category[cat0][cat0 + "_" + nb0]

  let cat1 = cat0 === "uncertain" ?  "a_implies_c" : "uncertain"
  let nb1 = _.sample(indices)
  order[2] = TrainStimuli.map_category[cat1][cat1 + "_" + nb1]

  let nb7 = nb0 === 0 ? 1 : 0;
  let nb8 = nb1 === 0 ? 1 : 0;

  order[7] = TrainStimuli.map_category[cat0][cat0 + "_" + nb7]
  order[8] = TrainStimuli.map_category[cat1][cat1 + "_" + nb8]

  order[1] = TrainStimuli.map_category["a_iff_c"]["a_iff_c_0"]
  order[3] = TrainStimuli.map_category["independent"]["independent_0"]
  order[4] = TrainStimuli.map_category["independent"]["independent_1"]
  order[5] = TrainStimuli.map_category["a_implies_c"]["a_implies_c_2"]
  order[6] = TrainStimuli.map_category["independent"]["independent_2"]

  return order
}

const SHUFFLED_TRAIN_STIMULI = pseudoRandomTrainTrials();

// TEST TRIALS //
let TYPE_MAP = {z: 'a_implies_c', x: 'a_iff_c', y: 'independent'}
let REL_ORDERS = [
  [['xyz', 'xyz', 'yz'], ['xyz', 'yz', 'xyz'], ['yz', 'xyz', 'xyz']],
  [['yz', 'xyz', 'xyz'], ['xyz', 'yz', 'xyz'], ['xyz', 'xyz', 'yz']],
  [['xyz', 'yz', 'xyz'], ['yz', 'xyz', 'xyz'], ['xyz', 'xyz', 'yz']]
];

// each inner list gets shuffled
let P_ORDERS = {
  'ac_ind': [
    [['lh', 'hu', 'ul'], ['lu', 'hl', 'uu'], ['ll', 'hh', 'uh']],
    [['lh', 'hu', 'ul'], ['lu', 'hh', 'uh'], ['ll', 'hl', 'uu']],
    [['lh', 'hu', 'ul'], ['lu', 'hh', 'uu'], ['ll', 'hl', 'uh']],

    [['lh', 'hu', 'uu'], ['lu', 'hl', 'uh'], ['ll', 'hh', 'ul']],
    [['lh', 'hu', 'uu'], ['lu', 'hh', 'uh'], ['ll', 'hl', 'ul']],

    [['lh', 'hh', 'uh'], ['lu', 'hl', 'uu'], ['ll', 'hu', 'ul']],

    [['lh', 'hh', 'uu'], ['lu', 'hl', 'uh'], ['ll', 'hu', 'ul']],

    [['lh', 'hh', 'ul'], ['lu', 'hl', 'uh'], ['ll', 'hu', 'uu']]
  ],
  'a_iff_c': [['hh', 'ul'], ['ll', 'hu'], ['uu', 'hl']]
};


getFullTestSequence = function(trials, p_combis, trial_type){
  let shuffled = [] ;
  // shuffle sublists
  p_combis.forEach(function(arr){
    shuffled.push(_.shuffle(arr))
  });
  shuffled = _.flatten(shuffled);
  let indices = [];
  trials.forEach((rel, idx) => rel === trial_type ? indices.push(idx) : null)

  indices.forEach(function(idx, i){
    trials[idx] = trials[idx] + "_" + shuffled[i];
  });
  return trials
}

getTypeSequence = function(){
  let i = _.random(0, REL_ORDERS.length-1);
  // console.log('type order: ' + i);
  let types_short = _.flatten(REL_ORDERS[i]);
  let types_str = types_short.join('')
  types_str = types_str.split('').join(' ')
  types_str = types_str.replace(/x/g, TYPE_MAP.x);
  types_str = types_str.replace(/y/g, TYPE_MAP.y);
  types_str = types_str.replace(/z/g, TYPE_MAP.z);
  return types_str.split(' ');
}

pseudoRandomTestTrials = function(){
  let relations = ["a_implies_c", 'independent']
  let indices = _.range(0, P_ORDERS.ac_ind.length);
  let i_ac = _.sample(indices);
  let i_ind = _.sample(_.without(indices, i_ac))
  // console.log('order AC:' + i_ac + ' order ind:' + i_ind);

  let trials = getTypeSequence();
  [P_ORDERS.ac_ind[i_ac], P_ORDERS.ac_ind[i_ind]].forEach(function(p_order, i){
    trials = getFullTestSequence(trials, p_order, relations[i]);
  })
  trials = getFullTestSequence(trials, P_ORDERS.a_iff_c, 'a_iff_c')
  return trials
}

const shuffled_test_ids = pseudoRandomTestTrials();
let test_ids = _.map(slider_rating_trials, 'id');

let TEST_TRIALS = [];
shuffled_test_ids.forEach(function(id){
  let idx = _.indexOf(test_ids, id)
  TEST_TRIALS.push(slider_rating_trials[idx]);
});

if (DEBUG){
  let arr = _.map(TEST_TRIALS, 'id')
  // console.log(arr)
  let res = _.countBy(arr, function(id) {
    return id ? (id.includes('independent') ? 'ind' : id.includes('iff') ? 'iff' : 'ac') : 'undefined';
  });
  console.log(res)
}
