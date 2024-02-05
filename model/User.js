const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	refreshToken: String,
	roles: {
		User: {
			type: Number,
			default: 2001,
		},
		Editor: Number,
		Admin: Number,
	},
})
const UserModel = mongoose.model("User", userSchema)
module.exports = UserModel
