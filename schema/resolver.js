const { GraphQLUpload } = require("graphql-upload");
const mongoose = require("mongoose");
const Users = require("../models/users");

module.exports = {
	Query: {
		user: (root, { id }, context, info) => {
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new TypeError(`Invalid ID: ${id}`);
			}
			return Users.findById(id);
		},
		users: (root, args, context, info) => {
			return Users.find({});
		},
	},
	Mutation: {
		signupUser: (root, args, context, info) => {
			return Users.create(args);
		},
	},
	Upload: GraphQLUpload,
};
