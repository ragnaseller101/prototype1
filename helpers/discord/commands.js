const fs = require("node:fs");
const { ValorantVersion } = require("../../models/database");

const commands = [];
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require("../../commands/" + file);
	commands.push(command.data.toJSON());
}

const deployCommands = {
	guild: async (message) => {
		if (!message.guild) return;

		console.log("Deploying commands in guild...");

		await message.guild.commands.set(commands).then(() => console.log(`Commands deployed in guild ${message.guild.name}!`));

		await message.reply("Deployed in guild!");
	},
	global: async (message) => {
		console.log("Deploying commands...");

		await message.client.application.commands.set(commands).then(() => console.log("Commands deployed globally!"));

		await message.reply("Deployed globally!");
	}
}

const undeployCommands = {
	guild: async (message) => {
		if (!message.guild) return;

		console.log("Undeploying commands...");

		await message.guild.commands.set([]).then(() => console.log(`Commands undeployed in guild ${message.guild.name}!`));

		await message.reply("Undeployed in guild!");
	},
	global: async (message) => {
		console.log("Undeploying commands...");

		await message.client.application.commands.set([]).then(() => console.log("Commands undeployed globally!"));

		await message.reply("Undeployed globally!");
	}
}

const bot = {
	server: async (message) => {

		const Guilds = message.client.guilds.cache.map(guild => guild);

		let embeds = [{ description: "I am a member of the following server/s:" }]

		for (let i = 0; i < Guilds.length; i++) {
			embeds.push({
				author: {
					name: Guilds[i].name,
					iconURL: Guilds[i].iconURL() ? Guilds[i].iconURL() : "https://cdn.discordapp.com/attachments/1007184378050396200/1007185536982720542/discord_logo.png"
				}
			})
		}
		await message.channel.send({ embeds: embeds });
	},

	changeVersion: async (message) => {
		await ValorantVersion.update({ manifestId: "123" });
		await message.channel.send({ content: "ManifestId changed!" });
	}
}
module.exports = {
	deployCommands,
	undeployCommands,
	bot
}