const FeatureUtilities = require('../FeatureUtilities');

describe('FeatureUtilities', () => {
    let user = {};
    let comments = [
        {
            ups:1,
            downs:2,
            subreddit_id: 't5_12345',
            body:"the comment body.",
            silver_award_count:1,
            gold_award_count: 0,
            platinum_award_count:0
        },{
            ups:5,
            downs:0,
            subreddit_id: 't5_12346',
            body:"the next, comment body!",
            silver_award_count:3,
            gold_award_count: 2,
            platinum_award_count:1
        },{
            ups:2,
            downs:2,
            subreddit_id: 't5_12345',
            body:"the \"last\" comment body.",
            silver_award_count:0,
            gold_award_count: 0,
            platinum_award_count:1
        }
    ];
    describe('#buildFeaturesForUser', () => {
        it('should set total_comments', () => {
            const features = FeatureUtilities.buildFeaturesForUser(user, comments, comments[0].subreddit_id);
            expect(features.total_comments).toBe(3);
        });
        it('should set avg_ups', () => {
            const features = FeatureUtilities.buildFeaturesForUser(user, comments, comments[0].subreddit_id);
            expect(features.avg_ups).toBeCloseTo(8/3, 3);
        });
        it('should set avg_downs', () => {
            const features = FeatureUtilities.buildFeaturesForUser(user, comments, comments[0].subreddit_id);
            expect(features.avg_downs).toBeCloseTo(4/3, 3);
        });
        it('should set max_ups', () => {
            const features = FeatureUtilities.buildFeaturesForUser(user, comments, comments[0].subreddit_id);
            expect(features.max_ups).toBe(5);
        });
        it('should set max_downs', () => {
            const features = FeatureUtilities.buildFeaturesForUser(user, comments, comments[0].subreddit_id);
            expect(features.max_downs).toBe(2);
        });
        it('should set num_subbreddits_commented', () => {
            const features = FeatureUtilities.buildFeaturesForUser(user, comments, comments[0].subreddit_id);
            expect(features.num_subbreddits_commented).toBe(2);
        });
        it('should set avg_comment_length', () => {
            const features = FeatureUtilities.buildFeaturesForUser(user, comments, comments[0].subreddit_id);
            expect(features.avg_comment_length).toBeCloseTo(64/3, 3);
        });
        it('should set max_comment_length', () => {
            const features = FeatureUtilities.buildFeaturesForUser(user, comments, comments[0].subreddit_id);
            expect(features.max_comment_length).toBe(24);
        });
        it('should set min_comment_length', () => {
            const features = FeatureUtilities.buildFeaturesForUser(user, comments, comments[0].subreddit_id);
            expect(features.min_comment_length).toBe(17);
        });
        it('should set num_distinct_words_used', () => {
            const features = FeatureUtilities.buildFeaturesForUser(user, comments, comments[0].subreddit_id);
            expect(features.num_distinct_words_used).toBe(4);
        });
        it('should set num_comments_in_targeted_subreddit', () => {
            const features = FeatureUtilities.buildFeaturesForUser(user, comments, comments[0].subreddit_id);
            expect(features.num_comments_in_targeted_subreddit).toBe(2);
        });
        it('should set most_comments_in_targeted_subreddit to be true', () => {
            const features = FeatureUtilities.buildFeaturesForUser(user, comments, comments[0].subreddit_id);
            expect(features.most_comments_in_targeted_subreddit).toBe(true);
        });
        it('should set most_comments_in_targeted_subreddit to be false', () => {
            const features = FeatureUtilities.buildFeaturesForUser(user, comments, 'bogussubredditid');
            expect(features.most_comments_in_targeted_subreddit).toBe(false);
        });
        it('should set max_silver_awards', () => {
            const features = FeatureUtilities.buildFeaturesForUser(user, comments, comments[0].subreddit_id);
            expect(features.max_silver_awards).toBe(3);
        });
        it('should set max_gold_awards', () => {
            const features = FeatureUtilities.buildFeaturesForUser(user, comments, comments[0].subreddit_id);
            expect(features.max_gold_awards).toBe(2);
        });
        it('should set max_platinum_awards', () => {
            const features = FeatureUtilities.buildFeaturesForUser(user, comments, comments[0].subreddit_id);
            expect(features.max_platinum_awards).toBe(1);
        });
        it('should set total_silver_awards', () => {
            const features = FeatureUtilities.buildFeaturesForUser(user, comments, comments[0].subreddit_id);
            expect(features.total_silver_awards).toBe(4);
        });
        it('should set total_gold_awards', () => {
            const features = FeatureUtilities.buildFeaturesForUser(user, comments, comments[0].subreddit_id);
            expect(features.total_gold_awards).toBe(2);
        });
        it('should set total_platinum_awards', () => {
            const features = FeatureUtilities.buildFeaturesForUser(user, comments, comments[0].subreddit_id);
            expect(features.total_platinum_awards).toBe(2);
        });
    });
    describe('#processCommentAggregation', () => {
        it('should sum ups', () => {
            const aggs = FeatureUtilities.processCommentAggregation(comments);
            expect(aggs.totalUps).toBe(8);
        });
        it('should find max ups', () => {
            const aggs = FeatureUtilities.processCommentAggregation(comments);
            expect(aggs.maxUps).toBe(5);
        });
        it('should sum downs', () => {
            const aggs = FeatureUtilities.processCommentAggregation(comments);
            expect(aggs.totalDowns).toBe(4);
        });
        it('should find max downs', () => {
            const aggs = FeatureUtilities.processCommentAggregation(comments);
            expect(aggs.maxDowns).toBe(2);
        });
        it('should produce subreddit set', () => {
            const aggs = FeatureUtilities.processCommentAggregation(comments);
            expect(aggs.subredditSet['t5_12345']).toBe(2);
            expect(aggs.subredditSet['t5_12346']).toBe(1);
        });
        it('should produce word set', () => {
            const aggs = FeatureUtilities.processCommentAggregation(comments);
            expect(aggs.wordSet['comment']).toBe(3);
        });
        it('should sum comment length', () => {
            const aggs = FeatureUtilities.processCommentAggregation(comments);
            expect(aggs.totalCommentLength).toBe(64);
        });
        it('should find max comment length', () => {
            const aggs = FeatureUtilities.processCommentAggregation(comments);
            expect(aggs.maxCommentLength).toBe(24);
        });
        it('should find min comment length', () => {
            const aggs = FeatureUtilities.processCommentAggregation(comments);
            expect(aggs.minCommentLength).toBe(17);
        });
        it('should sum silver awards', () => {
            const aggs = FeatureUtilities.processCommentAggregation(comments);
            expect(aggs.totalSilverAwards).toBe(4);
        });
        it('should find max silver awards', () => {
            const aggs = FeatureUtilities.processCommentAggregation(comments);
            expect(aggs.maxSilverAwards).toBe(3);
        });
        it('should sum gold awards', () => {
            const aggs = FeatureUtilities.processCommentAggregation(comments);
            expect(aggs.totalGoldAwards).toBe(2);
        });
        it('should find max gold awards', () => {
            const aggs = FeatureUtilities.processCommentAggregation(comments);
            expect(aggs.maxGoldAwards).toBe(2);
        });
        it('should sum platinum awards', () => {
            const aggs = FeatureUtilities.processCommentAggregation(comments);
            expect(aggs.totalPlatinumAwards).toBe(2);
        });
        it('should find max platinum awards', () => {
            const aggs = FeatureUtilities.processCommentAggregation(comments);
            expect(aggs.maxPlatinumAwards).toBe(1);
        });
        it('should sum controversiality', () => {
            const aggs = FeatureUtilities.processCommentAggregation(comments);
            expect(aggs.totalControversiality).toBeCloseTo(5.732, 3);
        });
        it('should find max controversiality', () => {
            const aggs = FeatureUtilities.processCommentAggregation(comments);
            expect(aggs.maxControversiality).toBeCloseTo(4);
        });
    });
    describe('#updateWordSet', () => {
        it('should produce word set', () => {
            const wordSet = {};
            const text = 'brand new sentence';

            FeatureUtilities.updateWordSet(wordSet, text);

            expect(wordSet['brand']).toBe(1);
            expect(wordSet['new']).toBe(1);
            expect(wordSet['sentence']).toBe(1);
        });
        it('should add to word set', () => {
            const wordSet = {};
            const text = 'brand new sentence';

            FeatureUtilities.updateWordSet(wordSet, text);
            FeatureUtilities.updateWordSet(wordSet, text);

            expect(wordSet['brand']).toBe(2);
            expect(wordSet['new']).toBe(2);
            expect(wordSet['sentence']).toBe(2);
        });
        it('should exclude some words', () => {
            const wordSet = {};
            const text = 'the new sentence';

            FeatureUtilities.updateWordSet(wordSet, text);

            expect(wordSet['new']).toBe(1);
            expect(wordSet['sentence']).toBe(1);
        });
    });
});