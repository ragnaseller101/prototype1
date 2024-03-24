const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const { Users } = require("../models/database");
const { defer } = require("../helpers/utilities");
const { errorEmbed, basicEmbed } = require("../helpers/discord/embed");
const { fetchBalance } = require("../helpers/valorant/balance");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("balance")
		.setDescription("Show your current valorant and radianite points."),
	async execute(interaction) {
		await defer(interaction);
		console.log(`[command] - ${interaction.user.tag} used /balance.`);
		const user = await Users.findOne({ id: interaction.user.id });
		if (user) {
			if (user.users.length === 1) {
				const message = await fetchBalance(interaction.channel, user.users[0]);
				interaction.followUp(message);
				console.log(`Sent ${interaction.user.tag}'s balance!`);
			}
			else {
				let options = [];
				for (let i = 0; i < user.users.length; i++) {
					options.push({
						label: user.users[i].username,
						value: user.users[i].puuid
					})
				}
				const placeholder = 'Choose an Account';
				const row = new MessageActionRow();
				const select = new MessageSelectMenu();
				const id = `balance-select`;
				row.addComponents(select.setCustomId(id).setPlaceholder(placeholder).addOptions(options));

				await interaction.followUp({
					embeds: [basicEmbed("Which account would you like to check the balance?")],
					components: [row]
				});
			}
		}
		else {
			interaction.followUp({
				embeds: [errorEmbed("You have no account stored in the database!")]
			});
			console.log("No account found in database.");
		}

	},
};