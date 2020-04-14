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

// For most tasks, you need instructions views
const instructions = magpieViews.view_generator("instructions", {
  trials: 1,
  name: "instructions",
  title: "General Instructions",
  text: `In this experiment you are shown pictures of different arrangements of blocks.
          <br/>
          <br/>
         For each presented scenario you will be asked to estimate the likelihood that certain blocks fall/don't fall.
         A block is considered to <b><i>fall</i></b> <b>as soon as it <i>topples over</i>.</b>
         <br/>
         The colored blocks represent common toy blocks, they do not have any special properties and they are only distinguishable by their color.
         <br/>
         <br/>
         For each scenario you will be asked to give four estimates. You will only be able to proceed to the next scenario after you have given all four estimates by moving the sliders. The circles of the sliders will turn green after you have moved them. If you cannot proceed to the next scenario, make sure that the circles of all sliders have turned green.
               <br />
               <br />
         You may wonder whether the probabilities that you assign to the four events must sum up to 1. In this respect, note that we are interested in how you rate the four events relative to each other. This means that they may, but <b>don't have to sum to 1</b>.
             <br />
             <br />
         There are 24 scenarios in total. The experiment will take you about
         15-20 minutes.
         Before you are presented with the main <b>24</b> scenarios, you will be shown
         <b>8</b> animated training examples to get familiar with the stimuli.
         When you click on the RUN button, the animation will start. By clicking
         on the NEXT SCENE button, you will get to the next training example.
         In the last training example, you will only be able to run the animation
         after you have estimated the likelihood of the events described below the scene
         by moving the sliders.
         Throughout the experiment, you may want to go into Full Screen Mode
         (usually switched on/off with F11), otherwise you may need to
         scroll down to see the buttons.`,
  buttonText: "START TRAINING"
});


const instructions1 = magpieViews.view_generator("instructions", {
  trials: 1,
  name: "instructions1",
  title: "General Instructions",
  text: `Great! You've completed the training phase. We will move on to the
          main part of the experiment next.
          Now, you will see static pictures without the possiblity to run an
          animation.
          You will be asked to estimate the <b>likelihood that certain blocks fall/don't fall</b>.
            <br />
            <br />
          Please keep in mind:
            <br/>
          A block is considered to <i>fall</i> as soon as it <i>topples over</i> - this means it does not necessarily have to fall to the ground.
          <br/>
          The probabilities that you assign to the four events do <i>not have to sum up to 1</i>.
            </br>
          The colored blocks all have <i>the same properties</i>, they are only distinguishable by their color.
            </br>
            </br>
          We will now start the experiment. There are 24 scenarios in total and the experiment will take you about 15-20 minutes.
   <br />
   `,
    buttonText: "start experiment"
});


// In the post test questionnaire you can ask your participants addtional questions
const post_test = magpieViews.view_generator("post_test", {
  trials: 1,
  name: "post_test",
  title: "Additional information",
  text: "Answering the following questions is optional, but your answers will help us analyze our results."

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
  // comments_question: 'Weitere Kommentare'
});

// The 'thanks' view is crucial; never delete it; it submits the results!
const thanks = magpieViews.view_generator("thanks", {
  trials: 1,
  name: "thanks",
  title: "Thank you very much for taking part in this experiment!",
  prolificConfirmText: "Press the button"
});

// experimental phase trials
const multiple_slider = magpieViews.view_generator(
  "slider_rating", {
    // This will use all trials specified in `data`, you can use a smaller value
    // (for testing), but not a larger value
    trials: slider_rating_trials.length,
    // trials: 2,
    // name should be identical to the variable name
    name: "multiple_slider",
    data: _.shuffle(slider_rating_trials)
  },
  // you can add custom functions at different stages through a view's life cycle
  {
    stimulus_container_generator: multi_slider_generator.stimulus_container_gen,
    answer_container_generator: multi_slider_generator.answer_container_gen,
    handle_response_function: multi_slider_generator.handle_response_function
  }
);
