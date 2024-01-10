const mongoose = require("mongoose");
mongoose.pluralize(null);

const authSchema = new mongoose.Schema({
	rso: String,
	idt: String,
	login: String,
	password: String,
	ent: String,
});

const userSchema = new mongoose.Schema({
	id: String,
	puuid: String,
	auth: authSchema,
	username: String,
	region: String
});

const usersSchema = new mongoose.Schema({
	id: String,
	users: Array
})

module.exports = mongoose.model("User", usersSchema);