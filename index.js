require('dotenv').config();
var snoowrap = require('snoowrap');
const cheerio = require('cheerio');


debugger;
// NOTE: The following examples illustrate how to use snoowrap. However, hardcoding
// credentials directly into your source code is generally a bad idea in practice (especially
// if you're also making your source code public). Instead, it's better to either (a) use a separate
// config file that isn't committed into version control, or (b) use environment variables.

console.log(process.env);
// console.log(process.cwd());
// console.log(process.env.ACCESS_TOKEN);
// process.exit();

// Create a new snoowrap requester with OAuth credentials.
// For more information on getting credentials, see here: https://github.com/not-an-aardvark/reddit-oauth-helper
var r = new snoowrap({
  // TODO read version from package?
  userAgent: 'node:io.github.slusk.carubs:v0.1.0',
  // accessToken: process.env.ACCESS_TOKEN
  clientId : process.env.CLIENT_ID,
  clientSecret : process.env.CLIENT_SECRET,
  refreshToken : process.env.REFRESH_TOKEN
});

// console.log(r);
debugger;
// r.getSubreddit('AskReddit').getWikiPage('bestof').content_md.then(console.log);
// r.getUser('not_an_aardvark').link_karma.then(console.log);
// var userProxy = r.getUser('shaungeek');
// userProxy.getComments({

// }).then((comments) => {
//     console.log(comments[2]);
// }).catch(console.log);
// console.log(userProxy);
// .then(function(result) {
//     console.log(result);
// }).catch((reason) => {
//     console.log(reason);
// });

// this works
// r.getUser('shaungeek').getComments({sort:'top'}).then((commentHtml) => {
//     // console.log(comments);
//     const $ = cheerio.load(commentHtml);
//     var p = $('.usertext-body p');
//     // console.log(p.length);
//     // console.log(p.text());

//     p.each((i, item) => {
//         console.log(i, $(item).text());
//     });
// }).catch(console.log);


// r.getComment('eizhkf72ma').then(comment => {
//   console.log(comment);
// });



// const comment = r.getComment('c0hkuyq').fetch();
// //.body.then(console.log).catch(console.log);
// console.log(comment.body);
// comment.then(console.log).catch(console.log);

//works better
r.getComment('eizhkf7').author.name.then(console.log).catch(console.log);
r.getUser('shaungeek').getComments({sort:'top'}).then(console.log).catch(console.log);