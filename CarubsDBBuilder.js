const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const async = require('async');
const config = require('./config.js');
const UserMap = require('./fieldMaps/userMap.js');
const FeatureMap = require('./fieldMaps/featureMap.js');
const CommentMap = require('./fieldMaps/commentMap.js');
const ClusterMap = require('./fieldMaps/clusterMap.js');

const dropStatements = {
    comments: 'DROP TABLE IF EXISTS comments;',    
    users: 'DROP TABLE IF EXISTS users;',
    features: 'DROP TABLE IF EXISTS features;',
    subreddits: 'DROP TABLE IF EXISTS subreddits;',
    clusters: 'DROP TABLE IF EXISTS clusters;'
};

const sqls = Object.values(dropStatements);

function buildTableSql(tableFilename, tableMap) {
    let tableSql = fs.readFileSync(tableFilename, "utf8");
    const descriptors = objectToTableDescriptors(tableMap);
    tableSql = tableSql.replace("{descriptors}", descriptors);
    return tableSql;
}

function objectToTableDescriptors(tableMap) {
    const primaryKeys = [];
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

        if (columnDef.isId) primaryKeys.push(key);
        if (columnDef.referencesTable) constraints.push(`FOREIGN KEY (${key}) REFERENCES ${columnDef.referencesTable}(${columnDef.referencesField})`);
    });
    let pkString = primaryKeys.length > 0 ? `,\nPRIMARY KEY (${primaryKeys.join(',')})` : '';
    let fkString = constraints.length > 0 ? '\n,' + constraints.join(',\n') : '';
    return columns.join(',\n') + pkString + fkString;
}

const usersTableSql = buildTableSql("./db/users_table.sql", UserMap);
sqls.push(usersTableSql);

const subredditsTableSql = fs.readFileSync("./db/subreddits_table.sql", "utf8");
sqls.push(subredditsTableSql);

const commentsTableSql = buildTableSql("./db/comments_table.sql", CommentMap);
sqls.push(commentsTableSql);

const featuresTableSql = buildTableSql("./db/features_table.sql", FeatureMap);
sqls.push(featuresTableSql);

const clustersTableSql = buildTableSql("./db/clusters_table.sql", ClusterMap);
sqls.push(clustersTableSql);

class CarubsDBBuilder {
    constructor(path) {
        this.db = new sqlite3.Database(path);
    }

    rebuildAll (callback) {
        const tasks = sqls.map((sql) => {
            return (callback) => {this.db.run(sql, [], err => callback(err));};
        });
        
        async.series(tasks, (err) => {
            callback(err, this.db);
        });
    }

    rebuildFeaturesTable(callback) {
        this.db.run(dropStatements.features, [], err => {
            if (err) return callback(err);
            this.db.run(featuresTableSql, [], err => {
                callback(err, this.db);
            })
        })
    }

    rebuildClustersTable(callback) {
        this.db.run(dropStatements.clusters, [], err => {
            if (err) return callback(err);
            this.db.run(clustersTableSql, [], err => {
                callback(err, this.db);
            })
        })
    }
}

module.exports = CarubsDBBuilder;



