// # Node Server Startup
// Orchestrates the startup of the application when run from command line.

var express,
mattApp,
parentApp;

// Proceed with startup
express 	= require('express');
coreApp 	= require('./core');

// Create our parent express app instance.
parentApp = express();

console.log('starting app');

// Call coreApp to get an instance of appServer
coreApp().then( appServer => {
  // Mount our app instance on our desired subdirectory path if it exists.
  parentApp.use('/', appServer.rootApp);

  // Let the appServer handle starting our server instance.
  appServer.start(parentApp);
}).catch( err => {
  console.log(err);
});
