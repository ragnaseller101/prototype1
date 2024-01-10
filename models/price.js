const mongoose = require("mongoose");
mongoose.pluralize(null);

const priceSchema = new mongoose.Schema({
	uuid: String,
	price: Number,
});

module.exports = mongoose.model("Price", priceSchema);