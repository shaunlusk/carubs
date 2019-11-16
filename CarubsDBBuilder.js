const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const async = require('async');
const config = require('./config.js');
const UserMap = require('./fieldMaps/userMap.js');
const FeatureMap = require('./fieldMaps/featureMap.js');
const CommentMap = require('./fieldMaps/commentMap.js');

const sqls = [
    'DROP TABLE IF EXISTS comments;',    
    'DROP TABLE IF EXISTS users;',
    'DROP TABLE IF EXISTS subreddits;',
    'DROP TABLE IF EXISTS features;',
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
        if (columnDef.referencesTable) constraints.push(`FOREIGN KEY (${key}) REFERENCES ${columnDef.referencesTable}(${columnDef.referencesField})`);
    });

    return columns.join(',\n') + ',\n' + constraints.join(',\n');
}

const usersTableSql = buildTableSql("./db/users_table.sql", UserMap);
sqls.push(usersTableSql);

const subredditsTableSql = fs.readFileSync("./db/subreddits_table.sql", "utf8");
sqls.push(subredditsTableSql);

const commentsTableSql = buildTableSql("./db/comments_table.sql", CommentMap);
sqls.push(commentsTableSql);

const featuresTableSql = buildTableSql("./db/features_table.sql", FeatureMap);
sqls.push(featuresTableSql);

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



