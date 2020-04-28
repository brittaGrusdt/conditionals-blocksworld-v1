// In this file you can instantiate your views
// We here first instantiate wrapping views, then the trial views

/** Wrapping views below

* Obligatory properties

    * trials: int - the number of trials this view will appear
    * name: string

*Optional properties
    * buttonText: string - the text on the button (default: 'next')
    * text: string - the text to be displayed in this view
    * title: string - the title of this view

    * More about the properties and functions of the wrapping views - https://magpie-ea.github.io/magpie-docs/01_designing_experiments/01_template_views/#wrapping-views

*/

// Every experiment should start with an intro view. Here you can welcome your participants and tell them what the experiment is about
const intro = magpieViews.view_generator("intro", {
  trials: 1,
  name: "intro",
  // If you use JavaScripts Template String `I am a Template String`, you can use HTML <></> and javascript ${} inside
  text: `Thank you for your participation in our study!
         Your anonymous data makes an important contribution to our understanding of human language use.
          <br />
          <br />
          Legal information:
          By answering the following questions, you are participating in a study
          being performed by scientists from the University of Osnabrueck.
          <br />
          <br />
          You must be at least 18 years old to participate.
          <br />
          <br />
          Your participation in this research is voluntary.
          You may decline to answer any or all of the following questions.
          You may decline further participation, at any time, without adverse consequences.
          <br />
          <br />
          Your anonymity is assured; the researchers who have requested your
          participation will not receive any personal information about you.
          `,
  buttonText: "begin the experiment"
});

const instructions_train1_colors = magpieViews.view_generator("instructions", {
  trials: 1,
  name: "instructions_train1_colors",
  title: "General Instructions",
  text: `In this experiment you are shown pictures of different arrangements of
          blocks.
         <br />
         <br />
         The experiment consists of two phases, a training and a testing phase.
         In total, you will need about 15-20 minutes to finish it.
         <br/>
         <br />
         The training phase comprises three short parts. We will now start with the
         first, in which you are shown four pictures containing toy
         blocks. Please answer the question shown below the pictures by clicking on
         the respective button.
         <br />
         <br/>
         Please note:
         <br/>
         Throughout the experiment, you may want to go into Full Screen Mode
         (usually switched on/off with F11), otherwise you may need to
         scroll down to see all buttons.`,
  buttonText: "START"
});

// We will start with the first part of the training phase which consists
// of 8 trials. You will see block arrangements similar to those you will
// be shown later in the test phase, such that you are able to develop
// intuitions about the physical properties and get familiar with the
// stimuli.`,


// For most tasks, you need instructions views
const instructions_train2 = magpieViews.view_generator("instructions", {
  trials: 1,
  name: "instructions_train2",
  title: "Instructions Training 2",
  text: `Great - we will now continue with the second part of the training phase
          which consists of 8 trials. You will see block arrangements similar
          to those you will be shown later in the test phase, such that you are
          able to develop intuitions about the physical properties and get
          familiar with the stimuli.
          <br/>
          <br/>
        For each presented scene you will be asked to indicate which of the
         colored blocks you think will fall by clicking on the button with the
         respective icons.
         A falling block is represented by a skewed rectangle
        and a resting block that <i>does not fall</i> is represented by a rectangle
        with a line below. Here is an exemplary icon for the event
        <br/>
        <i>The <b>green</b> block <b>falls</b>, but the <b>yellow</b> block
        <b>does not fall</b></i>:
        <br/>
        <br/>
        <img src='stimuli/img/icons/green.jpg'/>
        <img src='stimuli/img/icons/not-yellow.jpg' />
         <br/>
         <br/>
         A block is considered to <b><i>fall</i></b> <b>as soon as it <i>topples
         over</i> or <i>drops</i> from a platform.</b>
         <br/>
         The colored blocks represent common toy blocks, they do not have any
         special properties and they are only distinguishable by their color.
             <br />
             <br />
         After you selected one of the four buttons (whose border will turn green),
         you may click on RUN to see what actually happens. If you were wrong,
         the selected button will turn red and the correct one will turn light
         green.
         Then, you can proceed to the next trial.`,
  buttonText: "CONTINUE"
});

const instructions_train3 = magpieViews.view_generator("instructions", {
  trials: 1,
  name: "instructions_train3",
  title: "Instructions Training 3",
  text: `Great - we will now proceed with the last part of the training phase
  consisting of a single trial.
    <br />
  In this trial, we ask you to indicate <b>how likely</b> you think certain
  blocks <b>will or will not fall</b> by moving the corresponding sliders.
    <br />
    <br />
  You may wonder whether the probabilities that you assign to the four described
  events must sum up to 100%. In this respect, note that we are interested in how
  you rate the four events relative to each other. This means that <b>your
  estimates may, but don't have to sum to 100%</b>.
    <br />
    <br />
  After you have provided all four estimates, you will be able to run the
  animation and after that, proceed to the test phase of the experiment.
  `
});

const instructions_test = magpieViews.view_generator("instructions", {
  trials: 1,
  name: "instructions_test",
  title: "Instructions Test Phase",
  text: `Great - you've now completed the training phase and we'll continue with
          the test phase next. Again, you will be shown scenes of different block
          arrangements. As in the previous trial, we will ask you to
          indicate how likely you think certain blocks will fall / not fall.
          <br />
          The only difference is, that now you will <i>not</i> get
          feedback about what will actually happen since you will be shown
          static pictures only.
            <br />
            <br />
          Please keep in mind:
            <br/>
          1. A block is considered to <b><i>fall</i> as soon as it drops from a
          platform or topples over</b> - that is, a block does not necessarily
          need to fall to the ground in order to count as <i>falling</i>.
          <br/>
          2. The probabilities that you assign to the four events do <b>not have to
          sum up to 100%</b>.
            </br>
          3. The colored blocks all have <b>the same properties</b>, they are only
          distinguishable by their color.
            </br>
            </br>
          We will now start the experiment. There are <b>18</b> scenes in total.`,
  buttonText: "start experiment"
});


// In the post test questionnaire you can ask your participants addtional questions
const post_test = magpieViews.view_generator("post_test", {
  trials: 1,
  name: "post_test",
  title: "Additional information",
  text: "Answering the following questions is optional, but your answers will help us analyze our results.",

  // You can change much of what appears here, e.g., to present it in a different language, as follows:
  // buttonText: 'Weiter',
  // age_question: 'Alter',
  // gender_question: 'Geschlecht',
  // gender_male: 'männlich',
  // gender_female: 'weiblich',
  // gender_other: 'divers',
  // edu_question: 'Höchster Bildungsabschluss',
  // edu_graduated_high_school: 'Abitur',
  // edu_graduated_college: 'Hochschulabschluss',
  // edu_higher_degree: 'Universitärer Abschluss',
  // languages_question: 'Muttersprache',
  // languages_more: '(in der Regel die Sprache, die Sie als Kind zu Hause gesprochen haben)',
  comments_question: 'Further comments <br/><small>(was there anything about the different stimuli you realized in particular?)</small>'
});

// The 'thanks' view is crucial; never delete it; it submits the results!
const thanks = magpieViews.view_generator("thanks", {
  trials: 1,
  name: "thanks",
  title: "Thank you very much for taking part in this experiment!",
  prolificConfirmText: "Press the button"
});

const forced_choice_custom = magpieViews.view_generator("forced_choice", {
  trials: color_vision_test.length,
  name: "color-vision",
  data: _.shuffle(color_vision_test)
}, {
  stimulus_container_generator: function (config, CT) {
    return `<div class='magpie-view'>
    <h1 class='magpie-view-title'>${config.title}</h1>
    <p class='magpie-view-question magpie-view-qud'>${config.data[CT].QUD}</p>
                        <div class='magpie-view-stimulus-container'>
                          <img src="${config.data[CT].picture1}" class = "img" >
                          <img src="${config.data[CT].picture2}" class = "img">
                        </div>
                      </div>`;
  }
});

// experimental phase trials
const multiple_slider = magpieViews.view_generator(
  "slider_rating", {
    // This will use all trials specified in `data`, you can use a smaller value
    // (for testing), but not a larger value
    trials: TEST_TRIALS.length,
    // trials: 6,
    // name should be identical to the variable name
    name: "multiple_slider",
    data: TEST_TRIALS
  },
  // you can add custom functions at different stages through a view's life cycle
  {
    stimulus_container_generator: multi_slider_generator.stimulus_container_gen,
    answer_container_generator: multi_slider_generator.answer_container_gen,
    handle_response_function: multi_slider_generator.handle_response_function
  }
);
