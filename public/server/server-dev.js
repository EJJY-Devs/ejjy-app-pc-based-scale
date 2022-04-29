/* eslint-disable */
(function () {
	const express = require('express');
	const cors = require('cors');
	const fs = require('fs');
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

	// Endpoints
	app.get('/weight', (req, res, next) => {
		res.json({ weight: parseFloat('1.1807') });
	});

	app.post('/print-product', (req, res, next) => {
		res.json(true);
	});

	app.post('/print-transaction', (req, res, next) => {
		res.json(true);
	});

	app.post('/zero', (req, res, next) => {
		res.json(true);
	});

	module.exports = app;
})();
