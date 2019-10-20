require('dotenv').config();
var snoowrap = require('snoowrap');

// Create a new snoowrap requester with OAuth credentials.
// For more information on getting credentials, see here: https://github.com/not-an-aardvark/reddit-oauth-helper
var r = new snoowrap({
  // TODO read version from package?
  userAgent: 'node:io.github.slusk.carubs:v0.1.0',
  clientId : process.env.CLIENT_ID,
  clientSecret : process.env.CLIENT_SECRET,
  refreshToken : process.env.REFRESH_TOKEN
});


// r.getComment('eizhkf7').author.name.then(console.log).catch(console.log);
// r.getUser('shaungeek').getComments({sort:'top'}).then(console.log).catch(console.log);


// r.getSubreddit('horizon').getHot().map(post => post.title).then(console.log);
const db = {};
let threadProcessedCount = 0;
let userProcessedCount = 0;

// r.getSubreddit('horizon').getHot().expandReplies({limit: Infinity, depth: Infinity}).then((threads) => {
//   threads.forEach((thread) => {
//     console.log(thread.title);
//   });
// }).catch(console.log);


function threadProcessed(totalThreadCount) {
  threadProcessedCount++;
  if (threadProcessedCount === totalThreadCount) {
    // console.log(db);

    populateUserComments();
  }
}

function userProcessed(totalUserCount) {
  userProcessedCount++;
  if (userProcessedCount === totalUserCount) {
    console.log(db);
    var users = Object.keys(db);
    console.log(users[0], db[users[0]].comments[0]);
  }
}

function populateUserComments() {
  const users = Object.keys(db);
  users.forEach((user, idx, users) => {
    console.log("Processing user ", user);
    r.getUser(user).getComments({sort:'top', limit:50}).then((comments) => {
      console.log("Found ", comments.length, " comments for ", user);
      comments.forEach((comment) => {
        db[user].comments.push({
          id:comment.id,
          user_id:user,
          created_utc: new Date(comment.created_utc * 1000),
          body: comment.body,
          upvotes: comment.ups,
          downvotes: comment.downs,
          subreddit_id: comment.subreddit_id
        });
      });
      userProcessed(users.length);
    });
  });
}

console.log("Running...");



r.getSubreddit('horizon').getHot().forEach((thread, idx, hotThreads) => {
  const totalThreads = hotThreads.length;
  thread.expandReplies({limit: Infinity, depth: Infinity}).then((thread) => {
    // console.log(thread.title);
    // console.log(thread.selftext);
    thread.comments.forEach((comment) => {

      if (!db[comment.author.name]) db[comment.author.name] = {comments:[]};
    });
    threadProcessed(totalThreads);
  }).catch(console.log);
});

// logs promises
// r.getSubreddit('horizon').getHot().map(thread => {
//   var expandedThread = thread.expandReplies({limit: Infinity, depth: Infinity});
//   var comments = expandedThread.comments.map((comment) => {
//     return {
//       created_utc: new Date(comment.created_utc * 1000),
//       body: comment.body,
//       upvotes: comment.ups,
//       downvotes: comment.downs,
//       subreddit_id: comment.subreddit_id
//     }
//   });
//   return {
//     threadTitle:expandedThread.title,
//     commentCount:expandedThread.comments.length,
//     comments:comments
//   };
// }).then(actualizedThread => {
//   console.log(actualizedThread);
// });

// r.getSubreddit('horizon').getHot()[0].expandReplies({limit: Infinity, depth: Infinity}).then((thread) => {
//   console.log(thread.title);
//   console.log(thread.selftext);
//   console.log(thread.comments.length);
//   var rawComment = thread.comments[0];
//   var comment = {
//     created_utc: new Date(rawComment.created_utc * 1000),
//     body: rawComment.body,
//     upvotes: rawComment.ups,
//     downvotes: rawComment.downs,
//     subreddit_id: rawComment.subreddit_id
//   };
//   console.log(comment);
// });

