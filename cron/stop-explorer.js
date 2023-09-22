const { exec } = require('child_process');

function validate_port(port) {
  if (port == null || typeof port !== 'number' || port < 1 || port > 65535)
    return false;
  else
    return true;
}

function check_webserver_running(port, cb) {
  // linux, macos, etc.
  exec(`lsof -t -i:${port}`, (err, stdout, stderr) => {
    // check if the port is open
    if (stdout != null && stdout != '') {
      // return the kill cmd
      return cb(`kill -2 ${stdout.trim()}`);
    } else
      return cb(null);
  });
}


// check if the server is currently running
check_webserver_running(8081, function(killcmd) {
  // check return value
  if (killcmd != null) {
    // send a kill signal to the process that is currently using the explorer's server port
    exec(killcmd, (err, stdout, stderr) => {
      // show shutdown msg
      console.log('1: Explorer web service shutting down... ');
      //process.exit(0);
    });
  } else {
    // webserver is not running
    console.log('Error: Cannot stop explorer because it is not currently running');
    process.exit(1);
  }
});

check_webserver_running(3000, function(killcmd) {
  // check return value
  if (killcmd != null) {
    // send a kill signal to the process that is currently using the explorer's server port
    exec(killcmd, (err, stdout, stderr) => {
      // show shutdown msg
      console.log('2: Explorer api service shutting down... ');
      process.exit(0);
    });
  } else {
    // webserver is not running
    console.log('Error: Cannot stop explorer because it is not currently running');
    process.exit(1);
  }
});



