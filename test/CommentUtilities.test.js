const CommentUtilities = require('../CommentUtilities');

describe('CommentUtilities', () => {
    describe('#processCommentAggregation', () => {
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
        it('should sum ups', () => {
            const aggs = CommentUtilities.processCommentAggregation(comments);
            expect(aggs.ups).toEqual(8);
        });
        it('should find max ups', () => {
            const aggs = CommentUtilities.processCommentAggregation(comments);
            expect(aggs.maxUps).toEqual(5);
        });
        it('should sum downs', () => {
            const aggs = CommentUtilities.processCommentAggregation(comments);
            expect(aggs.downs).toEqual(4);
        });
        it('should find max downs', () => {
            const aggs = CommentUtilities.processCommentAggregation(comments);
            expect(aggs.maxDowns).toEqual(2);
        });
        it('should produce subreddit set', () => {
            const aggs = CommentUtilities.processCommentAggregation(comments);
            expect(aggs.subredditSet['t5_12345']).toEqual(2);
            expect(aggs.subredditSet['t5_12346']).toEqual(1);
        });
        it('should produce word set', () => {
            const aggs = CommentUtilities.processCommentAggregation(comments);
            expect(aggs.wordSet['comment']).toEqual(3);
        });
        it('should sum comment length', () => {
            const aggs = CommentUtilities.processCommentAggregation(comments);
            expect(aggs.commentLength).toEqual(64);
        });
        it('should find max comment length', () => {
            const aggs = CommentUtilities.processCommentAggregation(comments);
            expect(aggs.maxCommentLength).toEqual(24);
        });
        it('should find min comment length', () => {
            const aggs = CommentUtilities.processCommentAggregation(comments);
            expect(aggs.minCommentLength).toEqual(17);
        });
        it('should sum silver awards', () => {
            const aggs = CommentUtilities.processCommentAggregation(comments);
            expect(aggs.silverAwards).toEqual(4);
        });
        it('should find max silver awards', () => {
            const aggs = CommentUtilities.processCommentAggregation(comments);
            expect(aggs.maxSilverAwards).toEqual(3);
        });
        it('should sum gold awards', () => {
            const aggs = CommentUtilities.processCommentAggregation(comments);
            expect(aggs.goldAwards).toEqual(2);
        });
        it('should find max gold awards', () => {
            const aggs = CommentUtilities.processCommentAggregation(comments);
            expect(aggs.maxGoldAwards).toEqual(2);
        });
        it('should sum platinum awards', () => {
            const aggs = CommentUtilities.processCommentAggregation(comments);
            expect(aggs.platinumAwards).toEqual(2);
        });
        it('should find max platinum awards', () => {
            const aggs = CommentUtilities.processCommentAggregation(comments);
            expect(aggs.maxPlatinumAwards).toEqual(1);
        });
        it('should sum controversiality', () => {
            const aggs = CommentUtilities.processCommentAggregation(comments);
            expect(aggs.controversiality).toBeCloseTo(5.732, 3);
        });
        it('should find max controversiality', () => {
            const aggs = CommentUtilities.processCommentAggregation(comments);
            expect(aggs.maxControversiality).toBeCloseTo(4);
        });
    });
    describe('#updateWordSet', () => {
        it('should produce word set', () => {
            const wordSet = {};
            const text = 'brand new sentence';

            CommentUtilities.updateWordSet(wordSet, text);

            expect(wordSet['brand']).toEqual(1);
            expect(wordSet['new']).toEqual(1);
            expect(wordSet['sentence']).toEqual(1);
        });
        it('should add to word set', () => {
            const wordSet = {};
            const text = 'brand new sentence';

            CommentUtilities.updateWordSet(wordSet, text);
            CommentUtilities.updateWordSet(wordSet, text);

            expect(wordSet['brand']).toEqual(2);
            expect(wordSet['new']).toEqual(2);
            expect(wordSet['sentence']).toEqual(2);
        });
        it('should exclude some words', () => {
            const wordSet = {};
            const text = 'the new sentence';

            CommentUtilities.updateWordSet(wordSet, text);

            expect(wordSet['new']).toEqual(1);
            expect(wordSet['sentence']).toEqual(1);
        });
    });
});