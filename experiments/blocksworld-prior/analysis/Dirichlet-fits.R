library(tidyverse)
library(greta)

table_data <- read_csv("tables_experimental.csv") %>% 
  pivot_wider(names_from = "utterance", values_from = "response") %>% 
  arrange(stimulus_id)

epsilon <- 0.000001


get_optimal_alphas <- function(st_id) {
  y <- table_data %>% 
    filter(stimulus_id == st_id)
  y <- y[, 4:7] %>% 
    as.matrix()
  y <- prop.table(y + epsilon, 1)
  
  alpha <- uniform(0,20, 4)
  
  distribution(y) <- dirichlet(t(alpha), n_realisations = nrow(y))
  
  m <- model(alpha)
  
  fit_opt <- opt(m)
  
  tibble(
    stimulus_id = st_id,
    alpha_1 = fit_opt$par$alpha[1],
    alpha_2 = fit_opt$par$alpha[2],
    alpha_3 = fit_opt$par$alpha[3],
    alpha_4 = fit_opt$par$alpha[4],
    )
}

stimulus_id_list <- table_data %>% pull(stimulus_id) %>% unique()

results <- map_df(
  stimulus_id_list, 
  function(s) {
    get_optimal_alphas(st_id = s)  
  }
)

write_csv(results, "results.csv")


