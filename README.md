# conditionals-blocksworld

This is the very first version of our later experiment ([see this repository](https://github.com/brittaGrusdt/communicating-uncertain-beliefs-conditionals)), which we only used to develop the block-arrangement stimuli.

This repository contains all data, results and analysis scripts for two experiments (in later experiment this became a single experiment with two tasks) we performed to get peoples' empirical ratings for the acceptability of certain utterances, in particular conditionals, as informative descriptions of pictures showing different arrangements of blocks in order to compare them with the predictions of our computational model.

## software

This experiment was built using [\_magpie](https://magpie-ea.github.io/magpie-site/index.html)
and [matter-js](https://brm.io/matter-js/docs/).


## Project structure

```
|--experiments/
|    |--blocksworld-main/
|    |   |--analysis/
|    |   |--animation-physical-engine/
|    |   |--node_modules/
|    |   |--results/
|    |   |   
|    |--blocksworld-prior/
|    |   |--analysis/
|    |   |--animation-physical-engine/
|    |   |--node_modules/
|    |   |--results/
|    |   |
|    |--stimuli/
|    |   |--images/
```

* experiments/
  - contains code, data, analysis scripts for both experiments
  - code for animations can be run independently of experiment
  (index.html inside *animation-physical-engine*, in 02_configuration.js set
    *MODE* to *train* or leave empty)
  - /**blocksworld-prior**/
  (Experiment1) measures participants' intuitions for the likelihood of two joint events (*The green block will (not) touch the ground. The blue block will (not) touch the ground.*)
  - /**blocksworld-main**/
  (Experiment2) measures how acceptable participants find certain utterances as informative descriptions of pictures showing different arrangements of blocks. We used literal utterances and conditionals: *The blue/green block will touch the ground*, *If the green/blue block touches the ground, the blue/green block will also touch the ground*.

* stimuli
  - contains stimuli (identical for Experiment1 + Experiment2) and scripts used
  to create them
