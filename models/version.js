const mongoose = require("mongoose");
mongoose.pluralize(null);

const versionSchema = new mongoose.Schema({
	manifestId: String,
	riotClientVersion: String
});

module.exports = mongoose.model("Version", versionSchema);