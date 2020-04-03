let stimuli = _.pairs(trials);
let expected_utts = {};

expected_utts["low_low_independent"] = ["Neither A nor C.", "not A", "not C"]
expected_utts["low_low_a_implies_c"] = ["Neither A nor C.", "not A", "not C",
  "If A fell, C would fall.(german: falls/sollte A ...)", "If C, A."]
expected_utts["low_low_a_iff_c"] = ["Neither A nor C.", "not A", "not C",
  "[If A, C]", "[If C, A]"]

expected_utts["low_uncertain_independent"] = ["not A", "maybe C"]
expected_utts["low_uncertain_a_implies_c"] = ["not A", "maybe C",
  "If A fell, C would fall.(german: falls/sollte A ...)"]
expected_utts["low_uncertain_a_iff_c"] = ["maybe C",
  "If C falls, A falls.",  "A may fall because of C"]

expected_utts["low_high_independent"] = ["C but not A", "not A", "C", "probably C"]
expected_utts["low_high_a_implies_c"] = ["C but not A", "not A", "C",
  "If A falls, C falls.(german: falls/sollte A ...)"]
expected_utts["low_high_a_iff_c"] = ["C", "C may make A fall", "maybe A", "If A, C."]

expected_utts["uncertain_low_independent"] = ["maybe A", "probably A", "not C"]
expected_utts["uncertain_low_a_implies_c"] = ["probably A", "If A, C", "A (may) make(s) C fall",
  "maybe A", "maybe C"]
expected_utts["uncertain_low_a_iff_c"] = ["maybe A", "If C, A", "If A, probably C"]

expected_utts["uncertain_uncertain_independent"] = ["A and C may both", "maybe A", "maybe C"]
expected_utts["uncertain_uncertain_a_implies_c"] = ["probably A and C", "A and C", "If A, C"]
expected_utts["uncertain_uncertain_a_iff_c"] = ["maybe A", "maybe C", "If A, C", "If C, A"]

expected_utts["uncertain_high_independent"] = ["maybe A", "C"]
expected_utts["uncertain_high_a_implies_c"] = ["maybe A", "C", "[If A, C]"]
expected_utts["uncertain_high_a_iff_c"] = ["maybe A", "C", "A because of C."]

expected_utts["high_low_independent"] = ["A but not C", "A", "not C"]
expected_utts["high_low_a_implies_c"] = ["C because of A", "A and C", "A", "maybe C"]
expected_utts["high_low_a_iff_c"] = ["A but not C", "If A, C may fall.", "A may/might make C fall", "If C, A."]

expected_utts["high_uncertain_independent"] = ["A", "maybe C", "probably C"]
expected_utts["high_uncertain_a_implies_c"] = ["probably A and C", "A and C", "[C because of A]"]
expected_utts["high_uncertain_a_iff_c"] = ["probably A and C", "A and C", "A",
  "maybe C", "[If C, A]", "[If A, C]"]

expected_utts["high_high_independent"] = ["A and C"]
expected_utts["high_high_a_implies_c"] = ["A and C"]
expected_utts["high_high_a_iff_c"] = ["A and C", "If A, C", "If C, A"]

getExpectations = function(stimulus){
  let pa = stimulus.data[0];
  let pc = stimulus.data[1];
  let rel = stimulus.data[2];
  let key = [pa, pc, rel].join("_");
  console.log(expected_utts[key]);
  return expected_utts[key];
}
