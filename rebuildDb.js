const config = require('./config.js');
const CarubsDBBuilder = require('./CarubsDBBuilder');
const tableArg = process.argv[2].toLocaleLowerCase();

if (!tableArg || tableArg === 'all') {
    new CarubsDBBuilder(config.dbPath).rebuildAll(err => {
        if (err) return console.log(err);
        console.log("Database build complete.");
    });
} else if (tableArg === 'features') {
    new CarubsDBBuilder(config.dbPath).rebuildFeaturesTable(err => {
        if (err) return console.log(err);
        console.log("Features Table rebuilt.");
    });
} else if (tableArg === 'clusters') {
    new CarubsDBBuilder(config.dbPath).rebuildClustersTable(err => {
        if (err) return console.log(err);
        console.log("Clusters Table rebuilt.");
    });
} else {
    console.log("Unknown Argument:", tableArg);
}