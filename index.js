require('dotenv').config();
const snoowrap = require('snoowrap');
const CarubsDB = require('./CarubsDB');
const config = require('./config');

// Create a new snoowrap requester with OAuth credentials.
// For more information on getting credentials, see here: https://github.com/not-an-aardvark/reddit-oauth-helper
var r = new snoowrap({
  // TODO read version from package?
  userAgent: 'node:io.github.slusk.carubs:v0.1.0',
  clientId : process.env.CLIENT_ID,
  clientSecret : process.env.CLIENT_SECRET,
  refreshToken : process.env.REFRESH_TOKEN,
  continueAfterRatelimitError: true
});

const userSet = {};
const subredditSet = {};
const carubsDb = new CarubsDB(config.dbPath);


console.log("Running...");

// hot threads is a single chainable promise; it has a forEach method though.
// r.getSubreddit(config.targetSubreddit).getHot()

let counter = 0;
r.getSubreddit(config.targetSubreddit).getHot().forEach((thread, idx, hotThreads) => {
  const totalThreads = hotThreads.length;
  thread.expandReplies({limit: Infinity, depth: Infinity}).then((thread) => {
    for (let comment of thread.comments) {
      if (comment.author.name === '[deleted]') continue;
      if (!userSet[comment.author.name]) userSet[comment.author.name] = comment.author.name;
    }
    counter++;
    if (counter === totalThreads) {
      processUsers();
    }
  }).catch(console.log);
});

function processUsers() {
  let userSavedCounter = 0;
  let userCommentsSavedCounter = 0;
  let userSubredditSavedCounter = 0;
  const totalUsers = Object.keys(userSet).length;
  
  for (let userName in userSet) {
    r.getUser(userName).fetch().then(user => {
      carubsDb.insertUser(user, (err) => {
        userSavedCounter++;
        if (userProcessingIsDone(userSavedCounter, userCommentsSavedCounter, userSubredditSavedCounter, totalUsers)) {
          console.log('Done.');
        }
      });
      user.getComments({sort:config.commentSort, limit:config.commentLimit}).then((comments) => {
        // console.log("Found ", comments.length, " comments for ", userName);
        let commentCounter = 0;
        let commentSubredditCounter = 0;
        comments.forEach((comment) => {
          const subredditName = comment.subreddit.display_name;
          if (subredditSet[subredditName]) {
            commentSubredditCounter++;
            if (commentSubredditCounter === comments.length) userSubredditSavedCounter++;
            if (userProcessingIsDone(userSavedCounter, userCommentsSavedCounter, userSubredditSavedCounter, totalUsers)) {
              console.log('Done.');
            }
          } else {
            subredditSet[subredditName] = subredditSet;
            carubsDb.insertSubreddit(
              {
                id: comment.subreddit_id,
                name: subredditName
              }, (err) => {
                if (err) console.log(err);
                commentSubredditCounter++;
                if (commentSubredditCounter === comments.length) userSubredditSavedCounter++;
                if (userProcessingIsDone(userSavedCounter, userCommentsSavedCounter, userSubredditSavedCounter, totalUsers)) {
                  console.log('Done.');
                }
              }
            );
          }
          const awards = getAwardCounts(comment)
          carubsDb.insertComment({
            id: comment.id, 
            user_id: user.id,
            created_utc: comment.created_utc,
            body: comment.body,
            ups: comment.ups,
            downs: comment.downs,
            subreddit_id: comment.subreddit_id,
            silver_award_count: awards.silver,
            gold_award_count: awards.gold,
            platinum_award_count: awards.platinum,
          }, (err) => {
            if (err) console.log(err);
            commentCounter++;
            if (commentCounter === comments.length) {
              userCommentsSavedCounter++;
              console.log('Processed user', userSavedCounter, 'of', totalUsers);
            }
            if (userProcessingIsDone(userSavedCounter, userCommentsSavedCounter, userSubredditSavedCounter, totalUsers)) {
              console.log('Done.');
            }
          });

        });
      }).catch(console.log);
    }).catch(console.log);
    // break;
  }
}

function userProcessingIsDone(userSavedCounter, userCommentsSavedCounter, userSubredditSavedCounter, totalUsers) {
  return userSavedCounter === totalUsers && userCommentsSavedCounter === totalUsers && userSubredditSavedCounter === totalUsers;
}

function getAwardCounts(comment) {
  if (!comment.all_awardings || comment.all_awardings.length === 0) return {silver:0,gold:0,platinum:0};
  const silver = comment.all_awardings.find(award => award.name === 'Silver');
  const gold = comment.all_awardings.find(award => award.name === 'Gold');
  const platinum = comment.all_awardings.find(award => award.name === 'Platinum');
  return {
    silver: silver ? silver.count || 0 : 0,
    gold: gold ? gold.count || 0 : 0,
    platinum: platinum ? platinum.count || 0 : 0
  };
}