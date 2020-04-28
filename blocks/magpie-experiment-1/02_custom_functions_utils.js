sliderTexts = function (col1, col2, key1, key2) {
  let id2Text = {};
  id2Text[key1 + key2] = "<b>" + col1 + " will</b> and <b>" + col2 + " will</b> fall.";
  id2Text[key1] = "<b>" + col1 + " will not</b> and <b>" + col2 + " will</b> fall.";
  id2Text[key2] = "<b>" + col1 + " will</b> and <b>" + col2 + " will not</b> fall.";
  id2Text["none"] = "<b>" + col1 + " will not</b> and <b>" + col2 + " will not</b> fall.";
  return id2Text;
}

sliderIcons = function (cols, keys) {
  let id2Html = {}
  id2Html[keys[0] + keys[1]] = `<div>` +
    `<img src=stimuli/img/icons/` + cols[0] + `.png>` +
    `<img src=stimuli/img/icons/` + cols[1] + `.png>` +
    `</div>`;

  id2Html[keys[0]] = `<div>` +
    `<img src=stimuli/img/icons/` + cols[0] + `.png>` +
    `<img src=stimuli/img/icons/not-` + cols[1] + `.png>` +
    `</div>`;

  id2Html[keys[1]] = `<div>` +
    `<img src=stimuli/img/icons/not-` + cols[0] + `.png>` +
    `<img src=stimuli/img/icons/` + cols[1] + `.png>` +
    `</div>`;

  id2Html["none"] = `<div>` +
    `<img src=stimuli/img/icons/not-` + cols[0] + `.png>` +
    `<img src=stimuli/img/icons/not-` + cols[1] + `.png>` +
    `</div>`;
  return id2Html;
}

let block_cols = {
  test: ['green', 'blue'],
  train: ['red', 'yellow']
}

// let id2Question = sliderTexts(block_cols.test[0], block_cols.test[1], 'b', 'g');
let id2Question = sliderIcons(block_cols.test, ['b', 'g']);
// let text_test_sliders = sliderTexts(block_cols.test[0], block_cols.test[1], 'b', 'g');

let id2QuestionTrain = sliderIcons(block_cols.train, ['a', 'c']);
// let id2QuestionTrain = sliderTexts(block_cols.train[0], block_cols.train[1], 'a', 'c');
let text_train_buttons = {
  'ac': block_cols.train[0] + " and " + block_cols.train[1],
  'a': block_cols.train[0] + " but <b>not</b> " + block_cols.train[1],
  'c': "<b>Not </b>" + block_cols.train[0] + " but " + block_cols.train[1],
  'none': "<b>Neither </b>" + block_cols.train[0] + " <b>nor</b> " + block_cols.train[1]
};

// function to randomly order the four utterences, given per trial
// shuffle_trial_questions
function shuffleQuestionsAllTrials(questions, slider_rating_trials = [{}]) {
  for (var i = 0; i < slider_rating_trials.length; i++) {
    let utterances = _.shuffle(questions);
    slider_rating_trials[i].question1 = utterances[0];
    slider_rating_trials[i].question2 = utterances[1];
    slider_rating_trials[i].question3 = utterances[2];
    slider_rating_trials[i].question4 = utterances[3];
  }
  return slider_rating_trials;
}

_htmlSliderQuestion = function (idx_question) {
  let o = `<q` + idx_question +
    ` class='magpie-view-question grid-question' id ='question` +
    idx_question + `'>`;
  let c = `</q` + idx_question + `>`;
  return {
    open: o,
    close: c
  };
}

_htmlSlider = function (idxSlider, utterance, options) {
  let sliderID = "slider" + idxSlider
  let responseID = "response" + idxSlider
  let answerID = "answer" + idxSlider
  let outputID = "output" + idxSlider
  let outputName = "outputSlider" + idxSlider

  let start = "<s" + idxSlider + " class='magpie-grid-slider' id=" + sliderID + ">";
  let end = "</s" + idxSlider + ">";
  let qSlider = _htmlSliderQuestion(idxSlider);
  let html_question = qSlider.open + utterance + qSlider.close;

  let html_slider = start +
    `<span class='magpie-response-slider-option optionWide'>` + options.left + `</span>
     <input type='range' id=` + responseID + ` name=` + answerID +
    ` class='magpie-response-slider' min='0' max='100' value='50' oninput='` +
    outputID + `.value = ` + responseID + `.value + "%"'/>` +
    `<span class='magpie-response-slider-option optionWide'>` + options.right + `</span>
    <output name="` + outputName + `" id=` + outputID + ` class="thick">50%</output>` +
    end;

  return html_question + html_slider
}

htmlSliderAnswers = function (trial_data) {
  let utterances = [trial_data.question1, trial_data.question2,
    trial_data.question3, trial_data.question4];
  const option1 = trial_data.optionLeft;
  const option2 = trial_data.optionRight;

  let html_str = `<div class='magpie-multi-slider-grid' id='answerSliders'>`;
  _.range(1, 5)
    .forEach(function (i) {
      let h = _htmlSlider(i, utterances[i - 1], {
        left: option1,
        right: option2
      });
      html_str += h;
    });
  html_str += `</div>`
  return html_str;
}

htmlButtonAnswers = function () {
  return `<bttns id=TrainButtons class=buttonContainer>
    <button id="ac" class="unselected styled-button">` + id2QuestionTrain.ac + `</button>
    <div class="divider"/>
    <button id="a" class="unselected styled-button">` + id2QuestionTrain.a + `</button>
    <div class="divider"/>
    <button id="c" class="unselected styled-button">` + id2QuestionTrain.c + `</button>
    <div class="divider"/>
    <button id="none" class="unselected styled-button">` + id2QuestionTrain.none + `</button>
  </bttns>`;
}

htmlRunNextButtons = function () {
  let htmlBttns =
    `<div id=parentRunNext class=magpie-buttons-grid>
      <run>
        <button id='runButton' class='grid-button magpie-view-button'>RUN</button>
      </run>
      <next>
        <button id='buttonNextAnimation' class='grid-button magpie-view-button'>NEXT SCENE</button>
      </next>
    </div>`;
  return htmlBttns;
}
