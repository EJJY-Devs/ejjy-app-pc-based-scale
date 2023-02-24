module.exports = function (scaleAndPrinterPath) {
	const express = require('express');
	const cors = require('cors');
	const _ = require('lodash');
	const app = express();

	app.use(
		cors({
			origin: '*',
		}),
	);
	app.use(express.json());

	const server = app.listen(5001, function () {
		console.log(`Express server listening on port ${server.address().port}`);
	});

	let counter = 0;

	// Endpoints
	app.get('/weight', (req, res, next) => {
		counter += 1;
		let weight = _.round(0.2255, 3);

		if (counter > 320) {
			weight = _.round(0.423, 3);
		}
		res.json(weight);
	});

	app.post('/print-product', (req, res, next) => {
		console.log(req.body);
		res.json(true);
	});

	app.post('/print-transaction', (req, res, next) => {
		console.log(req.body);
		res.json(true);
	});

	app.post('/print-total', (req, res, next) => {
		console.log(req.body);
		res.json(true);
	});

	app.post('/tare', (req, res, next) => {
		res.json(true);
	});

	app.post('/zero', (req, res, next) => {
		counter = 0;
		res.json(true);
	});
};
