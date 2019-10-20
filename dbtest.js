const CarubsDB = require('./dataaccess.js');

var cdb = new CarubsDB('./db/carubsdb');

cdb.insertComment({id:'commentId1',user_id:'check', created_utc:123456, body:'my comment', upvotes:3, downvotes:1, subreddit_id:1}, 
    (err,id) => {
        if (err) console.log(err);
        else console.log('done', id);
        cdb.close();
    }
);

