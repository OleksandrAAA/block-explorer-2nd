const config = require('../config');
const db = require('../lib/db');
const mongoose = require('mongoose');

/* Validate Config */
if (!config.db.user || !config.db.pass) {
  console.log("Mongo: Invalid user and/or password. User:", config.db.user, "Pass:", config.db.pass);
  process.exit(1);
}

/* Database */
// Connect to the database.
var dbString = 'mongodb://' + encodeURIComponent(config.db.user);
dbString = dbString + ':' + encodeURIComponent(config.db.pass);
dbString = dbString + '@' + config.db.host;
dbString = dbString + ':' + config.db.port;
dbString = dbString + '/' + config.db.name;

mongoose.set('strictQuery', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(dbString);