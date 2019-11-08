const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const async = require('async');
const config = require('./config.js');
const UserMap = require('./userMap.js');

const sqls = [
    'DROP TABLE IF EXISTS Comments;',    
    'DROP TABLE IF EXISTS Users;',
    'DROP TABLE IF EXISTS Subreddits;'
];

function buildTableSql(tableFilename, tableMap) {
    let tableSql = fs.readFileSync(tableFilename, "utf8");
    const descriptors = objectToTableDescriptors(tableMap);
    tableSql = tableSql.replace("{descriptors}", descriptors);
    return tableSql;
}

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

const usersTableSql = buildTableSql("./db/UsersTable.sql", UserMap);
sqls.push(usersTableSql);

const subredditsTableSql = fs.readFileSync("./db/SubredditsTable.sql", "utf8");
sqls.push(subredditsTableSql);

const commentsTableSql = fs.readFileSync("./db/CommentsTable.sql", "utf8");
sqls.push(commentsTableSql);

class CarubsDBBuilder {
    constructor(path) {
        this.db = new sqlite3.Database(path);
    }

    rebuildAll (callback) {
        const tasks = sqls.map((sql) => {
            return (callback) => {this.db.run(sql, [], err => callback(err));};
        });
        
        async.series(tasks, (err) => {
            if (err) return callback(err);
            callback(null, this.db);
        });
    }
}

module.exports = CarubsDBBuilder;



