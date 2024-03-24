const { connect, getDatabaseStatus, Client } = require("../models/database");
const { getDateToday } = require("../helpers/utilities");
const process = require("node:process");

module.exports = {
	name: "debug",
	async execute(info) {
		if (info.includes("Hit a 429 while executing a request.")) {
			console.log("\n~~~~~~~~~~~~~~~~~~~~");
			console.log(info);
			console.log("~~~~~~~~~~~~~~~~~~~~");
			if (!getDatabaseStatus()) {
				connect();
			}
			await Client.update({}, { serverDown: true, lastServerDown: getDateToday() });
			process.send({ status: 429 });
		}
	},
}