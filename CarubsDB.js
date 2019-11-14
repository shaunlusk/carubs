const sqlite3 = require('sqlite3').verbose();
const UserMap = require('./userMap');
const FeatureMap = require('./featureMap');

class CarubsDB {
    constructor(dbOrPath) {
        this.db = typeof dbOrPath === 'string' ? new sqlite3.Database(dbOrPath) : dbOrPath;
        this.userFields = Object.keys(UserMap);
        const fieldsString = this.userFields.join(',');
        const valueParamsString = this.userFields.map(function(field) {return '?';}).join(',');
        this.insertUserSql = `INSERT INTO users(${fieldsString}) VALUES(${valueParamsString})`;
        this.selectUserSql = `SELECT ${fieldsString} FROM users`;
        this.userIdField = this.userFields.find(field => UserMap[field].isId);

        this.featureFields = Object.keys(FeatureMap);
        const featureFieldsString = this.featureFields.join(',');
        const featureValuesParamsString = this.featureFields.map(function(field) {return '?';}).join(',');
        this.insertFeatureSql = `INSERT INTO features(${featureFieldsString}) VALUES(${featureValuesParamsString})`;
        this.selectFeatureSql = `SELECT ${fieldsString} FROM features`;
        this.featureIdField = this.featureFields.find(field => FeatureMap[field].isId);
    }

    insertUser(user, callback) {
        const mappedUser = this.userFields.map((field) => {
            return user[field];
        });
        this.db.run(this.insertUserSql, mappedUser, function(err) {
            if (err) {
                return callback(err);
            }
            return callback(null, this.lastID);
        });
    }

    getUserById(id, callback) {
        const sql = this.selectUserSql + ` WHERE ${this.userIdField} = ?`;
        this.db.get(sql, [id], (err, row) => {
        if (err) {
          return callback(err);
        }
        return callback(null, row);
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
            `INSERT INTO Comments(id, user_id, created_utc, body, ups, downs, subreddit_id) VALUES(?,?,?,?,?,?,?)`, 
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

    insertFeature(feature, callback) {
        const mappedFeature = this.featureFields.map((field) => {
            return feature[field];
        });
        this.db.run(this.insertFeatureSql, mappedFeature, function(err) {
            if (err) {
                return callback(err);
            }
            return callback(null, this.lastID);
        });
    }

    getFeatureByUserId(userId, callback) {
        const sql = this.selectFeatureSql + ` WHERE ${this.featureIdField} = ?`;
        this.db.get(sql, [userId], (err, row) => {
        if (err) {
          return callback(err);
        }
        return callback(null, row);
      });

    }

    close() {
        this.db.close();
    }
}

module.exports = CarubsDB;
 


