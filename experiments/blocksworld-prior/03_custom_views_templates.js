// In this file you can create your own custom view templates

// A view template is a function that returns a view,
// this functions gets some config (e.g. trial_data, name, etc.) information as input
// A view is an object, that has a name, CT (the counter of how many times this view occurred in the experiment),
// trials the maximum number of times this view is repeated
// and a render function, the render function gets CT and the magpie-object as input
// and has to call magpie.findNextView() eventually to proceed to the next view (or the next trial in this view),
// if it is an trial view it also makes sense to call magpie.trial_data.push(trial_data) to save the trial information

const animation_view  = {
    name: "animation",
    title: "title",
    CT: 0,
    trials: allScenes.length,
    // trials: 1,
    data: "",
    // The render function gets the magpie object as well as the current trial in view counter as input
    render: function(CT, magpie){
      let utterances = random_utterance();
      const view_template = `
        <div class='progress-bar-container'>
         <div class='progress-bar'></div>
        </div>
        <div class='magpie-view-stimulus-grid'>
          <animationTitle class='stimulus'>
            <h1>Please rate how likely each of the following statements is first.
              <span style = "display: block;">Then click on Run to see what happens!</span>
            </h1>
          </animationTitle>
          <animation id='animationDiv'>
          </animation>
          <question1 class='magpie-view-question grid-question' id ='question1' >${
            utterances[0].question1
          }</question1>
          <slider1 class='magpie-grid-slider' id='slider1'>
            <span class='magpie-response-slider-option optionWide'>impossible event</span>
            <input type='range' id='response1' name='answer1' class='magpie-response-slider' min='0' max='100' value='50' oninput='output1.value = response1.value + "%"'/>
            <span class='magpie-response-slider-option optionWide'>certain event</span>
            <output name="outputSlider1" id="output1" class="thick">50%</output>
          </slider1>
          <question2 class='magpie-view-question grid-question' id ='question2' >${
            utterances[0].question2
          }</question2>
          <slider2 class='magpie-grid-slider' id='slider2'>
            <span class='magpie-response-slider-option optionWide'>impossible event</span>
            <input type='range' id='response2' name='answer2' class='magpie-response-slider' min='0' max='100' value='50' oninput='output2.value = response2.value + "%"'/>
            <span class='magpie-response-slider-option optionWide'>certain event</span>
            <output name="outputSlider2" id="output2" class="thick">50%</output>
          </slider2>
          <question3 class='magpie-view-question grid-question' id ='question3' >${
            utterances[0].question3
          }</question3>
          <slider3 class='magpie-grid-slider' id='slider3'>
            <span class='magpie-response-slider-option optionWide'>impossible event</span>
            <input type='range' id='response3' name='answer3' class='magpie-response-slider' min='0' max='100' value='50' oninput='output3.value = response3.value + "%"'/>
            <span class='magpie-response-slider-option optionWide'>certain event</span>
            <output name="outputSlider3" id="output3" class="thick">50%</output>
          </slider3>
          <question4 class='magpie-view-question grid-question' id ='question4' >${
            utterances[0].question4
          }</question4>
          <slider4 class='magpie-grid-slider' id='slider4'>
            <span class='magpie-response-slider-option optionWide'>impossible event</span>
            <input type='range' id='response4' name='answer4' class='magpie-response-slider' min='0' max='100' value='50' oninput='output4.value = response4.value + "%"'/>
            <span class='magpie-response-slider-option optionWide'>certain event</span>
            <output name="outputSlider4" id="output4" class="thick">50%</output>
          </slider4>
          <run>
            <button id="runButton" class="magpie-view-button grid-button">Run</button>
          </run>
          <next>
            <button id='buttonNextAnimation' class='magpie-view-button grid-button'>Next scenario</button>
          </next>
          </div>
      `;
      $('#main').html(view_template);

      let sceneData = defineScene(allScenes[CT]);
      let worldObjects = createScene(allScenes[CT]["platform.type"], sceneData, true);

      let platforms = allScenes[CT]["platform.type"] == "seesaw" ? ["seesaw", ""] :
        allScenes[CT]["platform.type"] == "basic1" ? [[sceneData.p1.x, sceneData.p1.y, sceneData.p1.width, sceneData.p1.height], ""] :
        [[sceneData.p1.x, sceneData.p1.y, sceneData.p1.width, sceneData.p1.height],
         [sceneData.p2.x, sceneData.p2.y, sceneData.p2.width, sceneData.p2.height]];

      let startTime = Date.now();
      showScene(worldObjects, document.getElementById('animationDiv'));

      let animationRun = false;
      let runButton = $('#runButton');
      runButton.on('click', function(e){
        if(!animationRun && repliedAll()) {
          animationRun = true;
          runAnimation(worldObjects);
          toggleNextIfDone($("#buttonNextAnimation"), true);
        }
      });

      if (magpie.deploy.deployMethod === "debug") {
        addShortCut2SelectAnswers($("#runButton"));
      }

      $("#response1").on("change", function () {
        $("#response1").addClass('replied');
        toggleNextIfDone(runButton, repliedAll());
      });

      $("#response2").on("change", function () {
        $("#response2").addClass('replied')
        toggleNextIfDone(runButton, repliedAll());
      });

      $("#response3").on("change", function () {
        $("#response3").addClass('replied')
        toggleNextIfDone(runButton, repliedAll());
      });

      $("#response4").on("change", function () {
        $("#response4").addClass('replied')
        toggleNextIfDone(runButton, repliedAll());
      });

      $("#buttonNextAnimation").on("click", function () {
          const RT = Date.now() - startTime; // measure RT before anything else
          let utterances = [];
          let utteranceIDs = ["question1", "question2", "question3", "question4"];
          utteranceIDs.forEach(function(qid){
            let q = $("#"+qid).html();
            let abbreviation = question2ID[q]
            utterances.push(abbreviation)
          });
          let trial_data = {
            trial_name: allScenes[CT].id,
            trial_number: CT + 1,
            response: [$("#response1").val(), $("#response2").val(),
                        $("#response3").val(), $("#response4").val()
                      ],
            utterances: utterances,
            b1: [sceneData.b1.x, sceneData.b1.y, sceneData.b1.width, sceneData.b1.height],
            b2: [sceneData.b2.x, sceneData.b2.y, sceneData.b2.width, sceneData.b2.height],
            p1: platforms[0],
            p2: platforms[1],
            RT: RT
          };
          trial_data = magpieUtils.view.save_config_trial_data(
            {},
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
      <h1 class='stimulus'>
      ${config.data[CT].QUD}
      </h1>
      <div class='stimulus'>
      <img src=${config.data[CT].picture}>
      </div>
      </div>`;
  },

  answer_container_gen: function (config, CT) {
    const option1 = config.data[CT].optionLeft;
    const option2 = config.data[CT].optionRight;
    return `<div class='magpie-multi-slider-grid' id='target'>
              <question1 class='magpie-view-question grid-question' id ='question1' >${
                config.data[CT].question1
              }</question1>
              <slider1 class='magpie-grid-slider' id='slider1'>
                <span class='magpie-response-slider-option optionWide'>${option1}</span>
                <input type='range' id='response1' name='answer1' class='magpie-response-slider' min='0' max='100' value='50' oninput='output1.value = response1.value + "%"'/>
                <span class='magpie-response-slider-option optionWide'>${option2}</span>
                <output name="outputSlider1" id="output1" class="thick">50%</output>
              </slider1>
              <question2 class='magpie-view-question grid-question' id ='question2' >${
                config.data[CT].question2
              }</question2>
              <slider2 class='magpie-grid-slider' id='slider2'>
                <span class='magpie-response-slider-option optionWide'>${option1}</span>
                <input type='range' id='response2' name='answer2' class='magpie-response-slider' min='0' max='100' value='50' oninput='output2.value = response2.value + "%"'/>
                <span class='magpie-response-slider-option optionWide'>${option2}</span>
                <output name="outputSlider2" id="output2" class="thick">50%</output>
              </slider2>
              <question3 class='magpie-view-question grid-question' id ='question3' >${
                config.data[CT].question3
              }</question3>
              <slider3 class='magpie-grid-slider' id='slider3'>
                <span class='magpie-response-slider-option optionWide'>${option1}</span>
                <input type='range' id='response3' name='answer3' class='magpie-response-slider' min='0' max='100' value='50' oninput='output3.value = response3.value + "%"'/>
                <span class='magpie-response-slider-option optionWide'>${option2}</span>
                <output name="outputSlider3" id="output3" class="thick">50%</output>
              </slider3>
              <question4 class='magpie-view-question grid-question' id ='question4' >${
                config.data[CT].question4
              }</question4>
              <slider4 class='magpie-grid-slider' id='slider4'>
                <span class='magpie-response-slider-option optionWide'>${option1}</span>
                <input type='range' id='response4' name='answer4' class='magpie-response-slider' min='0' max='100' value='50' oninput='output4.value = response4.value + "%"'/>
                <span class='magpie-response-slider-option optionWide'>${option2}</span>
                <output name="outputSlider4" id="output4" class="thick">50%</output>
              </slider4>
              </div>
              <button id='buttonNext' class='grid-button magpie-view-button'>Next scenario</button>`;
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
    if (magpie.deploy.deployMethod === "debug") {
      addShortCut2SelectAnswers(button);
    }
    // add data of scene
    let pic = config.data[CT].picture
    let trialID = pic.split("/")[4].split(".")[0]
    let sceneData = defineScene(id2TrialData[trialID]);
    let platforms = id2TrialData[trialID]["platform.type"] == "seesaw" ? ["seesaw", ""] :
      id2TrialData[trialID]["platform.type"] == "basic1" ? [[sceneData.p1.x, sceneData.p1.y, sceneData.p1.width, sceneData.p1.height], ""] :
      [[sceneData.p1.x, sceneData.p1.y, sceneData.p1.width, sceneData.p1.height],
       [sceneData.p2.x, sceneData.p2.y, sceneData.p2.width, sceneData.p2.height]];


    // the next button has to be pressed, in order to get to next trial
    // check the sliders for all 4 utterance and handle next button
    // this is code without debut mode
    $("#response1").on("change", function () {
      $('#response1').addClass('replied');
      toggleNextIfDone(button, repliedAll());
    });

    $("#response2").on("change", function () {
      $('#response2').addClass('replied')
      toggleNextIfDone(button, repliedAll());
    });

    $("#response3").on("change", function () {
      $('#response3').addClass('replied')
      toggleNextIfDone(button, repliedAll());
    });

    $("#response4").on("change", function () {
      $('#response4').addClass('replied')
      toggleNextIfDone(button, repliedAll());
    });

    button.on("click", function () {
        const RT = Date.now() - startingTime; // measure RT before anything else
        let trial_data = {
          trial_name: config.name,
          trial_number: CT + 1,
          response: [$("#response1").val(), $("#response2").val(),
                      $("#response3").val(), $("#response4").val()
                    ],
          utterances: [question2ID[config.data[CT].question1],
                       question2ID[config.data[CT].question2],
                       question2ID[config.data[CT].question3],
                       question2ID[config.data[CT].question4]
                      ],
          b1: [sceneData.b1.x, sceneData.b1.y, sceneData.b1.width, sceneData.b1.height],
          b2: [sceneData.b2.x, sceneData.b2.y, sceneData.b2.width, sceneData.b2.height],
          p1: platforms[0],
          p2: platforms[1],
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
