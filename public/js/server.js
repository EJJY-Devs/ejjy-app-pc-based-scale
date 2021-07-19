/* eslint-disable global-require */
(function () {
  const express = require("express");
  const cors = require("cors");
  const app = express();
  const path = require("path");

  app.use(cors());
  app.use(express.json());

  const server = app.listen(5000, function () {
    console.log(`Express server listening on port ${server.address().port}`);
  });

  var scaleAndPrinterPath = path.join(
    __dirname,
    "..",
    "publish",
    "Scale and Printer.exe"
  );
  scaleAndPrinterPath =
    "C:\\Users\\EJ-JY\\Desktop\\Scale and Printer\\bin\\Debug\\net4.0\\Scale and Printer.exe";

  let spawn = require("child_process").spawn;
  const process = spawn(scaleAndPrinterPath);

  app.get("/weight", cors(), (req, res, next) => {
    process.stdout.once("data", function (data) {
      const weight = parseFloat(data.toString());
      res.json({ weight });
    });
    process.stdin.write("getWeight\r\n");
  });

  app.post("/print-product", cors(), (req, res, next) => {
    const { name, weight, price, totalPrice, code, branch } = req.body;
    process.stdout.once("data", function () {
      res.json(true);
    });
    process.stdin.write(
      `print ${name} ${weight} ${price} ${totalPrice} ${code} ${branch}\r\n`
    );
  });

  app.post("/print-transaction", cors(), (req, res, next) => {
    const { transactionId, totalPrice, branch } = req.body;
    process.stdout.once("data", function () {
      res.json(true);
    });
    process.stdin.write(`print ${transactionId} ${totalPrice} ${branch}\r\n`);
  });

  app.post("/zero", cors(), (req, res, next) => {
    process.stdout.once("data", function () {
      res.json(true);
    });
    process.stdin.write("zero\r\n");
  });

  module.exports = app;
})();
