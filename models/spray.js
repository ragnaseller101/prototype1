const mongoose = require("mongoose");
mongoose.pluralize(null);

const spraySchema = new mongoose.Schema({
	uuid: String,
	name: String,
	displayIcon: String,
	fullIcon: String,
	animatedIcon: String
});

module.exports = mongoose.model("Spray", spraySchema);