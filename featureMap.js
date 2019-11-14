module.exports = { 
    user_id: {isId:true, type:'text', userFeature:true, isRequired:true},
    user_days_old: {type:'integer', userFeature:true},
    total_comments: {type:'integer', userFeature:true},
    avg_ups: {type:'integer', userFeature:true},
    avg_downs: {type:'integer', userFeature:true},
    max_ups: {type:'integer', userFeature:true},
    max_downs: {type:'integer', userFeature:true},
    num_subbreddits_commented: {type:'integer', userFeature:true},
    avg_comment_length: {type:'integer', userFeature:true},
    max_comment_length: {type:'integer', userFeature:true},
    min_comment_length: {type:'integer', userFeature:true},
    num_distinct_words_used: {type:'integer', userFeature:true},
    phrases_repeated: {type:'integer', userFeature:true},
    num_comments_in_targeted_subreddit: {type:'integer', userFeature:true},
    most_comments_in_targeted_subreddit: {type:'bool', userFeature:true}
};
