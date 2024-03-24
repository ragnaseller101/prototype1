const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const { defer } = require("../helpers/utilities");
const { Users } = require("../models/database");
const { fetchNightMarket } = require("../helpers/valorant/shop");
const { basicEmbed, errorEmbed } = require("../helpers/discord/embed");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("nightmarket")
		.setDescription("Show your current night market."),
	async execute(interaction) {
		await defer(interaction);
		console.log(`[command] - ${interaction.user.tag} used /nightmarket.`);
		const user = await Users.findOne({ id: interaction.user.id });
		if (user) {
			if (user.users.length === 1) {
				const message = await fetchNightMarket(interaction.channel, user.users[0]);
				await interaction.followUp(message);
				console.log(`Sent ${interaction.user.tag}'s night market!`);
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
				const id = `night-market-select`;
				row.addComponents(select.setCustomId(id).setPlaceholder(placeholder).addOptions(options));

				await interaction.followUp({
					embeds: [basicEmbed("Which account would you like to check the night market?")],
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