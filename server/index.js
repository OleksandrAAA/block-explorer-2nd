
require('babel-polyfill');
const cluster = require('cluster');

// Master
if (cluster.isMaster) {
  let cpus = require('os').cpus().length;
  if (cpus > 4) {
    cpus = 4;
  }

  if (process.argv.length > 2 && !isNaN(process.argv[2])) {
    cpus = parseInt(process.argv[2], 10);
  }

  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    cluster.fork();
  });
}
// Worker
else {
  const config = require('../config');
  const db = require('../lib/db');
  const express = require('express');
  const mongoose = require('mongoose');
  // Application.
  const middleware = require('./lib/middleware');
  const router = require('./lib/router');

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

  /* API */
  // Setup the application.
  const app = express();
  // Setup middleware for app.
  middleware(app);
  // Setup the routes.
  router(app);
  // Start the server.
  app.listen(config.api.port, () => {
    console.log(`BlocEx running on port ${ config.api.port }`);
  });

  // Export for testing.
  module.exports =  app;
}
