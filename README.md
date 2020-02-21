# conditionals-blocksworld

This repository contains all data, results and analysis scripts for two experiments
we performed to get peoples' empirical ratings for the acceptability of certain
utterances, in particular conditionals, as informative descriptions of pictures
showing different arrangements of blocks in order to compare them with the
predictions of our computational model.

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
  - contains code, data, analysis scripts for Experiment2 (inside *blocksworld-main*)
  and Experiment1 (inside *blocksworld-prior*)
  - code for animations can be run independently of experiment
  (index.html inside *animation-physical-engine*, in 02_configuration.js set
    *MODE* to *train* or leave empty)

* stimuli
  - contains stimuli (identical for Experiment1 + Experiment2) and scripts used
  to create them
