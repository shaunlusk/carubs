const {StringToWordTokens, omitSpecialCharacters} = require('slcommon/src/StringToWordTokens');
const ExcludeWords = require('./CommonWords');

function buildFeaturesForUser(user, comments, targetedSubreddit) {
    const features = {};
    const commentCount = comments.length;
    
    features.user_id = user.id;
    features.user_days_old = calculateUserDaysOld(user.created_utc);

    const aggregates = processCommentAggregation(comments);

    // total_comments   = comment count
    features.total_comments = commentCount;

    // avg_ups          = sum all ups / total_comments
    features.avg_ups = aggregates.totalUps / commentCount;

    // avg_downs        = sum all downs / total_comments
    features.avg_downs = aggregates.totalDowns / commentCount;

    // max_ups          = max ups
    features.max_ups = aggregates.maxUps;

    // max_downs        = max downs
    features.max_downs = aggregates.maxDowns;

    // num_subbreddits_commented    = hashset of subreddit ids, count keys
    features.num_subbreddits_commented = Object.keys(aggregates.subredditSet).length;

    // avg_comment_length   = sum comment body length / total_comments
    features.avg_comment_length = aggregates.totalCommentLength / commentCount;

    // max_comment_length   = max comment body length
    features.max_comment_length = aggregates.maxCommentLength;

    // min_comment_length   = min comment body length
    features.min_comment_length = aggregates.minCommentLength;

    // num_distinct_words_used      = hashset of words in comment bodies, exclude most common words; count keys
    features.num_distinct_words_used = Object.keys(aggregates.wordSet).length;

    // phrases_repeated     = todo
    features.phrases_repeated = null;

    // num_comments_in_targeted_subreddit   = # comments with subreddit id matching the target
    features.num_comments_in_targeted_subreddit = aggregates.subredditSet[targetedSubreddit];

    // most_comments_in_targeted_subreddit  = whether user comments more in target subreddit than others; hashset of subreddit ids from comments with value set to count; find entry with max
    features.most_comments_in_targeted_subreddit = findKeyWithMaxValueFromSet(aggregates.subredditSet) === targetedSubreddit;

    // max_silver_awards        = max # silver for any comment
    features.max_silver_awards = aggregates.maxSilverAwards;

    // max_gold_awards          = max # gold for any comment
    features.max_gold_awards = aggregates.maxGoldAwards;

    // max_platinum_awards      = max # platinum for any comment
    features.max_platinum_awards = aggregates.maxPlatinumAwards;

    // total_silver_awards      = total # silver for all comments
    features.total_silver_awards = aggregates.totalSilverAwards;

    // total_gold_awards        = total # gold for all comments
    features.total_gold_awards = aggregates.totalGoldAwards;

    // total_platinum_awards    = total # platinum for all comments
    features.total_platinum_awards = aggregates.totalPlatinumAwards;

    
    // Other todo - std dev on metrics with avg/min/max?
    // net upvotes? ratio of ups to downs?
    // sentiment analysis?

    return features;
}

function calculateUserDaysOld(createdUtc) {
    createdUtc *= 1000;
    const diff = Date.now() - createdUtc;
    const days = Math.round(diff / 1000 / 60 / 60 / 24);
    return days;
}

function findKeyWithMaxValueFromSet(set) {
    var maxKey = null;
    for (let key in set) {
      if (maxKey===null || set[key] > set[maxKey]) maxKey = key;
    }
    return maxKey;
}

function processCommentAggregation(comments) {
    const aggs = { 
        totalUps : 0,
        totalDowns : 0,
        maxUps: 0,
        maxDowns: 0,
        totalCommentLength : 0,
        maxCommentLength: 0,
        minCommentLength: Number.MAX_SAFE_INTEGER,
        subredditSet : {},
        wordSet : {},
        totalSilverAwards : 0,
        totalGoldAwards : 0,
        totalPlatinumAwards : 0,
        maxSilverAwards : 0,
        maxGoldAwards : 0,
        maxPlatinumAwards : 0,
        totalControversiality: 0,
        maxControversiality: 0
    };

    for (let comment of comments) {
        aggs.totalUps += comment.ups || 0;
        if (comment.ups > aggs.maxUps) aggs.maxUps = comment.ups;
        aggs.totalDowns += comment.downs || 0;
        if (comment.downs > aggs.maxDowns) aggs.maxDowns = comment.downs;
        aggs.subredditSet[comment.subreddit_id] = (aggs.subredditSet[comment.subreddit_id] || 0) + 1;
        aggs.totalCommentLength += comment.body.length;
        if (comment.body.length > aggs.maxCommentLength) aggs.maxCommentLength = comment.body.length;
        if (comment.body.length < aggs.minCommentLength) aggs.minCommentLength = comment.body.length;
        updateWordSet(aggs.wordSet, comment.body);
        aggs.totalSilverAwards += comment.silver_award_count;
        if (comment.silver_award_count > aggs.maxSilverAwards) aggs.maxSilverAwards = comment.silver_award_count;
        aggs.totalGoldAwards += comment.gold_award_count;
        if (comment.gold_award_count > aggs.maxGoldAwards) aggs.maxGoldAwards = comment.gold_award_count;
        aggs.totalPlatinumAwards += comment.platinum_award_count;
        if (comment.platinum_award_count > aggs.maxPlatinumAwards) aggs.maxPlatinumAwards = comment.platinum_award_count;
        const controversiality = comment.ups === 0 || comment.downs === 0 ? 0 : Math.pow(comment.ups + comment.downs, comment.ups > comment.downs ? comment.downs / comment.ups : comment.ups / comment.downs);
        aggs.totalControversiality += controversiality;
        if (controversiality > aggs.maxControversiality) aggs.maxControversiality = controversiality;
    }

    return aggs;
}

function updateWordSet(wordSet, text) {
    const words = StringToWordTokens(text, omitSpecialCharacters);
    for (let word of words) {
        if (ExcludeWords.indexOf(word) > -1) continue;
        wordSet[word] = (wordSet[word] || 0) + 1;
    }
}

module.exports = {
    processCommentAggregation:processCommentAggregation,
    updateWordSet:updateWordSet,
    buildFeaturesForUser:buildFeaturesForUser
}