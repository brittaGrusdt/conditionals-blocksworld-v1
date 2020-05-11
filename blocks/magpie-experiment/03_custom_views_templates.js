// In this file you can create your own custom view templates

// A view template is a function that returns a view,
// this functions gets some config (e.g. trial_data, name, etc.) information as input
// A view is an object, that has a name, CT (the counter of how many times this view occurred in the experiment),
// trials the maximum number of times this view is repeated
// and a render function, the render function gets CT and the magpie-object as input
// and has to call magpie.findNextView() eventually to proceed to the next view (or the next trial in this view),
// if it is an trial view it also makes sense to call magpie.trial_data.push(trial_data) to save the trial information
const animation_view1 = {
  name: "animation",
  title: "title",
  CT: 0, //is this the start value?
  trials: NB_TRAIN_TRIALS - 1,
  data: "",
  // The render function gets the magpie object as well as the current trial
  // in view counter as input
  render: function (CT, magpie) {
    let html_answers = htmlButtonAnswers();
    let animation = showAnimationInTrial(CT, html_answers);

    let cleared = false;
    Events.on(animation.engine, 'afterUpdate', function (event) {
      if (!cleared && animation.engine.timing.timestamp >= DURATION_ANIMATION) {
        clearWorld(animation.engine, animation.render, stop2Render = false);
        cleared = true;
      }
    });
      ['ac', 'a', 'c', 'none'].forEach(function (key) {
      toggleSelected(key);
    });

    let animationStarted = false;
    $('#runButton')
      .on('click', function (e) {
        if (!animationStarted) {
          animationStarted = true;
          runAnimation(animation.engine);
          toggleNextIfDone($("#buttonNextAnimation"), true);
          //selected answers can't be changed anymore
          $(".selected")
            .off("click");
          $(".unselected")
            .off("click");
        }
      });

    $("#buttonNextAnimation")
      .on("click", function () {
        const RT = Date.now() - animation.startTime; // measure RT before anything else
        if (!cleared) {
          clearWorld(animation.engine, animation.render, stop2Render = false);
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

const animation_view2 = {
  name: "animation",
  title: "title",
  CT: NB_TRAIN_TRIALS - 1, //is this the start value?
  trials: 1,
  data: "",
  // The render function gets the magpie object as well as the current trial
  // in view counter as input
  render: function (CT, magpie) {
    let html_answers = htmlSliderAnswers(TRAIN_TRIALS[CT])
    let animation = showAnimationInTrial(CT, html_answers, progress_bar = false);

    let cleared = false;
    Events.on(animation.engine, 'afterUpdate', function (event) {
      if (!cleared && animation.engine.timing.timestamp >= DURATION_ANIMATION) {
        clearWorld(animation.engine, animation.render, stop2Render = false);
        cleared = true;
      }
    });
    addCheckSliderResponse($('#runButton'));
    DEBUG ? addKeyToMoveSliders($("#runButton")) : null;

    let animationStarted = false;
    $('#runButton')
      .on('click', function (e) {
        if (!animationStarted) {
          animationStarted = true;
          runAnimation(animation.engine);
          toggleNextIfDone($("#buttonNextAnimation"), true);
          //selected answers can't be changed anymore
          _.range(1, 5)
            .forEach(function (i) {
              document.getElementById("response" + i)
                .disabled = true;
            });
        }
      });

    $("#buttonNextAnimation")
      .on("click", function () {
        const RT = Date.now() - startTime; // measure RT before anything else
        clearWorld(engine, render, stop2Render = false);
        // let data = saveTrialQA();
        // let utterances = [];
        // let utteranceIDs = ["question1", "question2", "question3", "question4"];
        // utteranceIDs.forEach(function(qid){
        //   let q = $("#"+qid).html();
        //   let abbreviation = question2ID[q]
        //   utterances.push(abbreviation)
        // });
        let trial_data = {
          trial_name: TrainStimuli.list_all[CT].id,
          trial_number: CT + 1,
          response: [],
          utterances: [],
          // response: data.responses,
          // utterances: data.questions,
          RT: RT
        };
        trial_data = magpieUtils.view.save_config_trial_data({},
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
    $(".magpie-view")
      .append(answer_container_generator(config, CT));
    let button = $("#buttonNext");
    // function for debugging - if "y" is pressed, the slider will change
    if (DEBUG) {
      addKeyToMoveSliders(button);
      console.log(config.data[CT].id)
    }
    addCheckSliderResponse(button);
    button.on("click", function () {
      const RT = Date.now() - startingTime; // measure RT before anything else
      let responseData = saveTrialQA();
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

// generate a new fridge view
const fridge_generator = {
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

    function return_word_array(array, color) {
      return array.map((word, index) => {
          return (
            `<div class="word ` + color + `" id=word` + index + ` >
            <p> ` +
            word +
            ` </p>
          </div>`
          ); + `</div> `
        })
        .join('')
    }
    let wordArray1 = ["maybe", "likely", "probably", "only", "rather"]
    let wordArray2 = ["not", "neither", "nor", "no", "won't", "but"]
    let wordArray3 = ["if", "and", "or", "to", "due to", "because of", "the"]
    let wordArray4 = ["block", "blocks", "green", "blue", "red", "yellow", "both"]
    let wordArray5 = ["fall", "falls", "will", "cause", "causes", "make", "makes", "do", "does"]

    return `<div class = "fix-box"> <div class="fridge">` + return_word_array(wordArray1, "magpie-view-button green") +
      return_word_array(wordArray2, "red") + return_word_array(wordArray3, "blue") + return_word_array(wordArray4, "purple") +
      return_word_array(wordArray5, "orange") +
      `</div>
      <br><br/>
      <div class ="sentence selected1" style = "font-size: 20px"> Your sentence:  <span class = "selected-words"> ${config.data[CT].sentence} </span>
      </div> <button id='buttonDelete' class='magpie-view-button delete-word'> delete last word </button> <button id ='customWords' class="magpie-view-button custom-words"> ? </button>
      <br><br/>
      <br><br/>
      <button id='buttonSubmit' class='magpie-view-button grid-button submit-sentence '> submit sentence</button>
      <br><br/>
      <div class = "magpie-nodisplay custom-sentence sentence" style = "font-size: 20px"> Your custom sentence:
        <textarea name='textbox-input' cols = 50 class='magpie-response-text selected-words' />
      </div>
      <br><br/>
      <br><br/>
      <br><br/>
      <br><br/>
      <span>
      <button id='buttonMore' class='magpie-view-button grid-button'>Build another sentence </button>
      <button id='buttonNext' class='magpie-view-button grid-button'>Next scenario</button>
      </span>
      <br><br/>

    </div>`;
  },

  handle_response_function: function (
    config,
    CT,
    magpie,
    answer_container_generator,
    startingTime
  ) {
    $(".magpie-view")
      .append(answer_container_generator(config, CT));
    let button = $("#buttonNext");
    let submitbutton = $("#buttonSubmit");

    let sentence_array = [];
    let custom_sentence_array = [];

    // each word which is pressed is saved in an array to build the sentence
    $(".word")
      .click(function () {
        var value = $(this)
          .text()
          .replace(/(\r\n|\n|\r)/gm, "")
          .trim();
        sentence_array.push(value)

        $(".selected-words")
          .append(" " + value)
        console.log(config.data[CT].sentence);
        var sentence = sentence_array.toString()
          .replace(/,/, "");
        console.log(sentence.replace(/,/, ""));
        //check if sentence is submitted, next scenario and build another sentence are free to press
        _checkBuildSentence(sentence_array, submitbutton)
      });

    $(".delete-word")
      .click(function () {
        console.log("test delete");
        // sentence_array = [];
        // sentence_array.push("");
        console.log(sentence_array);
        sentence_array.pop();
        console.log(sentence_array);
        //sentence = "";

        var sentence = sentence_array.join(" ")
        // toString()
        //   .replace(/,/, " ");
        console.log(sentence);

        $(".selected-words")
          .empty();

        $(".selected-words")
          .append(sentence);


        config.data[CT].sentence = sentence;
        console.log(config.data[CT].sentence);
        _checkBuildSentence(sentence_array, submitbutton);



      });


    $("#customWords")
      .on("click", function () {
        console.log("komme ich in customWords an?");
        $(".custom-sentence")
          .removeClass("magpie-nodisplay");
        $(".selected1")
          .addClass("magpie-nodisplay");
        $(".delete-word")
          .addClass("magpie-nodisplay");

        let next;
        let textInput;
        const minChars = config.data[CT].min_chars === undefined ? 10 : config.data[CT].min_chars;


        //next = $("#next");
        textInput = $("textarea");

        // attaches an event listener to the textbox input
        textInput.on("keyup", function () {
          // if the text is longer than (in this case) 10 characters without the spaces
          // the 'next' button appears
          if (textInput.val()
            .trim()
            .length > minChars) {
            submitbutton.removeClass("grid-button");
          } else {
            submitbutton.addClass("grid-button");
          }
        });

      });

    //_checkBuildSentence(custom_sentence_array, submitbutton);

    // let next;
    // let textInput;
    // const minChars = config.data[CT].min_chars === undefined ? 10 : config.data[CT].min_chars;
    //
    // $(".magpie-view")
    //   .append(answer_container_generator(config, CT));
    //
    // next = $("#next");
    // textInput = $("textarea");
    //
    // // attaches an event listener to the textbox input
    // textInput.on("keyup", function () {
    //   // if the text is longer than (in this case) 10 characters without the spaces
    //   // the 'next' button appears
    //   if (textInput.val()
    //     .trim()
    //     .length > minChars) {
    //     next.removeClass("magpie-nodisplay");
    //   } else {
    //     next.addClass("magpie-nodisplay");
    //   }
    // });
    //

    // function for debugging - if "y" is pressed, the slider will change
    // if (magpie.deploy.deployMethod === "debug") {
    //   addShortCut2SelectAnswers(sentence, button);
    // }

    //addCheckResponseFunctionality(button);

    submitbutton.on("click", function () {
      toggleNextIfDone($("#buttonMore"), true);
      toggleNextIfDone($("#buttonNext"), true);
    });


    button.on("click", function () {
      const RT = Date.now() - startingTime; // measure RT before anything else
      // let responseData = saveTrialQA();
      let trial_data = {
        trial_name: config.name,
        trial_number: CT + 1,
        //response: textInput.val().trim(),
        // response: responseData.responses,
        // utterances: responseData.questions,
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
