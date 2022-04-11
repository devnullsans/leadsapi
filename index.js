require('dotenv').config();
const mongoose = require("mongoose");
const express = require('express');
const jwt = require('express-jwt');
const app = express();

app.use(
	'/graphql',
	(req, res, next) => {
		res
			.setHeader('Access-Control-Allow-Origin', '*')
			.setHeader('Access-Control-Allow-Methods', '*')
			.setHeader('Access-Control-Allow-Headers', '*');
		setImmediate(next);
	},
	jwt({
		secret: process.env.JWTKEY,
		algorithms: ['HS256'],
		credentialsRequired: false
	}),
	require('./Routes')
);

const port = process.env.PORT ?? 8080;
mongoose.connect("mongodb://localhost:27017/appdata", { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => app.listen(port, console.log(`Express-Graphql server running on port ${port}`)))
.catch(e => { throw e; });