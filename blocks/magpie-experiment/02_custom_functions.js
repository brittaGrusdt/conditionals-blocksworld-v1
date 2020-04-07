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
function random_utterance(slider_rating_trials=[{}]) {
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

htmlQuestionsInAnimation = function(utterances){
  return `<question1 class='magpie-view-question grid-question' id ='question1' >
    ${utterances[0].question1}
  </question1>
  <slider1 class='magpie-grid-slider' id='slider1'>
    <span class='magpie-response-slider-option optionWide'>impossible event</span>
    <input type='range' id='response1' name='answer1' class='magpie-response-slider' min='0' max='100' value='50' oninput='output1.value = response1.value + "%"'/>
    <span class='magpie-response-slider-option optionWide'>certain event</span>
    <output name="outputSlider1" id="output1" class="thick">50%</output>
  </slider1>

  <question2 class='magpie-view-question grid-question' id ='question2'>
    ${utterances[0].question2}
  </question2>
  <slider2 class='magpie-grid-slider' id='slider2'>
    <span class='magpie-response-slider-option optionWide'>impossible event</span>
    <input type='range' id='response2' name='answer2' class='magpie-response-slider' min='0' max='100' value='50' oninput='output2.value = response2.value + "%"'/>
    <span class='magpie-response-slider-option optionWide'>certain event</span>
    <output name="outputSlider2" id="output2" class="thick">50%</output>
  </slider2>

  <question3 class='magpie-view-question grid-question' id ='question3' >
    ${utterances[0].question3}
  </question3>
  <slider3 class='magpie-grid-slider' id='slider3'>
    <span class='magpie-response-slider-option optionWide'>impossible event</span>
    <input type='range' id='response3' name='answer3' class='magpie-response-slider' min='0' max='100' value='50' oninput='output3.value = response3.value + "%"'/>
    <span class='magpie-response-slider-option optionWide'>certain event</span>
    <output name="outputSlider3" id="output3" class="thick">50%</output>
  </slider3>

  <question4 class='magpie-view-question grid-question' id ='question4' >
    ${utterances[0].question4}
  </question4>
  <slider4 class='magpie-grid-slider' id='slider4'>
    <span class='magpie-response-slider-option optionWide'>impossible event</span>
    <input type='range' id='response4' name='answer4' class='magpie-response-slider' min='0' max='100' value='50' oninput='output4.value = response4.value + "%"'/>
    <span class='magpie-response-slider-option optionWide'>certain event</span>
    <output name="outputSlider4" id="output4" class="thick">50%</output>
  </slider4>
`;
}

htmlRunNextButtons = function(runEnabled){
  let classRun = runEnabled ? "class=magpie-view-button" :
    "class=magpie-view-button grid-button";
  let htmlBttns =
  `<run>
    <button id="runButton" ` + classRun + `>RUN</button>
  </run>
  <next>
    <button id='buttonNextAnimation' class='magpie-view-button grid-button'>NEXT SCENE</button>
  </next>`;
  return htmlBttns;
}


toggleNextIfDone = function (button, condition) {
    if(condition){
      button.removeClass("grid-button");
    }
};

automaticallySelectAnswer = function(responseID) {
    document.getElementById(responseID).value = Math.floor(Math.random() * 101);
    $("#" + responseID).addClass('replied');
}

let key2SelectAnswer = "y";

addShortCut2SelectAnswers = function(button2Toggle){
  let counter = 0;
  document.addEventListener("keydown", event => {
    var keyName = event.key;
    if (counter == 0 && keyName === key2SelectAnswer) {
      automaticallySelectAnswer("response1");
      toggleNextIfDone(button2Toggle, repliedAll())
      counter += 1;
    } else if (counter == 1 && keyName === key2SelectAnswer){
      automaticallySelectAnswer("response2");
      toggleNextIfDone(button2Toggle, repliedAll())
      counter += 1;
    } else if (counter == 2 && keyName === key2SelectAnswer){
      automaticallySelectAnswer("response3");
      toggleNextIfDone(button2Toggle, repliedAll())
      counter += 1;
    } else if(counter == 3 && keyName === key2SelectAnswer){
      automaticallySelectAnswer("response4");
      toggleNextIfDone(button2Toggle, repliedAll())
      counter += 1;
    }
    return keyName;
  });
}
// $('#runButton')
addCheckResponseFunctionality = function(button2Toggle) {
  $("#response1").on("change", function () {
    $("#response1").addClass('replied');
    toggleNextIfDone(button2Toggle, repliedAll());
  });

  $("#response2").on("change", function () {
    $("#response2").addClass('replied')
    toggleNextIfDone(button2Toggle, repliedAll());
  });

  $("#response3").on("change", function () {
    $("#response3").addClass('replied')
    toggleNextIfDone(button2Toggle, repliedAll());
  });

  $("#response4").on("change", function () {
    $("#response4").addClass('replied')
    toggleNextIfDone(button2Toggle, repliedAll());
  });
}


saveTrialQA = function(){
  let questions = [];
  let questionIDs = ["question1", "question2", "question3", "question4"];
  questionIDs.forEach(function(qid){
    let q = $("#"+qid).html();
    let abbreviation = question2ID[q]
    // console.log(abbreviation);
    questions.push(abbreviation)
  });

  let responses = [$("#response1").val(), $("#response2").val(),
                   $("#response3").val(), $("#response4").val()];
  return {questions, responses};
}
