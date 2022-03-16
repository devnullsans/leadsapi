const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const usersSchema = new mongoose.Schema({
	email: {
		type: String,
		validate: {
			validator: async email => 0 === (await Users.where({ email }).countDocuments()),
			message: ({ value }) => `Email ${value} is already registered.`
		}
	},
	name: {
		type: String
	},
	password: {
		type: String
	}
}, {
	timestamps: true
});

usersSchema.pre('save', async function (next) {
	if (this.isModified('password')) {
		try {
			this.password = await bcrypt.hash(this.password, 10);
			next();
		} catch (error) {
			next(error);
		}
	} else {
		next();
	}
})

const Users = mongoose.model("Users", usersSchema);

module.exports = Users;