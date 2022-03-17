const { GraphQLUpload } = require("graphql-upload");
const mongoose = require("mongoose");
const crypto = require("crypto");
const User = require("../models/user");

module.exports = {
	Query: {
		user: (root, { id }, context, info) => {
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new TypeError(`Invalid ID: ${id}`);
			}
			return User.findById(id);
		},
		users: (root, args, context, info) => {
			return User.find({});
		},
		test: async (root, { filter, document }, context, info) => {
			const results = await User.updateOne({ email: filter }, { email: document });
			console.log(results);
			return true;
		}
	},
	Mutation: {
		signupUser: (root, args, context, info) => {
			return User.create({ ...args, otp: crypto.randomInt(1e3, 1e4).toString() });
			// return User.create(args);
		},
		verifyUser: async (root, { id, otp }, context, info) => {
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new Error(`Invalid ID ${id}`);
			}
			const user = await User.findById(id);
			if (!user) {
				throw new Error(`Unknown Id ${id}`);
			}

			if (!user?.otp) {
				throw new Error(`Access Forbidden`);
			}

			console.log(user);

			return null;
		},
	},
	Upload: GraphQLUpload,
};
