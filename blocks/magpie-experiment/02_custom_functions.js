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
let DURATION_ANIMATION = 10000; // in ms
let key2SelectAnswer = "y";

// custom functions:
let id2Question = {"bg": "<b>Blue will</b> and <b>green will</b> touch the ground.",
                   "g": "<b>Blue will not</b> and <b>green will</b> touch the ground.",
                   "b": "<b>Blue will</b> and <b>green will not</b> touch the ground.",
                   "none": "<b>Blue will not</b> and <b>green will not</b> touch the ground."
                 };
let _idQuestions = Object.entries(id2Question);
let question2ID = {};
_idQuestions.forEach(function(keyValue){
    question2ID[keyValue[1]] = keyValue[0];
})

// function to randomly order the four utterences, given per trial
// shuffle_trial_questions
function shuffleQuestions(slider_rating_trials=[{}]) {
  for (var i = 0; i < slider_rating_trials.length; i++) {
    let utterances = _.shuffle(Object.values(id2Question));
    slider_rating_trials[i].question1 = utterances[0];
    slider_rating_trials[i].question2 = utterances[1];
    slider_rating_trials[i].question3 = utterances[2];
    slider_rating_trials[i].question4 = utterances[3];
  }
  return slider_rating_trials;
}

repliedAll = function(){
  return ($("#response1").hasClass('replied') &&
          $("#response2").hasClass('replied') &&
          $("#response3").hasClass('replied') &&
          $("#response4").hasClass('replied'));
}

htmlSliderQuestion = function(idx_question){
  let o = `<q` + idx_question + ` class='magpie-view-question grid-question' id ='question` + idx_question + `'>`;
  let c = `</q` + idx_question + `>`;
  return {open: o, close: c};
}

htmlSlider = function(idxSlider, utterances){
  let sliderID = "slider" + idxSlider
  let responseID = "response" + idxSlider
  let answerID = "answer" + idxSlider
  let outputID = "output" + idxSlider
  let outputName = "outputSlider" + idxSlider

  let start = "<s" + idxSlider + " class='magpie-grid-slider' id="+sliderID+">";
  let end = "</s" + idxSlider + ">";
  let qSlider = htmlSliderQuestion(idxSlider);
  qSlider.middle = idxSlider === 1 ? `${utterances[0]}` :
                   idxSlider === 2 ? `${utterances[1]}` :
                   idxSlider === 3 ? `${utterances[2]}` :
                   idxSlider === 4 ? `${utterances[3]}` : undefined;
  let html_question = qSlider.open + qSlider.middle + qSlider.close;

  let html_slider = start +
    `<span class='magpie-response-slider-option optionWide'>impossible event</span>
     <input type='range' id=` + responseID + ` name=` + answerID +
     ` class='magpie-response-slider' min='0' max='100' value='50' oninput='` +
     outputID + `.value = ` + responseID + `.value + "%"'/>` +
    `<span class='magpie-response-slider-option optionWide'>certain event</span>
     <output name="`+outputName+`" id=`+outputID+ ` class="thick">50%</output>`+
     end;

  return html_question + html_slider
}

htmlSliderAnswers = function(utterances){
  let html_str = `<div class='magpie-multi-slider-grid' id='answerSliders'>`;
  _.range(1,5).forEach(function(i){
    let h = htmlSlider(i, utterances);
    html_str += h;
  });
  html_str += `</div>`
  return html_str;
}

let text_train_buttons = ["GREEN and BLUE",
  "GREEN but <b>not</b> BLUE",
  "<b>Not</b> GREEN but BLUE",
  "<b>Neither</b> GREEN <b>nor</b> BLUE"
];

htmlButtonAnswers = function(){
  return `<bttns id=TrainButtons class=buttonContainer>
    <button id="ac" class=unselected>` + text_train_buttons[0] + `</button>
    <div class="divider"/>
    <button id="a" class=unselected>` + text_train_buttons[1] + `</button>
    <div class="divider"/>
    <button id="c" class=unselected>` + text_train_buttons[2] + `</button>
    <div class="divider"/>
    <button id="none" class=unselected>` + text_train_buttons[3] + `</button>
  </bttns>`
}

htmlRunNextButtons = function(){
  let htmlBttns =`<div id=parentRunNext class=magpie-buttons-grid>
      <run>
        <button id='runButton' class='grid-button magpie-view-button'>RUN</button>
      </run>
      <next>
        <button id='buttonNextAnimation' class='grid-button magpie-view-button'>NEXT SCENE</button>
      </next>
    </div>`;
  return htmlBttns;
}

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
    if (keyName === key2SelectAnswer && counter <= 3) {
      var id_nb = counter + 1;
      automaticallySelectAnswer("response" + id_nb, button2Toggle);
      counter += 1;
    }
    toggleNextIfDone(button2Toggle, repliedAll());
    return keyName;
  });
}

toggleSelected = function(bttnID){
  $('#' + bttnID).on('click', function(e){
    $('#' + bttnID).toggleClass('selected unselected')

    var parent = document.getElementById('TrainButtons');
    let nb_selected = parent.getElementsByClassName("selected").length;
    toggleNextIfDone($('#runButton'), nb_selected !== 0);

    if(nb_selected === 0){
      $('#runButton').addClass('grid-button');
    }
  });
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


getSliderQA = function(){
  let questions = [];
  let responses = [];
  let questionIDs = ["question1", "question2", "question3", "question4"];
  _.range(1,5).forEach(function(i){
    let q = $("#" + "question" + i).html();
    let q_short = question2ID[q]
    // console.log(abbreviation);
    questions.push(q_short)
    let response = $("#response" + i).val();
    responses.push(response)
  });
  return {questions, responses};
}

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

const ShuffledTrainStimuli = pseudoRandomTrainTrials();
