const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const { Users, Client } = require("../models/database");
const { defer } = require("../helpers/utilities");
const { errorEmbed, basicEmbed, successEmbed } = require("../helpers/discord/embed");
const { fetchBalance } = require("../helpers/valorant/balance");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("notify")
		.setDescription("Notify this channel whenever I'm up!")
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('The channel to notify')
				.setRequired(true)),
	async execute(interaction) {
		await defer(interaction);
		console.log(`[command] - ${interaction.user.tag} used /notify.`);
		const user = await Users.findOne({ id: interaction.user.id });
		if (user) {
			const channel = interaction.options.getChannel('channel');
			if (!channel.isText()) {
				return interaction.followUp({
					embeds: [errorEmbed("Please select a text channel!")]
				});
			}

			const client = await Client.get();
			if (client) {
				const hasDuplicate = client.channels.includes(channel.id)
				if (!hasDuplicate) {
					client.channels.push(channel.id);
					await Client.update({}, { channels: client.channels });
					return interaction.followUp({
						embeds: [successEmbed("Channel saved to database!")]
					});
				}
				else {
					return interaction.followUp({
						embeds: [errorEmbed("This channel is already included!")]
					});
				}

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