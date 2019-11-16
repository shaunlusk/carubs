const CarubsDB = require('./CarubsDB');
const config = require('./config');

// For Each User

    // Calculate # days old account is

    // grab all user comments
    
    // Calculate:

    // total_comments   = comment count
    // avg_ups          = sum all ups / total_comments
    // avg_downs        = sum all downs / total_comments
    // max_ups          = max ups
    // max_downs        = max downs
    // num_subbreddits_commented    = hashset of subreddit ids, count keys
    // avg_comment_length   = sum comment body length / total_comments
    // max_comment_length   = max comment body length
    // min_comment_length   = min comment body length
    // num_distinct_words_used      = hashset of words in comment bodies, exclude most common words; count keys
    // phrases_repeated     = todo
    // num_comments_in_targeted_subreddit   = # comments with subreddit id matching the target
    // most_comments_in_targeted_subreddit  = whether user comments more in target subreddit than others; hashset of subreddit ids from comments with value set to count; find entry with max

    // max_silver_awards        = max # silver for any comment
    // max_gold_awards          = max # gold for any comment
    // max_platinum_awards      = max # platinum for any comment

    // total_silver_awards      = total # silver for all comments
    // total_gold_awards        = total # gold for all comments
    // total_platinum_awards    = total # platinum for all comments

    // Other todo - std dev on metrics with avg/min/max?
    // sentiment analysis?

    // save features in DB

