const CarubsDB = require('./CarubsDB');
const config = require('./config');
const async = require('async');

const FeatureUtilities = require('./FeatureUtilities');

const carubsDb = new CarubsDB(config.dbPath);

carubsDb.getSubredditByName(config.targetSubreddit, (err, targetSubreddit) => {
    if (err) throw err;
    carubsDb.getUsers((err, users) => {
        if (err) throw err;
        async.each(users, processUser.bind(null, targetSubreddit.id), (err) => {
            if (err) throw err;
            console.log('Features Saved.');
        })
    });
});


function processUser(targetSubredditId, user, callback) {
    carubsDb.getCommentsByUserId(user.id, (err, comments) => {
        if (err) return callback(err);

        const features = FeatureUtilities.buildFeaturesForUser(user, comments, targetSubredditId);

        // save features in DB
        // console.log(user.name, features);
        // callback();
        carubsDb.insertFeature(features, (err) => {
            if (err) return callback(err);
            callback();
        });
    });
}