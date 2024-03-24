const { SlashCommandBuilder } = require("@discordjs/builders");
const { Users } = require("../models/database");
const { defer } = require("../helpers/utilities");
const { successEmbed, errorEmbed, basicEmbed } = require("../helpers/discord/embed");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("logout")
		.setDescription("Forget and permanently delete your account from the bot."),
	async execute(interaction) {
		await defer(interaction);
		console.log(`[command] - ${interaction.user.tag} used /logout.`);
		const user = await Users.findOne({ id: interaction.user.id });

		if (user) {
			if (user.users.length === 1) {
				await Users.deleteOne({ id: interaction.user.id });
				interaction.followUp({
					embeds: [successEmbed(`<@${interaction.user.id}>'s account has been deleted from the database!`)]
				});
				console.log(`Deleted ${interaction.user.tag}'s account!`);
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
				const id = `logout-select`;
				row.addComponents(select.setCustomId(id).setPlaceholder(placeholder).addOptions(options));

				await interaction.followUp({
					embeds: [basicEmbed("Which account would you like to delete?")],
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