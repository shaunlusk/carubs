require('dotenv').config();
const snoowrap = require('snoowrap');
const CarubsDB = require('./CarubsDB');
const config = require('./config');
const async = require('async');
const PromiseEachHelper = require('./PromiseEachHelper');

// Create a new snoowrap requester with OAuth credentials.
// For more information on getting credentials, see here: https://github.com/not-an-aardvark/reddit-oauth-helper
var r = new snoowrap({
  // TODO read version from package?
  userAgent: 'node:io.github.slusk.carubs:v0.1.0',
  clientId : process.env.CLIENT_ID,
  clientSecret : process.env.CLIENT_SECRET,
  refreshToken : process.env.REFRESH_TOKEN
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
      console.log('Processing user', (userSavedCounter+1), 'of', totalUsers);
      carubsDb.insertUser(user, (err) => {
        userSavedCounter++;
        if (userProcessingIsDone(userSavedCounter, userCommentsSavedCounter, userSubredditSavedCounter, totalUsers)) {
          console.log('Done.');
        }
      });
      user.getComments({sort:config.commentSort, limit:config.commentLimmit}).then((comments) => {
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
          carubsDb.insertComment({
            id: comment.id, 
            user_id: user.id,
            created_utc: comment.created_utc,
            body: comment.body,
            ups: comment.ups,
            downs: comment.downs,
            subreddit_id: comment.subreddit_id
          }, (err) => {
            if (err) console.log(err);
            commentCounter++;
            if (commentCounter === comments.length) userCommentsSavedCounter++;
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