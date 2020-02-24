library(rwebppl)

probs2utterances <- list(p_ac="C and A", p_anc="-C and A",
                         p_nac="C and -A", p_nanc="-C and -A",
                         p_na="-A", p_nc="-C", p_a="A", p_c="C",
                         p_c_given_a="A > C", p_a_given_c="C > A", 
                         p_nc_given_na="-A > -C", p_na_given_nc="-C > -A",
                         p_nc_given_a="A > -C", p_a_given_nc="-C > A",
                         p_c_given_na="-A > C", p_na_given_c="C > -A", 
                         p_likely_a="likely A", p_likely_na="likely -A",
                         p_likely_c="likely C", p_likely_nc="likely -C"
)
all_utterances <- probs2utterances[rep(TRUE, length(probs2utterances))] %>%
  unname() %>% as.character()

# for each utterance there must be at least one state!
# choose random states from any participant, or use as many of pid when given
# as possible
pids_to_cover_utts <- function(dat.experimental, theta, pid=NA){
  
  tables_enriched <- dat.experimental %>%
    pivot_wider(names_from = utterance, values_from = response) %>% 
    select(-n) %>% add_probs() %>% 
    rename(p_ac=ac, p_anc=a, p_nac=c, p_nanc=none) %>% 
    rowid_to_column()
  
  tables_shuffled <- tables_enriched %>%
    pivot_longer(cols=starts_with("p_"), names_to = "key", values_to = "p") %>% 
    mutate(lit.true=case_when(str_detect(key, "p_likely_.*") & p>=0.5 ~ TRUE,
                              str_detect(key, "p_likely_.*") ~ FALSE,
                              p>=theta ~ TRUE, TRUE ~ FALSE)) %>% 
    filter(lit.true)
  
  ids_shuffled <- tables_shuffled %>% select(rowid, participant_id, stimulus_id, key) %>% ungroup() %>% 
    slice(sample(1:n()))
  
  if(!is.na(pid)){
    tables_shuffled <- tables_shuffled %>%
      mutate(rank=case_when(id_prolific == pid ~ 0,
                            TRUE ~ 1)) %>% 
      arrange(rank) %>% select(-rank)
  }
  covered_probs <- ids_shuffled %>% distinct(key) %>% pull(key)
  
  is_covered <- names(probs2utterances) %in% covered_probs
  not_covered <- probs2utterances[which(!is_covered)] %>% unname() %>% as.character()
  covered <- probs2utterances[which(is_covered)] %>% unname() %>% as.character()
  
  ids <- ids_shuffled %>% 
    distinct(key, .keep_all = TRUE) %>% 
    select(-key, -rowid) 
  
  result <- list(utts_covered_by=ids, utts_not_covered=not_covered,
                 utts_covered=covered)
  
  return(result)
}

rsa_dirichlet_prior <- '
var par_dirichlet = dataFromR["par_dirichlet"]
let alpha1 = _.map(par_dirichlet, "alpha_1")
let alpha2 = _.map(par_dirichlet, "alpha_2")
let alpha3 = _.map(par_dirichlet, "alpha_3")
let alpha4 = _.map(par_dirichlet, "alpha_4")
let stimuli = _.map(par_dirichlet, "stimulus_id")
let alphas = _.zip(alpha1, alpha2, alpha3, alpha4)

var state_prior = cache(function(){
  return Infer({model:function(){
    var idx = sample(RandomInteger({n: alphas.length}))
    var params = alphas[idx]
    var stimulus = stimuli[idx]
    var table = dirichlet({alpha: Vector(params)})
    var p = Categorical({"vs": ["AC", "A-C", "-AC", "-A-C"], "ps": table})
    var state = {"table": p,
                 "pid": "",
                 "id": stimulus}
    return {"bn": state}
  }})
})
'

rsa_empirical_prior <- '
var tables_list = dataFromR["tables"]
var Tables = map(function(obj){
  var p = Categorical({"vs": obj["vs"], "ps": obj["ps"]})
  return {"id": obj["stimulus_id"], "Table": p, "pid": obj["participant_id"]}
  }, tables_list)
  
var state_prior = cache(function(){
  return Infer({model:function(){
    var TableID = uniformDraw(Tables)
    var state = {"table": TableID.Table,
                 "pid": TableID.pid,
                 "id": TableID.id}
    return {"bn": state}
  }})
  // make sure that states that have almost 0-probability are excldued,
  // otherwise these states face a problem for the speaker who cannot say
  // anything because the log of the literal listener will always be -Infinity
  //return Infer({model:function(){
  //  var s = sample(distr)
  //  condition(Math.exp(distr.score(s)) > 0.0000011)
  //  return s
  // }})
})
'

get_full_rsa <- function(prior=""){
  
  if(prior == "dirichlet"){
    print('use dirichlet prior')
    prior_wppl <- rsa_dirichlet_prior
  } else {
    prior_wppl <- rsa_empirical_prior
  }
  model <- paste(prior_wppl, '
var theta_likely = 0.499
//var utterances = dataFromR["utterances"]
var utterances = ["-A" ,"A", "-C", "C",
"-C and -A", "-C and A", "C and -A", "C and A",
"likely -A", "likely A", "likely -C", "likely C",
"A > -C", "-C > A", "-A > C", "C > -A",
"A > C", "C > A", "-A > -C", "-C > -A"]

// model parameters
var rsa_alpha = dataFromR["alpha"][0]
var rsa_theta = dataFromR["theta"][0]

var rsa_cost_conditional = dataFromR["cost_conditional"][0]
var rsa_cost_and = dataFromR["cost_and"][0]
var rsa_cost_neg = dataFromR["cost_neg"][0]
var rsa_cost_likely = dataFromR["cost_likely"][0]

// parameter for independent likelihood function
var indep_sigma = 0.001

var intersect_arrays = function(arrays){
  return filter(function(m){
          var m_in_all_lists = map(function(idx){arrays[idx].indexOf(m) != -1},
                                  _.range(1,arrays.length))
          return sum(m_in_all_lists)==m_in_all_lists.length
    }, arrays[0])
}

/* computes the probability of P(A) marginalized over all other variables in
** support of table with P=table and variables=["A"]
*/
var marginal = cache(function(table, variables){
  var tokens = table.support()
  var all_x = map(function(v){
    v.indexOf("-") != -1 ? filter(function(k){k.indexOf(v) != -1}, tokens) :
                           filter(function(k){k.indexOf("-"+v) == -1}, tokens)
  }, variables)
  var xs = intersect_arrays(all_x)

  return reduce(function(x, acc){acc + Math.exp(table.score(x))}, 0, xs)
})

var bn_prior = state_prior()
var all_bns = bn_prior.support()

var utterance_probs = cache(function(utterance, Table){
  if(utterance.indexOf(">") != -1){
    var components = utterance.includes(" > likely ") ? utterance.split(" > likely ") :
    utterance.split(" > ")

    var antecedent = components[0].split(" and ").join("")
    var consequent = components[1].split(" and ").join("")

    return marginal(Table, [antecedent, consequent]) /
           marginal(Table, [antecedent])
  }
  else if(utterance.includes("likely")){
    var u = utterance.slice("likely ".length)
    return marginal(Table, [u])
  }
  else if(utterance.includes("and")){
    var components = utterance.split(" and ")
    return marginal(Table, components)
  }
  else {
    return marginal(Table, [utterance])
  }
})

var meaning = cache(function(utterance, table){
 var p = utterance_probs(utterance, table)
 var u_applicable = utterance == "" ? true :
  (utterance.includes("likely") ? p >= theta_likely : p >= rsa_theta)
 return u_applicable
})

var literal_listener = cache(function(utterance){
  Infer({method: "enumerate", model: function(){
    var state = sample(bn_prior)
    condition(meaning(utterance, state.bn.table))
    return state
  }})
}, 10000)

var costs = cache(function(utt){
  var c1 = utt.includes(" > ") ? rsa_cost_conditional : 0
  var c2 = (utt.split(" and ").length - 1) * rsa_cost_and
  var c3 = utt.split("-").length > 1 ? rsa_cost_neg : 0
  var c4 = utt.includes("likely") ? rsa_cost_likely : 0
  return c1 + c2 + c3 + c4
}, 10000)

var speaker = cache(function(state){
  return Infer({method: "enumerate", model: function(){
    var utterance = uniformDraw(utterances)
    var ll = literal_listener(utterance)
    var utility = ll.score(state) - costs(utterance)
    factor(rsa_alpha * utility)
    return utterance
  }
 })
}, 10000)

// Run model for all bns
var distrs = map(function(bn){speaker(bn)}, all_bns)
var distributions = {"speaker_": distrs, "bns": map(function(obj){obj.bn}, all_bns)}
distributions
', sep="\n");
return(model)
}

run_model <- function(dat.to_wppl, prior=''){
  model <- get_full_rsa(prior)
  predictions_from_wppl <- webppl(model, data = dat.to_wppl, data_var = "dataFromR")
  
  dat <- predictions_from_wppl$bns %>% as_tibble() %>%
    rename(p=table.probs, cell=table.support, stimulus_id=id) %>% 
    rowid_to_column()
  
  stimulus_ids <- dat %>% pull(stimulus_id)
  pids <- dat %>% pull(pid)
  
  speaker_processed <- predictions_from_wppl$speaker_ %>% as_tibble() %>%
    rowid_to_column() %>%
    add_column(stimulus_id = stimulus_ids) %>%
    add_column(pid = pids) %>%
    unnest(c(probs, support)) %>% 
    rename(utterance=support, prediction=probs)
  
  speaker <- speaker_processed %>%
    pivot_wider(names_from = utterance, names_prefix = "utt.",
                values_from = prediction, values_fill = list(prediction=0)) %>% 
    pivot_longer(cols = starts_with("utt."), names_to = "utterance",
                 names_prefix = "utt.", values_to = "prediction")
  
  speaker_avg <- speaker %>% 
    group_by(stimulus_id, utterance) %>% summarise(mean=mean(prediction)) %>%
    add_column("produced_by"="model")
  
  sp <- list(all=speaker, avg=speaker_avg)
  
  return(sp)
}

mse_model_human <- function(dat.empirical, dat.model){
  data <- bind_rows(dat.empirical, dat.model)
  data_wide <- data %>%
    group_by(stimulus_id, utterance) %>%
    pivot_wider(names_from = produced_by,
                values_from = mean,
                values_fill = list(mean=NA)) %>%
    mutate(model=case_when(is.na(model) ~ 0, TRUE ~ model)) %>% 
    filter(!is.na(human)) %>% 
    arrange(stimulus_id, utterance) 
  
  mse <- data_wide %>% ungroup() %>%
    summarise(mse=mean((human - model)**2)) %>%
    pull(mse)
  return(mse)
}

cor_model_human <- function(dat.empirical, dat.model){
  data <- bind_rows(dat.empirical, dat.model)
  data_wide <- data %>%
    group_by(stimulus_id, utterance) %>%
    pivot_wider(names_from = produced_by,
                values_from = mean,
                values_fill = list(mean=NA)) %>%
    mutate(model=case_when(is.na(model) ~ 0, TRUE ~ model)) %>% 
    filter(!is.na(human)) %>% 
    arrange(stimulus_id, utterance) %>% 
    group_by(stimulus_id)
  
  rho <- cor.test(data_wide$human, data_wide$model)$estimate[[1]]
  return(rho)
}

