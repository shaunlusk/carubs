module.exports = {
    id: {isId:true, type:'text', useFeature:true, isRequired:true}, 
    user_id: {type:'text', useFeature:true, isRequired:true, referencesTable:'users', referencesField:'id'},
    created_utc: {type:'integer', useFeature:true, isRequired:true},
    body: {type:'text', useFeature:true, isRequired:true},
    ups: {type:'integer', useFeature:true, isRequired:true},
    downs: {type:'integer', useFeature:true, isRequired:true},
    subreddit_id: {type:'text', useFeature:true, isRequired:true, referencesTable:'subbreddits', referencesField:'id'},
    silver_award_count: {type:'integer', useFeature:true},
    gold_award_count: {type:'integer', useFeature:true},
    platinum_award_count: {type:'integer', useFeature:true}
};
