// const CarubsDB = require('./CarubsDB.js');

// var cdb = new CarubsDB('./db/carubsdb');

// cdb.insertComment({id:'commentId2',user_id:'check', created_utc:123456, body:'my comment', ups:3, downs:1, subreddit_id:1}, 
//     (err,id) => {
//         if (err) console.log(err);
//         else console.log('done', id);
//         cdb.close();
//     }
// );

const UserMap = require('./userMap.js');

function objectToTableDescriptors(tableMap) {
    const columns = [];
    const constraints = [];
    Object.keys(tableMap).forEach((key) => {
        const columnDef = tableMap[key];
        let columnString = `${key}\t`;
        switch (columnDef.type) {
            case 'bool':
            case 'integer':
                columnString += 'INTEGER';
                break;
            case 'real':
                columnString += 'REAL';
                break;
            case 'blob':
                columnString += 'BLOB';
                break;
            case 'text':
            default:
                columnString += 'TEXT';
        }
        if (columnDef.isRequired) columnString += '\tNOT NULL';
        columns.push(columnString);

        if (columnDef.isId) constraints.push(`PRIMARY KEY (${key})`);
    });

    return columns.join(',\n') + ',\n' + constraints.join(',\n');
}

console.log(objectToTableDescriptors(UserMap));