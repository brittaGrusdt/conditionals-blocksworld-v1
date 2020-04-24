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
// the conditions are the same for everyone in each single block, but the
// the order of presented blocks is shuffled randomly
randomTrialOrder = function(){
  let blocks = _.shuffle([
    {'a_implies_c': ['ll', 'uh'], 'independent': ['hh', 'ul'], 'a_iff_c': ['hh']},
    {'a_implies_c': ['lh', 'uu'], 'independent': ['ll', 'uh'], 'a_iff_c': ['hl']},
    {'a_implies_c': ['ul', 'hh'], 'independent': ['lh', 'uu'], 'a_iff_c': ['ll']}
  ]);
  blocks.push({'a_implies_c': ['hl'], 'independent': ['hl'], 'a_iff_c': ['uu']});
  let orders = {
    'a_implies_c': _.flatten(_.map(blocks, 'a_implies_c')),
    'a_iff_c': _.flatten(_.map(blocks, 'a_iff_c')),
    'independent': _.flatten(_.map(blocks, 'independent'))
  }
  return orders;
}

getRealTypes = function(pseudo_types){
  pseudo_types = pseudo_types.split('').join(' ')
  let type_seq = pseudo_types.replace(/x/g, TYPE_MAP.x);
  type_seq = type_seq.replace(/y/g, TYPE_MAP.y);
  type_seq = type_seq.replace(/z/g, TYPE_MAP.z);
  return type_seq.split(' ');
}

pseudoRandomTestTrials = function(){
  let trials = getRealTypes(ORDER);
  let priors = randomTrialOrder();
  Relations.forEach(function(rel){
    let conditions = priors[rel]
    conditions.forEach(function(p){
      let i = _.indexOf(trials, rel)
      trials[i] = trials[i] + '_' + p
    })
  })
  return trials
}
// save trial data to make it accessible in magpie experiment
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
