const sqlite3 = require('sqlite3').verbose();
const UserMap = require('./userMap');

class CarubsDB {
    constructor(dbPath) {
        this.db = new sqlite3.Database(dbPath);
        this.userFields = Object.keys(UserMap);
        const fieldsString = userFields.join(',');
        const valueParamsString = userFields.map(function(field) {return '?';}).join(',');
        this.inserUserSql = `INSERT INTO users(${fieldsString}) VALUES(${valueParamsString})`;
    }

    insertUser(user, callback) {
        const mappedUser = this.userFields.map((field) => {
            return user[field];
        });
        this.db.run(this.inserUserSql, mappedUser, function(err) {
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
 


