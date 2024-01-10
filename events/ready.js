const { connect, Client } = require("../models/database");
const { keepAlive } = require("../helpers/server");
const { loadData } = require("../helpers/valorant/data");
const { log_channel } = require("../config");

module.exports = {
	name: "ready",
	once: true,
	async execute(client) {
		client.user.setActivity("ur heart <3", { type: "PLAYING" });
		console.log("Connecting to Database...");
		await connect();
		console.log(`Logged in as ${client.user.tag}!`);
		await wasBotDown(client);
		await loadData();
		keepAlive();
		// notifyDailyShop(client);
		// notifyWeeklyShop(client);
		// setInterval(() => { 
		// 	notifyDailyShop(client);
		// 	notifyWeeklyShop(client);
		// }, 60000);
	},
}

const wasBotDown = async (client) => {
	const value = await Client.get();

	if (value.serverDown) {
		const channel = await client.channels.fetch(log_channel);
		const lastServerDown = Math.floor(value.lastServerDown / 1000 - 28800);
		await channel.send(`<@${client.user.id}> was down <t:${lastServerDown}:R> and have restarted!`);
		await Client.update({}, { serverDown: false });
		console.log("Bot was down!");
	}
}