const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const usersSchema = new mongoose.Schema({
	email: {
		type: String,
		lowercase: true,
		trim: true,
		required: true,
		minlength: 6,
		maxlength: 256,
		validate: {
			validator: async email => 0 === (await User.where({ email }).countDocuments()),
			message: ({ value }) => `Email ${value} is already registered.`
		}
	},
	name: {
		type: String,
		trim: true,
		maxlength: 256,
	},
	password: {
		type: String,
		trim: true,
		minlength: 8,
		maxlength: 256
	},
	info: {
		verified: { type: Boolean, default: false },
		locked: { type: Date, default: Date.now }
	},
	otp: {
		code: { type: String, default: "" },
		ttl: { type: Date, default: Date.now },
		try: { type: Number, default: 0 }
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
});

const User = mongoose.model("User", usersSchema);

module.exports = User;