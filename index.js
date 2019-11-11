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
let threadProcessedCount = 0;
let userProcessedCount = 0;
const carubsDb = new CarubsDB(config.dbPath);


console.log("Running...");

const threadPromises = [];
// hot threads is a single chainable promise; it has a forEach method though.
// r.getSubreddit('horizon').getHot()

let counter = 0;
r.getSubreddit('horizon').getHot().forEach((thread, idx, hotThreads) => {
  const totalThreads = hotThreads.length;
  thread.expandReplies({limit: Infinity, depth: Infinity}).then((thread) => {
    for (let comment of thread.comments) {
      if (comment.author.name === '[deleted]') continue;
      if (!userSet[comment.author.name]) userSet[comment.author.name] = {comments:[]};
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
  const totalUsers = Object.keys(userSet).length;
  
  for (let userName in userSet) {
    r.getUser(userName).fetch().then(user => {
      carubsDb.insertUser(user, (err) => {
        userSavedCounter++;
        if (userSavedCounter === totalUsers && userCommentsSavedCounter === totalUsers) {
          console.log('Done.');
        }
      });
      user.getComments({sort:'top', limit:50}).then((comments) => {
        console.log("Found ", comments.length, " comments for ", userName);
        let commentCounter = 0;
        comments.forEach((comment) => {
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
            if (userSavedCounter === totalUsers && userCommentsSavedCounter === totalUsers) {
              console.log('Done.');
            }
          });

        });
      }).catch(console.log);;
    }).catch(console.log);
    // break;
  }
}