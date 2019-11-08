const config = require('./config.js');
const CarubsDBBuilder = require('./CarubsDBBuilder');

new CarubsDBBuilder(config.dbPath).rebuildAll(err => {
    if (err) return console.log(err);
    console.log("Database build complete.");
});
