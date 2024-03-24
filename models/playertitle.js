const mongoose = require("mongoose");
mongoose.pluralize(null);

const playerTitleSchema = new mongoose.Schema({
	uuid: String,
	name: String,
	titleText: String,
	icon: String
});

module.exports = mongoose.model("Player Title", playerTitleSchema);