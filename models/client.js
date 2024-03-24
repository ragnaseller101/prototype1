const mongoose = require("mongoose");
mongoose.pluralize(null);

const activitySchema = new mongoose.Schema({
	name: String,
	type: String
});

const clientSchema = new mongoose.Schema({
	serverDown: Boolean,
	lastServerDown: Date,
	status: String,
	activity: activitySchema,
	channels: [String]
});

module.exports = mongoose.model("Client", clientSchema);