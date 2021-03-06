// Here, you can define all custom functions, you want to use and initialize some variables

// You can determine global (random) parameters here

// Declare your variables here

/* For generating random participant IDs */
// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
// dec2hex :: Integer -> String
const dec2hex = function (dec) {
  return ("0" + dec.toString(16))
    .substr(-2);
};
// generateId :: Integer -> String
const generateID = function (len) {
  let arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, this.dec2hex)
    .join("");
};

// Error feedback if participants exceeds the time for responding
const time_limit = function (data, next) {
  if (typeof window.timeout === "undefined") {
    window.timeout = [];
  }
  // Add timeouts to the timeoutarray
  // Reminds the participant to respond after 5 seconds
  window.timeout.push(
    setTimeout(function () {
      $("#reminder")
        .text("Please answer more quickly!");
    }, 5000)
  );
  next();
};

// compares the chosen answer to the value of `option1`
// check_response = function (data, next) {
//   $("input[name=answer]")
//     .on("change", function (e) {
//       if (e.target.value === data.correct) {
//         alert("Your answer is correct! Yey!");
//       } else {
//         alert(
//           "Sorry, this answer is incorrect :( The correct answer was " +
//           data.correct
//         );
//       }
//       next();
//     });
// };
// custom parameters:
const DURATION_ANIMATION = 10000; // in ms
const KEY2SELECTANSWER = "y";

const NB_TRAIN_TRIALS = TrainStimuli.list_all.length;
// const NB_TRAIN_TRIALS = 3;
const TRAIN_BTTN_IDS = ['ac', 'a', 'c', 'none'];

const TYPE_MAP = {x: 'a_implies_c', y: 'independent', z: 'a_iff_c'}
// each letter represents one trial!
// 3 blocks a 5 trials each (zz-yy-x) + 1 block a 3 trials (x-y-z)
// --> 7z + 7y + 4x = 18 trials
// TYPE_ORDERS are the 10 unique possibilities to join different cn trial types
// zz-yy-x without repeating one in a row
const TYPE_ORDERS = [
  ['y', 'z', 'x', 'y', 'z'],
  ['x', 'y', 'z', 'y', 'x'],
  ['y', 'x', 'z', 'y', 'x'],
  ['z', 'y', 'x', 'y', 'x'],
  ['x', 'y', 'z', 'x', 'y'],
  ['x', 'z', 'y', 'x', 'y'],
  ['y', 'x', 'z', 'x', 'y'],
  ['z', 'x', 'y', 'x', 'y'],
  ['x', 'y', 'x', 'y', 'z'],
  ['y', 'x', 'y', 'x', 'z']
];

getRealTypes = function(pseudo_types){
  pseudo_types = pseudo_types.split('').join(' ')
  let type_seq = pseudo_types.replace(/x/g, TYPE_MAP.x);
  type_seq = type_seq.replace(/y/g, TYPE_MAP.y);
  type_seq = type_seq.replace(/z/g, TYPE_MAP.z);
  return type_seq.split(' ');
}

// custom functions:
toggleNextIfDone = function (button, condition) {
    if(condition){
      button.removeClass("grid-button");
    }
};

automaticallySelectAnswer = function(responseID, button2Toggle) {
    document.getElementById(responseID).value = Math.floor(Math.random() * 101);
    $("#" + responseID).addClass('replied');
}

addKeyToMoveSliders = function(button2Toggle){
  let counter = 0;
  document.addEventListener("keydown", event => {
    var keyName = event.key;
    if (keyName === KEY2SELECTANSWER && counter <= 3) {
      var id_nb = counter + 1;
      automaticallySelectAnswer("response" + id_nb, button2Toggle);
      counter += 1;
    }
    toggleNextIfDone(button2Toggle, repliedAll());
    return keyName;
  });
}

repliedAll = function(){
  return ($("#response1").hasClass('replied') &&
          $("#response2").hasClass('replied') &&
          $("#response3").hasClass('replied') &&
          $("#response4").hasClass('replied'));
}

_checkSliderResponse = function(id, button2Toggle){
  $("#" + id).on("change", function () {
    $("#" + id).addClass('replied');
    toggleNextIfDone(button2Toggle, repliedAll());
  });
}

addCheckSliderResponse = function(button2Toggle) {
  _.range(1,5).forEach(function(i){
    _checkSliderResponse("response" + i, button2Toggle);
  });
}

abbreviateQuestion = function(question, symbols){
  let q_words = [];
  question.split(' ').forEach(function(w){
    w = w.trim().replace('<b>', '');
    w = w.replace('</b>', '');
    if(w === "will" || w==="not"){
      q_words.push(w)
    }
  });
  let w = q_words.join(' ')
  let q_short = w === 'will will' ? symbols.join('') :
                w === 'will will not' ? symbols[0] :
                w === 'will not will' ? symbols[1] : 'none';
  return q_short.toLowerCase();
}

iconHtml2Utterance = function(question, symbols) {
  let words = question.trim().split('/');
  let utt1 = words[3].split('.')[0]
  let utt2 = words[6].split('.')[0]
  let utt;
  if(utt1.includes('not')){
    utt = utt2.includes('not') ? 'none' : symbols[1];
  } else {
    utt = utt2.includes('not') ? symbols[0] : symbols.join('');
  }
  return {short: utt, long: [utt1, utt2].join('-')};
}

getButtonQA = function() {
  let button_ids = ['ac', 'a', 'c', 'none']
  let questions = [];
  let responses = [];
  button_ids.forEach(function(id){
    responses.push($('#' + id).hasClass('selected'));
    questions.push(id)
  });
  return {questions, responses}
}

getSliderQA = function(trial_type="test"){
  let questions = [];
  let responses = [];
  let utterances = [];
  let qs = trial_type==="test" ? [block_cols.test[0][0], block_cols.test[1][0]] :
    ['a', 'c'];
  _.range(1,5).forEach(function(i){
    let question = $("#" + "question" + i).html();
    // let q_short = abbreviateQuestion(question, qs);
    let data = iconHtml2Utterance(question, qs);
    utterances.push(data.short);
    questions.push(data.long);
    let response = $("#response" + i).val();
    responses.push(response)
  });
  return {questions, responses, utterances};
}


showAnimationInTrial = function(CT, html_answers, progress_bar=true){
  let html_bar = progress_bar ? `<div class='progress-bar-container'>
       <div class='progress-bar'></div>
      </div>` : ``;
  const view_template = html_bar +
    `<div class='magpie-view-stimulus-grid'>
      <animationTitle class='stimulus'>
        <h1>${TRAIN_TRIALS[CT].QUD}</h1>
      </animationTitle>
      <animation id='animationDiv'></animation>
    </div>` +
    html_answers +
    htmlRunNextButtons();

  $('#main').html(view_template);

  let stimulus = SHUFFLED_TRAIN_STIMULI[CT];
  if(DEBUG){
    console.log(stimulus.id);
  }

  let worldElems = createWorld();
  let engine = worldElems.engine;
  let render = worldElems.render;
  addObjs2World(stimulus.objs, engine);
  show(engine, render);
  let startTime = Date.now();

  return {engine, render, startTime}
}
