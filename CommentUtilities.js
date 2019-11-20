const {StringToWordTokens, omitSpecialCharacters} = require('slcommon/src/StringToWordTokens');
const ExcludeWords = require('./CommonWords');

function processCommentAggregation(comments) {
    const aggs = { 
        ups : 0,
        downs : 0,
        maxUps: 0,
        maxDowns: 0,
        commentLength : 0,
        maxCommentLength: 0,
        minCommentLength: Number.MAX_SAFE_INTEGER,
        subredditSet : {},
        wordSet : {},
        silverAwards : 0,
        goldAwards : 0,
        platinumAwards : 0,
        maxSilverAwards : 0,
        maxGoldAwards : 0,
        maxPlatinumAwards : 0,
        controversiality: 0,
        maxControversiality: 0
    };

    for (let comment of comments) {
        aggs.ups += comment.ups || 0;
        if (comment.ups > aggs.maxUps) aggs.maxUps = comment.ups;
        aggs.downs += comment.downs || 0;
        if (comment.downs > aggs.maxDowns) aggs.maxDowns = comment.downs;
        aggs.subredditSet[comment.subreddit_id] = (aggs.subredditSet[comment.subreddit_id] || 0) + 1;
        aggs.commentLength += comment.body.length;
        if (comment.body.length > aggs.maxCommentLength) aggs.maxCommentLength = comment.body.length;
        if (comment.body.length < aggs.minCommentLength) aggs.minCommentLength = comment.body.length;
        updateWordSet(aggs.wordSet, comment.body);
        aggs.silverAwards += comment.silver_award_count;
        if (comment.silver_award_count > aggs.maxSilverAwards) aggs.maxSilverAwards = comment.silver_award_count;
        aggs.goldAwards += comment.gold_award_count;
        if (comment.gold_award_count > aggs.maxGoldAwards) aggs.maxGoldAwards = comment.gold_award_count;
        aggs.platinumAwards += comment.platinum_award_count;
        if (comment.platinum_award_count > aggs.maxPlatinumAwards) aggs.maxPlatinumAwards = comment.platinum_award_count;
        const controversiality = comment.ups === 0 || comment.downs === 0 ? 0 : Math.pow(comment.ups + comment.downs, comment.ups > comment.downs ? comment.downs / comment.ups : comment.ups / comment.downs);
        aggs.controversiality += controversiality;
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
    updateWordSet:updateWordSet
}