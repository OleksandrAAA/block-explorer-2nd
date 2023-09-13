
require('babel-polyfill');
require('bluebird');
const db = require('../lib/db');
const mongoose = require('mongoose');
const RPC = require('../lib/rpc');
const config = require('../config');

// Handle missed promises.
process.on('unhandledRejection', (err) => {
  console.log(JSON.stringify(err));
});

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

/**
 * If greater than 1 then process ended in error.
 * @param {Number} code The exit code.
 */
const exit = (code = 0) => {
  try {
    mongoose.disconnect();
  } catch(err) {
    console.log('db:', err);
  } finally {
    process.exit(code);
  }
};

// Setup RPC node connection.
const rpc = new RPC();

module.exports =  {
  exit,
  rpc
};
