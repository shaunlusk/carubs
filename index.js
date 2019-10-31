require('dotenv').config();
const snoowrap = require('snoowrap');
const CarubsDB = require('./CarubsDB');
const config = require('./config');
const async = require('async');

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
// const carubsDb = new CarubsDB();


// function threadProcessed(totalThreadCount) {
//   threadProcessedCount++;
//   if (threadProcessedCount === totalThreadCount) {

//     populateUserComments();
//   }
// }

// function userProcessed(totalUserCount) {
//   userProcessedCount++;
//   if (userProcessedCount === totalUserCount) {
//     // console.log(db);
//     var users = Object.keys(db);
//     // console.log(users[0], db[users[0]].comments[0]);
//   }
// }

// function populateUserComments() {
//   const users = Object.keys(db);
//   users.forEach((user, idx, users) => {
//     console.log("Processing user ", user, ", " , idx, "/", users.length);
//     carubsDb.insertUser(user, (err) =>{
//       r.getUser(user).getComments({sort:'top', limit:50}).then((comments) => {
//         console.log("Found ", comments.length, " comments for ", user);
//         comments.forEach((comment) => {
//           db[user].comments.push({
//             id:comment.id,
//             user_id:user,
//             created_utc: comment.created_utc,
//             body: comment.body,
//             ups: comment.ups,
//             downs: comment.downs,
//             subreddit_id: comment.subreddit_id
//           });
//         });
//         userProcessed(users.length);
//       });
//     });
//   });
// }

console.log("Running...");

const threadPromises = [];
r.getSubreddit('horizon').getHot().forEach((thread) => {
  threadPromises.push(thread.expandReplies({limit: Infinity, depth: Infinity}));
});



// async.each(threads, 
//   (thread) => {
//     thread.then((thread) => {
//       thread.comments.forEach((comment) => {
//         if (!userSet[comment.author.name]) {
//           userSet[comment.author.name] = {
//             comments:[]
//           };
//         }
//       });
//     });
//   },
//   (err) => {

//   }
// );


// r.getSubreddit('horizon').getHot().forEach((thread, idx, hotThreads) => {
//   const totalThreads = hotThreads.length;
//   thread.expandReplies({limit: Infinity, depth: Infinity}).then((thread) => {

//     thread.comments.forEach((comment) => {
//       if (!userSet[comment.author.name]) {
//         userSet[comment.author.name] = {
//           comments:[]
//         };
//       }
//     });
//     threadProcessed(totalThreads);
//   }).catch(console.log);
// });
// function check(arg) {
//   console.log(arg);
// }

// const prm1 = {
//   errorState: false,
//   than:function(callback) {
//     callback();
//     return this;
//   },
//   catch:function(callback) {
//     if (this.errorState) callback();
//   }
// };

// const prm2 = {
//   errorState: false,
//   than:function(callback) {
//     callback();
//     return this;
//   },
//   catch:function(callback) {
//     if (this.errorState) callback();
//   }
// };

// async.each([prm1,prm2], check, console.log);