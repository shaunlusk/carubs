const CarubsDB = require('../CarubsDB');
const UserMap = require('../fieldMaps/userMap');
const CommentMap = require('../fieldMaps/commentMap');
const async = require('async');
const CarubsDBBuilder = require('../CarubsDBBuilder');

describe('CarubsDB', () => {
    describe('users', () => {
        it('should write and retrieve data', (done) => {
            new CarubsDBBuilder('').rebuildAll((err,builtDb) => {
                if (err) throw err;
                const db = new CarubsDB(builtDb);
                const userSet = generateDataSet(UserMap, 3);
                const userIds = userSet.map(user => user[db.userIdField]);
                const retrievedUsers = [];
                async.each(userSet, db.insertUser.bind(db), (err) => {
                    if (err) throw err;
                    async.each(userIds, (id,callback) => {
                            db.getUserById(id, (err, row) => {
                                if (err) return callback(err);
                                retrievedUsers.push(row);
                                callback();
                            })
                        }, (err) => {
                            if (err) throw err;
                            validateRetrievedData(userSet, retrievedUsers);
                            done();
                        }
                    );
                }); 
            });
        });
    });
    describe('comments', () => {
        it('should write and retrieve data', (done) => {
            new CarubsDBBuilder('').rebuildAll((err,builtDb) => {
                if (err) throw err;
                const db = new CarubsDB(builtDb);
                const commentSet = generateDataSet(CommentMap, 3);
                const commentUserIds = commentSet.map(comment => comment.user_id);
                const retrievedComments = [];
                debugger;
                async.each(commentSet, db.insertComment.bind(db), (err) => {
                    if (err) throw err;
                    async.each(commentUserIds, (id,callback) => {
                            db.getCommentsByUserId(id, (err, row) => {
                                if (err) return callback(err);
                                retrievedComments.push(row);
                                callback();
                            })
                        }, (err) => {
                            if (err) throw err;
                            validateRetrievedData(commentSet, retrievedComments);
                            done();
                        }
                    );
                }); 
            });
        });
    });
    describe('subreddits', () => {
        it('should write and retrieve data', (done) => {
            new CarubsDBBuilder('').rebuildAll((err,builtDb) => {
                if (err) throw err;
                const db = new CarubsDB(builtDb);
                const subredditSet = [
                    {id:'t5_asdf', name:"bogus1"},
                    {id:'t5_qweqr', name:"bogus2"}
                ];
                const subredditNames = subredditSet.map(s => s.name);
                const retrievedSubreddits = [];
                debugger;
                async.each(subredditSet, db.insertSubreddit.bind(db), (err) => {
                    if (err) throw err;
                    async.each(subredditNames, (name,callback) => {
                            db.getSubredditByName(name, (err, row) => {
                                if (err) return callback(err);
                                retrievedSubreddits.push(row);
                                callback();
                            })
                        }, (err) => {
                            if (err) throw err;
                            validateRetrievedData(subredditSet, retrievedSubreddits);
                            done();
                        }
                    );
                }); 
            });
        });
    });
});

function validateRetrievedData(expectedDataSet, retrievedDataSet) {
    for (let i = 0; i < expectedDataSet; i++) {
        const expected = expectedDataSet[i];
        const retrieved = retrievedDataSet[i];
        expect(retrieved).toEqual(expected);
    }
}

function generateData(map, id) {
    var data = {};
    Object.keys(map).forEach(key => {
        switch (map[key].type) {
            case 'bool':
            case 'integer':
                data[key] = 1;
                break;
            case 'text':
                data[key] = 'check';
                break;
        }
        if (map[key].isId) data[key] = id;
    });
    return data;
}

function generateDataSet(map, count) {
    const set = [];
    const idType = map[Object.keys(map).find(key => map[key].isId)].type;

    for (let i = 0; i < count; i++) {
        let id = null;
        switch (idType) {
            case 'integer':
                id = i;
                break;
            case 'text':
                id = `${i}`;
                break;
        }
        set.push(generateData(map,id));
    }
    return set;
}