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
		next();// setTimeout(() => next(), 1e2);
	},
	jwt({
		secret: process.env.JWTKEY,
		algorithms: ['HS256'],
		credentialsRequired: false
	}),
	require('./graphql')
);


mongoose.connect("mongodb://localhost:27017/leads", { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => app.listen(process.env.PORT ?? 8080, console.log(`Express-Graphql server running on port ${process.env.PORT ?? 8080}`)))
.catch(e => { throw e; });