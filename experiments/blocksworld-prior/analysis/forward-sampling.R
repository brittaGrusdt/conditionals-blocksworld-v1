library(here)
library(tidyverse)
library(truncnorm)

N = 10
sigma = 1
scenes <- read_csv(here("experiments", "blocksworld-prior", "analysis", "sceneData.csv")) %>%
  group_by(stimulus)

ids <- scenes %>% pull(stimulus) %>% unique()

wiggle <- function(block, base, N, sigma){
  max <- base$before_x + base$width / 2 + block$width / 2;
  min <- base$before_x - base$width / 2 - block$width / 2;
  return(rtruncnorm(N, a=min, b=max, mean = block$before_x, sd=sigma))
}

new_data <- tibble()
for (i in seq(1, length(ids))) {
  data <- scenes %>% filter(stimulus == ids[i])
  block1 <- data %>% filter(id=="block1")
  block2 <- data %>% filter(id=="block2")
  
  pos <- data$position %>% unique()
  obj_ids <- data %>% pull("id") %>% unique()
  if(pos == "-1") {
    # on two separate platforms
    x_block1 <- wiggle(block1, data %>% filter(id=="platform1"), N, sigma)
    x_block2 <- wiggle(block2, data %>% filter(id=="platform2"), N, sigma)
  } else {
    if("platform1" %in% obj_ids){
      platform <- data %>% filter(id=="platform1")
    } else {
      platform <- data %>% filter(id=="seesawPlank")
    }
    if(pos == "stack_C_on_A"){
      x_block1 <- wiggle(block1, platform, N, sigma)
      x_block2 <- wiggle(block2, block1, N, sigma)
    } else if(pos == "stack_A_on_C") {
      x_block1 <- wiggle(block1, block2, N, sigma)
      x_block2 <- wiggle(block2, platform, N, sigma)
    } else if(pos == "side"){
      x_block1 <- wiggle(block1, platform, N, sigma)
      x_block2 <- wiggle(block2, platform, N, sigma)
    }
  }
  data <- data %>% mutate(wiggles = case_when(id=="block1" ~ list(x_block1),
                                              id=="block2" ~ list(x_block2),
                                              TRUE ~ list(NA_real_))) %>% 
          unnest(wiggles)
  new_data <- bind_rows(new_data, data)
}

fn <- here("experiments", "blocksworld-prior", "analysis", "wiggles.csv")
write.table(new_data , file = fn, sep = ",", row.names=FALSE)


