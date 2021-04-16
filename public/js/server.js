  
/* eslint-disable global-require */
(function() {
  const express = require('express');
  const cors = require('cors')
  const app = express();
  const path = require('path');

  app.use(cors());
  app.use(express.json());

  const server = app.listen(5000, function() {
    console.log(`Express server listening on port ${server.address().port}`);
  });

  var scaleAndPrinterPath = path.join(__dirname, '..', 'publish', 'Scale and Printer.exe');
  scaleAndPrinterPath = "C:\\Users\\EJ-JY\\Desktop\\Scale and Printer\\bin\\Debug\\net4.0\\Scale and Printer.exe";
  
  app.get("/weight", cors(),(req, res, next) => {
    // const users = [
    //   {val: 0, pct: 60},
    //   {val: 1.5, pct: 20},
    //   {val: 1.25, pct: 20},
    // ];
    
    // const expanded = users.flatMap(user => Array(user.pct).fill(user));
    // const winner = expanded[Math.floor(Math.random() * expanded.length)];

    // res.json({weight: winner.val});
    // res.json({weight: 0});

    const spawn = require('child_process').spawn;
    const posProc = spawn(scaleAndPrinterPath);
    posProc.stdout.once('data', function(data) {
      const weight = parseFloat(data.toString());
      res.json({weight});
    });
    posProc.stdin.write('getWeight\r\n');    
  });

  
  app.post("/print-product", cors(),(req, res, next) => {
    // DEBUG: TESTING PURPOSES ONLY REMOVE WHEN BUILD
    // res.json(true);

    const {weight, price, totalPrice, code, branch} = req.body;
    const spawn = require('child_process').spawn;
    const posProc = spawn(scaleAndPrinterPath);
    posProc.stdout.once('data', function(data) {
      res.json(true);
    });
    posProc.stdin.write(`print ${weight} ${price} ${totalPrice} ${code} ${branch}\r\n`);
  });

  app.post("/print-transaction", cors(),(req, res, next) => {
    // DEBUG: TESTING PURPOSES ONLY REMOVE WHEN BUILD
    // res.json(true);
    
    const {transactionId, totalPrice, branch} = req.body;
    const spawn = require('child_process').spawn;
    const posProc = spawn(scaleAndPrinterPath);
    posProc.stdout.once('data', function(data) {
      res.json(true);
    });
    posProc.stdin.write(`print ${transactionId} ${totalPrice} ${branch}\r\n`);
  });
  
  module.exports = app;
})();