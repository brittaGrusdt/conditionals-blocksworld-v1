library(tidyverse)

split_pic <- function(pic){
  parts <- str_split(pic, "/")[[1]]
  group <- parts[[2]]
  name <- parts[[3]]
  return(list(group=group, name=name))
}

get_stimulus_id <- function(pic){
  if(is.na(pic)){
    id <- NA
  } else {
    arr <- split_pic(pic)
    id <- str_split(arr$name, "\\.")[[1]][[1]]
  }
  return(id)
}

get_color_group <- function(pic){
  if(is.na(pic)){
    group <- NA
  } else  {
    arr <- split_pic(pic)
    group <- arr$group
  }
  return(group)
}

# @arg df: data frame containing columns ac, a
add_probs <- function(df){
  df <- df %>% mutate(p_a=ac+a, p_c=ac+c, p_na=1-p_a, p_nc=1-p_c) %>%
    mutate(p_c_given_a = if_else(p_a==0, 0, ac / p_a),
           p_c_given_na = if_else(p_na==0, 0, c / p_na),
           p_a_given_c = if_else(p_c==0, 0, ac / p_c),
           p_a_given_nc = if_else(p_nc==0, 0, a / p_nc),
           p_nc_given_a = 1 - p_c_given_a,
           p_nc_given_na = 1 - p_c_given_na,
           p_na_given_c = 1 - p_a_given_c,
           p_na_given_nc = 1 - p_a_given_nc,
           p_likely_a = p_a,
           p_likely_na=p_na,
           p_likely_c = p_c,
           p_likely_nc=p_nc
    ) 
  return(df)
}

preprocess_data <- function(path_to_file, N_test=25, N_train=4){
  # 0. Read the data
  print(paste('read data from:', path_to_file))
  data_all <- readr::read_csv(path_to_file, quote = '"')
  
  # 1. Select only columns relevant for data analysis
  df <- data_all %>% select(participant_id, RT, picture, response,
                            utterances, trial_name, trial_number, timeSpent,
                            comments, gender, age)
  # discard my test trials 
  df <- df %>% filter(!str_detect(participant_id, "bg-.*"))
  N_participants <- df %>% select(participant_id) %>% unique() %>% nrow()
  
  # throw error if remaining data is not equal to nb of gathered participants
  stopifnot(nrow(df) == N_participants * (N_test + N_train));
  
  # 2. Processing columns
  # response/utterances/RT into useful string, then separate into different cols
  df <- df %>% mutate(response = str_replace_all(response, "\\|", "-"),
                      utterances = str_replace_all(utterances, "\\|", "-"),
                      RT = str_replace_all(RT, "\\|", "-"))
  
  df <- df %>%
    separate(response, into=c("response1", "response2", "response3",
                              "response4"), sep="-") %>% 
    separate(utterances, into = c("utt1", "utt2", "utt3", "utt4"), sep="-") %>% 
    separate(RT, into = c("RT1", "RT2", "RT3", "RT4"), sep="-")
  # TODO: in train trials, RT seems to be recorded only once
  
  # picture -> color_group + stimulus_id
  df <- df %>% rowwise() %>%  mutate(stimulus_id=get_stimulus_id(picture),
                                     color_group=get_color_group(picture)) %>%
    select(-picture)
  
  # 3. Make data tidy
  df <- df %>% pivot_longer(cols=c(contains("utt")), names_to = "utt_idx",
                            names_prefix="utt", values_to = "utterance")
  
  df <- df %>% mutate(response = case_when(utt_idx == 1 ~ response1,
                                           utt_idx == 2 ~ response2, 
                                           utt_idx == 3 ~ response3, 
                                           utt_idx == 4 ~ response4),
                      RT = case_when(utt_idx == 1 ~ RT1,
                                           utt_idx == 2 ~ RT2, 
                                           utt_idx == 3 ~ RT3, 
                                           utt_idx == 4 ~ RT4)) %>%
    select(-response1, -response2, -response3, -response4, 
           -RT1, -RT2, -RT3, -RT4) %>% group_by(participant_id)
  
  # 4. Make sure columns have the right type
  data <- df %>% ungroup() %>%
    mutate(response = as.numeric(response),
           RT = as.numeric(RT),
           comments = if_else(is.na(comments), "", comments),
           participant_id = factor(participant_id),
           stimulus_id = factor(stimulus_id),
           gender = factor(gender)) %>% 
    group_by(participant_id)
  
  return(data)
}

prepare_tables <- function(tables, N_test = 25){
  tables_wide <- tables %>%
    group_by(stimulus_id, participant_id) %>%
    pivot_wider(names_from = utterance, values_from = response) %>%
    mutate(none=sprintf("%3f", none), ac=sprintf("%3f", ac),
           a=sprintf("%3f", a), c=sprintf("%3f", c)) %>% 
    select(-n) %>% 
    mutate(none=floor(as.numeric(none)*1000)/1000,
           ac=floor(as.numeric(ac) * 1000)/1000,
           a=floor(as.numeric(a)*1000)/1000,
           c=floor(as.numeric(c)*1000)/1000) %>% 
    distinct()
  
  tables_to_wppl <- tables_wide %>%
    add_column(vs=list(c("AC", "A-C", "-AC", "-A-C"))) %>%
    group_by(stimulus_id, participant_id) %>%
    mutate(ps=list(c(ac, a, c, none))) %>% 
    ungroup() %>%
    select(participant_id, stimulus_id, ps, vs)
  
  return(tables_to_wppl)
}

save_predictions <- function(predictions, target_dir, target_name,
                             append_to_file=FALSE){
  fn <- paste(target_dir, target_name, sep=.Platform$file.sep)
  write.table(predictions, file = fn, row.names=FALSE, sep = ",",
              append = append_to_file, col.names=!file.exists(fn))
}

save_params <- function(par, target_dir, i_run=1, mse=NA, append_to_file=FALSE){
  data <- tibble(alpha=par$alpha,
                 theta=par$theta,
                 cost_conditional=par$cost_conditional,
                 cost_and=par$cost_and,
                 cost_likely=par$cost_likely,
                 cost_neg=par$cost_neg,
                 MSE=mse,
                 run=i_run,
                 )
  fn <- paste(target_dir, "parameters.csv", sep=.Platform$file.sep)
  write.table(data, file=fn, row.names=FALSE, sep = ",", append=append_to_file,
              col.names=!file.exists(fn))
}

save_raw_without_prolific_id <- function(target_dir, target_fn, exp_name){
  fn <- paste(target_dir, target_fn, sep=.Platform$file.sep)
  dat.experiment <- read_csv(fn) %>% 
    filter(!str_detect(prolific_id, "bg-.*"))
  prolific_ids <- dat.experiment %>% 
    pull(prolific_id) %>% 
    unique()
  N <- length(prolific_ids)
  new_ids <- paste("participant", seq(1, N), sep="")
  
  dat.anonymized <- dat.experiment %>%
    add_column(participant_id = rep(new_ids, each = 25 + 4)) %>% 
    select(-prolific_id)
  
  save_to <- paste(target_dir, .Platform$file.sep, "results_anonymized_",
                   exp_name, ".csv", sep="")
  write_excel_csv(dat.anonymized, path = save_to, delim = ",", append = FALSE, col_names=TRUE)
}

