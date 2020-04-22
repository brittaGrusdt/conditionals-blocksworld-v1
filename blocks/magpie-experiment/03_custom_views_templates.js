// In this file you can create your own custom view templates

// A view template is a function that returns a view,
// this functions gets some config (e.g. trial_data, name, etc.) information as input
// A view is an object, that has a name, CT (the counter of how many times this view occurred in the experiment),
// trials the maximum number of times this view is repeated
// and a render function, the render function gets CT and the magpie-object as input
// and has to call magpie.findNextView() eventually to proceed to the next view (or the next trial in this view),
// if it is an trial view it also makes sense to call magpie.trial_data.push(trial_data) to save the trial information
const animation_view1  = {
    name: "animation",
    title: "title",
    CT: 0, //is this the start value?
    trials: NB_TRAIN_TRIALS - 1,
    data: "",
    // The render function gets the magpie object as well as the current trial
    // in view counter as input
    render: function(CT, magpie){
      let html_answers = htmlButtonAnswers();
      let animation = showAnimationInTrial(CT, html_answers);

      let cleared = false;
      Events.on(animation.engine, 'afterUpdate', function (event) {
        if (!cleared && animation.engine.timing.timestamp >= DURATION_ANIMATION) {
          clearWorld(animation.engine, animation.render, stop2Render=false);
          cleared = true;
        }
      });
      TRAIN_BTTN_IDS.forEach(function(id){
        toggleSelected(id);
      });

      let animationStarted = false;
      $('#runButton').on('click', function(e){
        if(!animationStarted) {
          animationStarted = true;
          runAnimation(animation.engine);
          toggleNextIfDone($("#buttonNextAnimation"), true);
          //selected answers can't be changed anymore
          $(".selected").off("click");
          $(".unselected").off("click");
        }
      });

      $("#buttonNextAnimation").on("click", function () {
          const RT = Date.now() - animation.startTime; // measure RT before anything else
          if(!cleared){
            clearWorld(animation.engine, animation.render, stop2Render=false);
          }
          let data = getButtonQA();
          let trial_data = {
            trial_name: SHUFFLED_TRAIN_STIMULI[CT].id,
            trial_number: CT + 1,
            response: data.responses,
            utterances: data.questions,
            RT: RT
          };
          trial_data = magpieUtils.view.save_config_trial_data(
            TRAIN_TRIALS[CT],
            trial_data
          );
          magpie.trial_data.push(trial_data);
          magpie.findNextView();
      });
    }
};

const animation_view2  = {
    name: "animation",
    title: "title",
    CT: NB_TRAIN_TRIALS - 1, //is this the start value?
    trials: 1,
    data: "",
    // The render function gets the magpie object as well as the current trial
    // in view counter as input
    render: function(CT, magpie){
      let html_answers = htmlSliderAnswers(TRAIN_TRIALS[CT])
      let animation = showAnimationInTrial(CT, html_answers, progress_bar=false);

      let cleared = false;
      Events.on(animation.engine, 'afterUpdate', function (event) {
        if(!cleared && animation.engine.timing.timestamp >= DURATION_ANIMATION){
          clearWorld(animation.engine, animation.render, stop2Render=false);
          cleared = true;
        }
      });
      addCheckSliderResponse($('#runButton'));
      DEBUG ? addKeyToMoveSliders($("#runButton")) : null;

      let animationStarted = false;
      $('#runButton').on('click', function(e){
        if(!animationStarted) {
          animationStarted = true;
          runAnimation(animation.engine);
          toggleNextIfDone($("#buttonNextAnimation"), true);
          //selected answers can't be changed anymore
          _.range(1,5).forEach(function(i){
            document.getElementById("response" + i).disabled = true;
          });
        }
      });
      $("#buttonNextAnimation").on("click", function () {
          const RT = Date.now() - animation.startTime; // measure RT before anything else
          if(!cleared){
            clearWorld(animation.engine, animation.render, stop2Render=false);
          }
          let data = getSliderQA("train");
          let trial_data = {
            trial_name: SHUFFLED_TRAIN_STIMULI[CT].id,
            trial_number: CT + 1,
            response: data.responses,
            utterances: data.questions,
            RT: RT
          };
          trial_data = magpieUtils.view.save_config_trial_data(
            TRAIN_TRIALS[CT],
            trial_data
          );
          magpie.trial_data.push(trial_data);
          magpie.findNextView();
      });
    }
};


// generate a new multi_slider
const multi_slider_generator = {
  stimulus_container_gen: function (config, CT) {
    return `<div class='magpie-view'>
        <h1 class='stimulus'>${config.data[CT].QUD}</h1>
        <div class='stimulus'>
          <img src=${config.data[CT].picture}>
        </div>
      </div>`;
  },

  answer_container_gen: function (config, CT) {
    return htmlSliderAnswers(config.data[CT]) +
    `<button id='buttonNext' class='grid-button magpie-view-button'>Next scene</button>`;
  },

  handle_response_function: function (
    config,
    CT,
    magpie,
    answer_container_generator,
    startingTime
  ) {
    $(".magpie-view").append(answer_container_generator(config, CT));
    let button = $("#buttonNext");
    // function for debugging - if "y" is pressed, the slider will change
    if (DEBUG) {
      addKeyToMoveSliders(button);
      console.log(config.data[CT].id)
    }
    addCheckSliderResponse(button);
    button.on("click", function () {
        const RT = Date.now() - startingTime; // measure RT before anything else
        let responseData = getSliderQA("test");
        let trial_data = {
          trial_name: config.name,
          trial_number: CT + 1,
          response: responseData.responses,
          utterances: responseData.questions,
          RT: RT
        };
        trial_data = magpieUtils.view.save_config_trial_data(
          config.data[CT],
          trial_data
        );
        magpie.trial_data.push(trial_data);
        magpie.findNextView();
      });
  }
};
