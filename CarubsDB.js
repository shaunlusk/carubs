var sqlite3 = require('sqlite3').verbose();

class CarubsDB {
    constructor(dbPath) {
        this.db = new sqlite3.Database(dbPath);
    }

    insertUser(user, callback) {
        this.db.run(`INSERT INTO users(id) VALUES(?)`, user, function(err) {
            if (err) {
                return callback(err);
            }
            return callback(null, this.lastID);
        });
    }

    insertSubreddit(subreddit, callback) {
        this.db.run(`INSERT INTO Subreddits(id, name) VALUES(?,?)`, [subreddit.id, subreddit.name], function(err) {
            if (err) {
                return callback(err);
            }
            return callback(null, this.lastID);
        });
    }

    insertComment(comment, callback) {
        this.db.run(
            `INSERT INTO Comments(id, user_id, timestamp, body, up, down, subreddit_id) VALUES(?,?,?,?,?,?,?)`, 
            [comment.id, 
                comment.user_id,
                comment.created_utc,
                comment.body,
                comment.ups,
                comment.downs,
                comment.subreddit_id
            ], 
            function(err) {
                if (err) {
                    return callback(err);
                }
                return callback(null, this.lastID);
            }
        );
    }

    close() {
        this.db.close();
    }
}

module.exports = CarubsDB;
 


