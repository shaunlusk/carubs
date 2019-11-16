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


// r.getComment('f7lwnfr').fetch().then(console.log).catch(console.log);

r.getComment('f7lwnfr').fetch().then(comment => {
    console.log(getAwardCounts(comment));
}).catch(console.log);

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