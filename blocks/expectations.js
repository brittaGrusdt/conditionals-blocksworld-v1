let stimuli = _.pairs(trials);
let expected_utts = {};

expected_utts["low_low_independent"] = ["Neither A nor C.", "not A", "not C"]
expected_utts["low_low_a_implies_c"] = ["Neither A nor C.", "not A", "not C",
  "If A fell, C would fall.(german: falls/sollte A ...)"]
expected_utts["low_low_c_implies_a"] = ["Neither A nor C.", "not A", "not C",
  "If C fell, A would fall.(german: falls/sollte C ...)"]

expected_utts["low_uncertain_independent"] = ["not A and maybe C", "not A", "maybe C"]
expected_utts["low_uncertain_a_implies_c"] = ["not A and maybe C", "not A", "maybe C",
  "If A fell, C would fall.(german: falls/sollte A ...)"
]
expected_utts["low_uncertain_c_implies_a"] = ["not A and maybe C", "not A", "maybe C",
  "If C falls, A falls.",  "C might/may cause A",
  "If A falls, C must have fallen."
]

expected_utts["low_high_independent"] = ["not A and C", "not A", "C"]
expected_utts["low_high_a_implies_c"] = ["not A and C", "not A", "C",
  "If A falls, C falls.(german: falls/sollte A ...)"
]
expected_utts["low_high_c_implies_a"] = ["C makes A fall", "A and C",
  "If C falls, A falls."
]

expected_utts["uncertain_low_independent"] = ["maybe A and not C", "maybe A", "not C"]
expected_utts["uncertain_low_a_implies_c"] = ["If A, C", "A may cause C", "maybe A"]
expected_utts["uncertain_low_c_implies_a"] = ["maybe A but not C",
  "If C falls, A falls.(german: falls/sollte A ...)"]

expected_utts["uncertain_uncertain_independent"] = ["maybe A and maybe C", "maybe A", "maybe C"]
expected_utts["uncertain_uncertain_a_implies_c"] = ["If A, C"]
expected_utts["uncertain_uncertain_c_implies_a"] = ["If C, A"]

expected_utts["uncertain_high_independent"] = ["maybe A and C", "maybe A", "C"]
expected_utts["uncertain_high_a_implies_c"] = ["maybe A and C", "If A, C"]
expected_utts["uncertain_high_c_implies_a"] = ["C causes A", "A and C"]

expected_utts["high_low_independent"] = ["A and not C", "A", "not C"]
expected_utts["high_low_a_implies_c"] = ["A causes C", "A and C"]
expected_utts["high_low_c_implies_a"] = ["A and not C", "If C falls, A falls (german: falls)"]

expected_utts["high_uncertain_independent"] = ["A and maybe C", "A", "maybe C"]
expected_utts["high_uncertain_a_implies_c"] = ["A causes C", "If A, C", "A and C"]
expected_utts["high_uncertain_c_implies_a"] = ["A and maybe C", "If C, A"]

expected_utts["high_high_independent"] = ["A and C"]
expected_utts["high_high_a_implies_c"] = ["A and C", "If A, C"]
expected_utts["high_high_c_implies_a"] = ["A and C", "If C, A"]

getExpectations = function(stimulus){
  let pa = stimulus.data[0];
  let pc = stimulus.data[1];
  let rel = stimulus.data[2];
  let key = [pa, pc, rel].join("_");
  console.log(expected_utts[key]);
  return expected_utts[key];
}
