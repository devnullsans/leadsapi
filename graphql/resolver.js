const { GraphQLUpload } = require("graphql-upload");
const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require("../models/user");

module.exports = {
	Query: {
		// user: (root, { id }, context, info) => {
		// 	if (!mongoose.Types.ObjectId.isValid(id)) {
		// 		throw new TypeError(`Invalid ID: ${id}`);
		// 	}
		// 	return User.findById(id);
		// },
		// users: (root, args, context, info) => {
		// 	return User.find({});
		// },
		test: async (root, args, context, info) => {
			return true;
		}
	},
	Mutation: {
		signupUser: (root, { name, email, password }, context, info) => {
			const usr = {
				name, email, password,
				otp: {
					code: crypto.randomInt(1e3, 1e4).toString(1e1),
					ttl: Date.now() + 6e5, try: 3
				}
			};
			// mail to email the otp
			return User.create(usr);
			// return User.create(args);
		},
		verifyUser: async (root, { id, otp }, context, info) => {
			if (!mongoose.Types.ObjectId.isValid(id)) throw new Error(`Invalid ID ${id}`);
			const usr = await User.findById(id);
			if (!usr) throw new Error(`Unknown Id ${id}`);
			if (usr.info.verified) throw new Error(`User already verified`);
			if (usr.info.locked.getTime() > Date.now()) throw new Error('Please try again after 24 hours!');
			if (!usr.otp) throw new Error(`Access Blocked`);
			if (usr.otp.code !== otp) {
				if (usr.otp.try === 0) {
					usr.otp = null;
					usr.info.locked = Date.now() + 8e7;
				} else usr.otp.try--;
				await usr.save({ validateBeforeSave: false });
				throw new Error(`Invalid OTP`);
			}
			if (usr.otp.ttl.getTime() < Date.now()) {
				usr.otp = {
					code: crypto.randomInt(1e3, 1e4).toString(1e1),
					ttl: Date.now() + 6e5, try: 3
				};
				await usr.save({ validateBeforeSave: false });
				// mail to email the otp
				throw new Error(`OTP expired check for a new one`);
			}
			usr.otp = null;
			usr.info.verified = true;
			await usr.save({ validateBeforeSave: false });
			return true;
		},
		loginUser: async (root, { email, password }, context, info) => {
			const usr = await User.findOne({ email: email.toLowerCase() });
			if (!usr) throw new Error(`Unknown User with ${email}`);
			if (!usr.info.verified) {
				if (usr.info.locked.getTime() > Date.now()) throw new Error('Please try again after 24 hours!');
				if (!usr.otp) {
					usr.otp = {
						code: crypto.randomInt(1e3, 1e4).toString(1e1),
						ttl: Date.now() + 6e5, try: 3
					};
					await usr.save({ validateBeforeSave: false });
					// mail to email the otp
					throw new Error(`Email not verified check email for OTP`);
				}
				throw new Error('Email not verified.');
			}
			const valid = await bcrypt.compare(password, usr.password);
			if (!valid) throw new Error('Invalid cresentials!');
			return jwt.sign({ id: usr.id, email: usr.email }, process.env.JWTKEY ?? 'secret_key', { expiresIn: process.env.JWTEXPIRE ?? '7d' });
		},
	},
	Upload: GraphQLUpload,
};
