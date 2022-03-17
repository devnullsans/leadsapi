const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const usersSchema = new mongoose.Schema({
	email: {
		type: String,
		validate: {
			validator: async email => 0 === (await User.where({ email }).countDocuments()),
			message: ({ value }) => `Email ${value} is already registered.`
		}
	},
	name: {
		type: String
	},
	password: {
		type: String
	},
	verified: {
		type: Boolean,
		default: false
	},
	otp: {
		type: String,
		default: ""
	}
}, {
	timestamps: true
});

usersSchema.pre('save', async function (next) {
	if (this.isModified('password')) {
		try {
			this.password = await bcrypt.hash(this.password, 10);
		} catch (error) {
			next(error);
		}
		next();
	}
})

const User = mongoose.model("User", usersSchema);

module.exports = User;