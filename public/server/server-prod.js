module.exports = function (scaleAndPrinterPath) {
	const path = require('path');
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
			process = spawn(scaleAndPrinterPath, {
				detached: true,
			});
		} else {
			console.log('Cannot find exe file.');
		}
	});

	// Handle process output
	const handleProcess = ({ res, onSuccess }) => {
		process.stdout.once('data', onSuccess);
		process.stderr.once('data', function (data) {
			console.error(`stderr: ${data}`);
			res.json(false);
		});
	};

	// Endpoints
	app.get('/weight', cors(), (req, res, next) => {
		if (!process) {
			res.status(500).send('Error');
			return;
		}

		handleProcess({
			res,
			onSuccess: function (data) {
				const weight = _.round(parseFloat(data.toString()), 3);
				res.json(weight);
			},
		});
		process.stdin.write('getWeight\r\n');
	});

	app.post('/print-product', cors(), (req, res, next) => {
		if (!process) {
			res.status(500).send('Error');
			return;
		}

		handleProcess({
			res,
			onSuccess: function () {
				res.json(true);
			},
		});

		const { name, weight, price, totalPrice, code, branchName, companyName } =
			req.body;
		process.stdin.write(
			`print ${name} ${weight} ${price} ${totalPrice} ${code} ${branchName} ${companyName}\r\n`,
		);
	});

	app.post('/print-transaction', cors(), (req, res, next) => {
		if (!process) {
			res.status(500).send('Error');
			return;
		}

		handleProcess({
			res,
			onSuccess: function () {
				res.json(true);
			},
		});

		const { transactionId, totalPrice, branchName, companyName } = req.body;
		process.stdin.write(
			`print ${transactionId} ${totalPrice} ${branchName} ${companyName}\r\n`,
		);
	});

	app.post('/print-total', cors(), (req, res, next) => {
		if (!process) {
			res.status(500).send('Error');
			return;
		}

		handleProcess({
			res,
			onSuccess: function () {
				res.json(true);
			},
		});

		const { totalPrice, branchName, companyName } = req.body;
		process.stdin.write(
			`printTotalOnly ${totalPrice} ${branchName} ${companyName}\r\n`,
		);
	});

	app.post('/tare', cors(), (req, res, next) => {
		if (!process) {
			res.status(500).send('Error');
			return;
		}

		handleProcess({
			res,
			onSuccess: function () {
				res.json(true);
			},
		});
		process.stdin.write('tare\r\n');
	});

	app.post('/zero', cors(), (req, res, next) => {
		if (!process) {
			res.status(500).send('Error');
			return;
		}

		handleProcess({
			res,
			onSuccess: function () {
				res.json(true);
			},
		});
		process.stdin.write('zero\r\n');
	});
};
