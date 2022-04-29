/* eslint-disable */
(function () {
	const express = require('express');
	const cors = require('cors');
	const fs = require('fs');
	const app = express();

	app.use(cors());
	app.use(express.json());

	const server = app.listen(5000, function () {
		console.log(`Express server listening on port ${server.address().port}`);
	});

	// Initiate Scale and Printer exe
	let process = null;
	const scaleAndPrinterPath =
		'C:\\Users\\Administrator\\Desktop\\Scale and Printer\\bin\\Debug\\net4.0\\Scale and Printer.exe';
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
			const weight = parseFloat(data.toString());
			res.json({ weight });
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

	module.exports = app;
})();
