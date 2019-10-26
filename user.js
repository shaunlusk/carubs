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
  refreshToken : process.env.REFRESH_TOKEN
});

var user = r.getUser('shaungeek');
console.log(user.name);
// user.getAbout().bogus.then((a,b) => console.log(a,b));
// console.log(user.getAbout());
// console.log(user.created_utc);
user.fetch().then(u => console.log(Object.keys(u))).catch(console.log);
// user.created_utc.then(x => console.log(new Date(x*1000))).catch(console.log);

// user.has_verified_email.then(console.log).catch(console.log);
// user.link_karma.then(console.log).catch(console.log);
// user.comment_karma.then(console.log).catch(console.log);
// user.is_gold.then(console.log).catch(console.log);
// user.is_mod.then(console.log).catch(console.log);
// user.verified.then(console.log).catch(console.log);

/*
has_verified_email
link_karma
comment_karma
is_gold
is_mod
verified
*/

// user.about.then(console.log).catch(console.log);
// console.log(Object.keys(user));
