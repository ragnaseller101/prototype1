const mongoose = require("mongoose");
mongoose.pluralize(null);

const skinSchema = new mongoose.Schema({
	uuid: String,
	name: String,
	icon: String,
	rarity: String
});

module.exports = mongoose.model("Skin", skinSchema);