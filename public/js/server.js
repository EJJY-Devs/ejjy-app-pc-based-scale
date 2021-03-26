  
/* eslint-disable global-require */
(function() {
  const express = require('express');
  const cors = require('cors')
  const app = express();
  const fs = require('fs');
  const path = require('path');

  app.use(cors())

  const server = app.listen(5000, function() {
    console.log(`Express server listening on port ${server.address().port}`);
  });

  var scaleAndPrinterPath = path.join(__dirname, '..', 'publish', 'Scale and Printer.exe');

  app.get("/weight", cors(),(req, res, next) => {
    const spawn = require('child_process').spawn;
    const posProc = spawn(scaleAndPrinterPath);
    posProc.stdin.write('getWeight\r\n');
    posProc.stdout.once('data', function(data) {
      const arrData = data.toString().split("\r\n");
      const weight = parseFloat(arrData.length > 0 ? arrData[0] : '0');
      res.json({weight, others: arrData});
    })
  });

  
  app.post("/print-product", cors(),(req, res, next) => {
    // const spawn = require('child_process').spawn;
    // const posProc = spawn(scaleAndPrinterPath);
    // posProc.stdin.write('print\r\n');
    // posProc.stdout.once('data', function(data) {
    //   const arrData = data.toString().split("\r\n");
    //   const weight = parseFloat(arrData.length > 0 ? arrData[0] : '0');
    //   res.json({weight, others: arrData});
    // })
    
    res.json("test");
  });
  
  module.exports = app;
})();