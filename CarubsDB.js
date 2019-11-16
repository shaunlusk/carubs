const sqlite3 = require('sqlite3').verbose();
const UserMap = require('./fieldMaps/userMap');
const FeatureMap = require('./fieldMaps/featureMap');
const CommentMap = require('./fieldMaps/commentMap');

class CarubsDB {
    constructor(dbOrPath) {
        this.db = typeof dbOrPath === 'string' ? new sqlite3.Database(dbOrPath) : dbOrPath;
        this.userFields = Object.keys(UserMap);
        const fieldsString = this.userFields.join(',');
        const valueParamsString = this.userFields.map(function(field) {return '?';}).join(',');
        this.insertUserSql = `INSERT INTO users(${fieldsString}) VALUES(${valueParamsString})`;
        this.selectUserSql = `SELECT ${fieldsString} FROM users`;
        this.userIdField = this.userFields.find(field => UserMap[field].isId);

        this.commentFields = Object.keys(CommentMap);
        const commentFieldString = this.commentFields.join(',');
        const commentValuesParamsString = this.commentFields.map(function(field) {return '?';}).join(',');
        this.insertCommentSql = `INSERT INTO comments(${commentFieldString}) VALUES(${commentValuesParamsString})`;
        this.selectCommentSql = `SELECT ${commentFieldString} FROM comments`;
        this.commentIdField = this.commentFields.find(field => CommentMap[field].isId);

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

    getUsers(callback) {
        const sql = this.selectUserSql;
        this.db.all(sql, [], (err, rows) => {
        if (err) {
          return callback(err);
        }
        return callback(null, rows);
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
        const mappedComment = this.commentFields.map((field) => {
            return comment[field];
        });
        this.db.run(this.insertCommentSql, mappedComment, function(err) {
            if (err) {
                return callback(err);
            }
            return callback(null, this.lastID);
        });
    }

    getCommentsByUserId(userId, callback) {
        const sql = this.selectCommentSql + ` WHERE user_id = ?`;
        this.db.get(sql, [userId], (err, row) => {
        if (err) {
          return callback(err);
        }
        return callback(null, row);
      });
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
 


