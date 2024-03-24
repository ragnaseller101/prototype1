const mongoose = require("mongoose");
mongoose.pluralize(null);

const playerCardSchema = new mongoose.Schema({
	uuid: String,
	name: String,
	smallIcon: String,
	wideIcon: String,
	largeIcon: String
});

module.exports = mongoose.model("Player Card", playerCardSchema);