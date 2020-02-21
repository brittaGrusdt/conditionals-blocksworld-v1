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
      let utterances = shuffled_utterances();
      const view_template = `
        <div class='progress-bar-container'>
         <div class='progress-bar'></div>
        </div>
        <div class='magpie-view-stimulus-grid'>
          <animationTitle class='stimulus'>
            <h1 id="headerUtterances">How acceptable is the utterance below as an informative description of the picture?
            </h1>
            <h1 class="magpie-nodisplay" id="headerRun">Click on Run to see what happens!</h1>
          </animationTitle>
          <animation id='animationDiv'>
          </animation>
          <div id='utterance1' class='magpie-view-answer-container'>
              <p class='magpie-view-question' id = 'question1' >${
                utterances[0].question1
              }</p>
              <span class='magpie-response-slider-option'>completely inacceptable</span>
              <input type='range' id='response1' name='answer1' class='magpie-response-slider' min='0' max='100' value='50'/>
              <span class='magpie-response-slider-option'>completely acceptable</span>
          </div>
          <div  id='utterance2' class='magpie-view-answer-container  magpie-nodisplay'>
              <p class='magpie-view-question' id = 'question2' >${
                utterances[0].question2
              }</p>
              <span class='magpie-response-slider-option'>completely inacceptable</span>
              <input type='range' id='response2' name='answer2' class='magpie-response-slider' min='0' max='100' value='50'/>
              <span class='magpie-response-slider-option'>completely acceptable</span>
          </div>
          <div id='utterance3' class='magpie-view-answer-container magpie-nodisplay'>
              <p class='magpie-view-question' id = 'question3' >${
                utterances[0].question3
              }</p>
              <span class='magpie-response-slider-option'>completely inacceptable</span>
              <input type='range' id='response3' name='answer3' class='magpie-response-slider' min='0' max='100' value='50'/>
              <span class='magpie-response-slider-option'>completely acceptable</span>
          </div>
          <div id='utterance4' class='magpie-view-answer-container magpie-nodisplay'>
              <p class='magpie-view-question' id = 'question4' >${
                utterances[0].question4
              }</p>
              <span class='magpie-response-slider-option'>completely inacceptable</span>
              <input type='range' id='response4' name='answer4' class='magpie-response-slider' min='0' max='100' value='50'/>
              <span class='magpie-response-slider-option'>completely acceptable</span>
          </div>
          <button id="runButton" class="magpie-view-button green-button grid-button magpie-nodisplay">Run</button>
          <button id='buttonNextUtterance' class='magpie-view-button grid-button'>Next utterance</button>
          <button id='buttonNextAnimation' class='magpie-view-button orange-button grid-button magpie-nodisplay'>Next scene</button>
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

      let current_utterance = 0;
      $('#response1').on("change", function() {
        $('#response1').addClass('replied');
        $("#buttonNextUtterance").removeClass("grid-button");
        current_utterance = 1;
      });
      $("#response2").on("change", function() {
        $('#response2').addClass('replied');
        $("#buttonNextUtterance").removeClass("grid-button");
        current_utterance = 2;
      });
      $('#response3').on("change", function() {
        $('#response3').addClass('replied');
        $("#buttonNextUtterance").removeClass("grid-button");
        current_utterance = 3;
      });
      $("#response4").on("change", function() {
        $('#response4').addClass('replied');
        // show run button instead of next utterance button
        $("#buttonNextUtterance").addClass("magpie-nodisplay");
        $("#runButton").removeClass("magpie-nodisplay");
        $("#runButton").removeClass("grid-button");
        // switch headerRun
        $('#headerUtterances').addClass('magpie-nodisplay');
        $('#headerRun').removeClass('magpie-nodisplay');
        current_utterance = 4;
      });

      $("#buttonNextUtterance").on("click", function() {
        const RT = Date.now() - startTime; // measure RT before anything else
        // show next utterance and toggle next button again
        let next_utterance = current_utterance + 1;
        $('#utterance' + current_utterance).addClass('magpie-nodisplay')
        $('#utterance' + next_utterance).removeClass('magpie-nodisplay')
        $("#buttonNextUtterance").addClass("grid-button");
      });

      let animationRun = false;
      $('#runButton').on('click', function(e){
        if(!animationRun) {
          animationRun = true;
          runAnimation(worldObjects);
          $("#runButton").toggleClass("magpie-nodisplay");
          $('#buttonNextAnimation').toggleClass('magpie-nodisplay');
          $('#buttonNextAnimation').toggleClass('grid-button');
          // slider can't be moved after having clicked on run
          document.getElementById('response4').disabled = true;
        }
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
            b1: [sceneData.b1.x, sceneData.b1.y, sceneData.b1.wid1th, sceneData.b1.height],
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
  // we do not want to show the picture in the stimulus container anymore, but in the grid
  // together with the answer_container
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

  answer_container_gen: function(config, CT) {
    const option1 = config.data[CT].optionLeft;
    const option2 = config.data[CT].optionRight;
    return `<div class='magpie-multi-slider-grid' id='target'>.
                <div id='utterance1' class='magpie-view-answer-container'>
                    <p class='magpie-view-question' id = 'question1' >${
                      config.data[CT].question1
                    }</p>
                    <span class='magpie-response-slider-option'>${option1}</span>
                    <input type='range' id='response1' name='answer1' class='magpie-response-slider' min='0' max='100' value='50'/>
                    <span class='magpie-response-slider-option'>${option2}</span>
                </div>
                <div  id='utterance2' class='magpie-view-answer-container  magpie-nodisplay'>
                    <p class='magpie-view-question' id = 'question2' >${
                      config.data[CT].question2
                    }</p>
                    <span class='magpie-response-slider-option'>${option1}</span>
                    <input type='range' id='response2' name='answer2' class='magpie-response-slider' min='0' max='100' value='50'/>
                    <span class='magpie-response-slider-option'>${option2}</span>
                </div>
                <div id='utterance3' class='magpie-view-answer-container magpie-nodisplay'>
                    <p class='magpie-view-question' id = 'question3' >${
                      config.data[CT].question3
                    }</p>
                    <span class='magpie-response-slider-option'>${option1}</span>
                    <input type='range' id='response3' name='answer3' class='magpie-response-slider' min='0' max='100' value='50'/>
                    <span class='magpie-response-slider-option'>${option2}</span>
                </div>
                <div id='utterance4' class='magpie-view-answer-container magpie-nodisplay'>
                    <p class='magpie-view-question' id = 'question4' >${
                      config.data[CT].question4
                    }</p>
                    <span class='magpie-response-slider-option'>${option1}</span>
                    <input type='range' id='response4' name='answer4' class='magpie-response-slider' min='0' max='100' value='50'/>
                    <span class='magpie-response-slider-option'>${option2}</span>
                </div>
          </div>
        </div>
        <button id='buttonNextUtterance' class='magpie-view-button grid-button'>Next utterance</button>
        <button id='nextScene' class='magpie-view-button orange-button grid-button magpie-nodisplay'>Next scene</button>`;
  },

  handle_response_function: function(
    config,
    CT,
    magpie,
    answer_container_generator,
    startingTime
  ) {
    let current_utterance = 0;
    $(".magpie-view").append(answer_container_generator(config, CT));
    // function for debugging - if "y" is pressed, the slider will change

    // TODO
    // if (magpie.deploy.deployMethod === "debug") {
      // let key2SelectAnswer = "y";
      // let answers_selected = [false, false, false, false];
      // document.addEventListener("keydown", event => {
      //   var keyName = event.key;
      //   if (!answers_selected[current_utterance] <= 2 && keyName === key2SelectAnswer) {
      //     automaticallySelectAnswer("response" + current_utterance);
      //     $("#buttonNextUtterance").removeClass("magpie-nodisplay");
      //     current_utterance += 1;
      //   } else if (current_utterance == 3 && keyName === key2SelectAnswer){
      //     automaticallySelectAnswer("response4");
      //     $("#nextScene").toggleClass("magpie-nodisplay");
      //     current_utterance += 1;
      //   }
      //   return keyName;
      // });
    // }
    // add data of scene
    let pic = config.data[CT].picture
    let trialID = pic.split("/")[4].split(".")[0]
    let sceneData = defineScene(id2TrialData[trialID]);
    let platforms = id2TrialData[trialID]["platform.type"] == "seesaw" ? ["seesaw", ""] :
      id2TrialData[trialID]["platform.type"] == "basic1" ? [[sceneData.p1.x, sceneData.p1.y, sceneData.p1.width, sceneData.p1.height], ""] :
      [[sceneData.p1.x, sceneData.p1.y, sceneData.p1.width, sceneData.p1.height],
       [sceneData.p2.x, sceneData.p2.y, sceneData.p2.width, sceneData.p2.height]];

    // check the sliders for all 4 utterance and handle what utterance
    // is shown and what button is shown
    // this is code without debut mode
    $("#response1").on("change", function() {
      $("#response1").addClass('replied');
      $("#buttonNextUtterance").removeClass("grid-button");
      current_utterance = 1;
    });

    $("#response2").on("change", function() {
      $("#response2").addClass('replied');
      $("#buttonNextUtterance").removeClass("grid-button");
      current_utterance = 2;
    });

    $("#response3").on("change", function() {
      $("#response3").addClass('replied');
      $("#buttonNextUtterance").removeClass("grid-button");
      current_utterance = 3;
    });

    $("#response4").on("change", function() {
      $("#response4").addClass('replied');
      $("#buttonNextUtterance").addClass("magpie-nodisplay");
      $('#nextScene').removeClass('magpie-nodisplay');
      $('#nextScene').removeClass('grid-button');
      current_utterance = 4;
    });

    $("#buttonNextUtterance").on("click", function() {
      // show next utterance and toggle next button again
      let next_utterance = current_utterance + 1;
      $('#utterance' + current_utterance).addClass('magpie-nodisplay')
      $('#utterance' + next_utterance ).removeClass('magpie-nodisplay')
      $("#buttonNextUtterance").addClass("grid-button");
    });

    $("#nextScene").on("click", function(){
      let RT = Date.now() - startingTime; // measure RT before anything else
      let trial_data = {
        trial_name: config.name,
        trial_number: CT + 1,
        response: [
          $("#response1").val(),
          $("#response2").val(),
          $("#response3").val(),
          $("#response4").val()
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
