  
/* eslint-disable global-require */
(function() {
  const express = require('express');
  const cors = require('cors')
  const app = express();

  app.use(cors())

  const server = app.listen(5000, function() {
    console.log(`Express server listening on port ${server.address().port}`);
  });

  app.get("/weight", cors(),(req, res, next) => {
    var spawn = require('child_process').spawn;
    var posProc = spawn("../publish/Scale and Printer.exe");
    posProc.stdin.write('getWeight\r\n');
    posProc.stdout.once('data', function(data) {
      let weight = parseFloat(data.toString());
      weight = Math.floor((Math.random() * 1) + 0);
      res.json(weight);
    })
  });
  
  module.exports = app;
})();