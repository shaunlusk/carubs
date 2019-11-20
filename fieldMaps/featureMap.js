module.exports = { 
    user_id: {isId:true, type:'text', useFeature:true, isRequired:true},
    user_days_old: {type:'integer', useFeature:true},
    total_comments: {type:'integer', useFeature:true},
    avg_ups: {type:'real', useFeature:true},
    avg_downs: {type:'real', useFeature:true},
    max_ups: {type:'integer', useFeature:true},
    max_downs: {type:'integer', useFeature:true},
    num_subbreddits_commented: {type:'integer', useFeature:true},
    avg_comment_length: {type:'real', useFeature:true},
    max_comment_length: {type:'integer', useFeature:true},
    min_comment_length: {type:'integer', useFeature:true},
    num_distinct_words_used: {type:'integer', useFeature:true},
    avg_word_repetition: {type:'real', useFeature:true},
    phrases_repeated: {type:'integer', useFeature:false},
    num_comments_in_targeted_subreddit: {type:'integer', useFeature:true},
    most_comments_in_targeted_subreddit: {type:'bool', useFeature:true},

    max_silver_awards: {type:'integer', useFeature:true},
    max_gold_awards: {type:'integer', useFeature:true},
    max_platinum_awards: {type:'integer', useFeature:true},

    total_silver_awards: {type:'integer', useFeature:true},
    total_gold_awards: {type:'integer', useFeature:true},
    total_platinum_awards: {type:'integer', useFeature:true},

    avg_controversiality: {type:'real', useFeature:true},
    max_controversiality: {type:'real', useFeature:true}
};
