module.exports =  function (scaleAndPrinterPath) {
  const path = require("path");
	const express = require('express');
	const cors = require('cors');
	const fs = require('fs');
  const _ = require('lodash');
	const app = express();

	app.use(cors());
	app.use(express.json());
	const server = app.listen(5000, function () {
		console.log(`Express server listening on port ${server.address().port}`);
	});

	// Initiate Scale and Printer exe
	let process = null;
	fs.stat(scaleAndPrinterPath, function (err, stat) {
		if (!err) {
			const spawn = require('child_process').spawn;
			process = spawn(scaleAndPrinterPath);
		} else {
			console.log('Cannot find exe file.');
		}
	});

	// Endpoints
	app.get('/weight', cors(), (req, res, next) => {
		if (!process) {
			res.status(500).send('Error');
			return;
		}

		process.stdout.once('data', function (data) {
      const weight = _.round(parseFloat(data.toString()), 3);
			res.json(weight);
		});
		process.stdin.write('getWeight\r\n');
	});

	app.post('/print-product', cors(), (req, res, next) => {
		if (!process) {
			res.status(500).send('Error');
			return;
		}

		const { name, weight, price, totalPrice, code, branch } = req.body;
		process.stdout.once('data', function () {
			res.json(true);
		});
		process.stdin.write(
			`print ${name} ${weight} ${price} ${totalPrice} ${code} ${branch}\r\n`,
		);
	});

	app.post('/print-transaction', cors(), (req, res, next) => {
		if (!process) {
			res.status(500).send('Error');
			return;
		}

		const { transactionId, totalPrice, branch } = req.body;
		process.stdout.once('data', function () {
			res.json(true);
		});
		process.stdin.write(`print ${transactionId} ${totalPrice} ${branch}\r\n`);
	});

  app.post('/print-total', cors(), (req, res, next) => {
		if (!process) {
			res.status(500).send('Error');
			return;
		}

		const { totalPrice, branch } = req.body;
		process.stdout.once('data', function () {
			res.json(true);
		});
		process.stdin.write(`print ${totalPrice} ${branch}\r\n`);
	});

  app.post('/tare', cors(), (req, res, next) => {
		if (!process) {
			res.status(500).send('Error');
			return;
		}

		process.stdout.once('data', function () {
			res.json(true);
		});
		process.stdin.write('tare\r\n');
	});

	app.post('/zero', cors(), (req, res, next) => {
		if (!process) {
			res.status(500).send('Error');
			return;
		}

		process.stdout.once('data', function () {
			res.json(true);
		});
		process.stdin.write('zero\r\n');
	});
};
