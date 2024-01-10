const mongoose = require("mongoose");
mongoose.pluralize(null);

const buddySchema = new mongoose.Schema({
	uuid: String,
	name: String,
    icon: String
});

module.exports = mongoose.model("Buddy", buddySchema);