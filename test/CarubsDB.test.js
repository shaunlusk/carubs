const CarubsDB = require('../CarubsDB');
const UserMap = require('../userMap');
const async = require('async');
const CarubsDBBuilder = require('../CarubsDBBuilder');

describe('CarubsDB', () => {
    describe('user', () => {
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