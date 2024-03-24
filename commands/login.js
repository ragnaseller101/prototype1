const { SlashCommandBuilder } = require("@discordjs/builders");
const { redeemUsernamePassword } = require("../helpers/valorant/auth");
const { defer } = require("../helpers/utilities");
const { successEmbed, errorEmbed } = require("../helpers/discord/embed");
const { Users } = require("../models/database");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("login")
		.setDescription("Login with your Riot account.")
		.addStringOption(option => option.setName("username").setDescription("Enter your Riot username.").setRequired(true))
		.addStringOption(option => option.setName("password").setDescription("Enter your Riot password.").setRequired(true)),
	async execute(interaction) {
		await defer(interaction, true);
		console.log(`[command] - ${interaction.user.tag} used /login.`);
		const username = interaction.options.getString('username');
		const password = interaction.options.getString('password');
		let login = await redeemUsernamePassword(interaction.user.id, username, password);
		if (login.success) {
			const hasDuplicate = await Users.findOne({ id: interaction.user.id, 'users.puuid': login.user.puuid });
			if (!hasDuplicate) {
				await Users.save(login.user);
				interaction.followUp({
					embeds: [successEmbed(`Successfully logged in as **${login.user.username}**!`)],
					ephemeral: true
				});
				console.log(`Logged in as ${login.user.username}!`);
			}
			else {
				interaction.followUp({
					embeds: [successEmbed(`**${login.user.username}** is already in the database!`)],
					ephemeral: true
				});
				console.log(`${login.user.username} is already in the database!`);
			}
		}
		else {
			interaction.followUp({
				embeds: [errorEmbed("Invalid username or password!")],
				ephemeral: true
			});
			console.log(`Unable to log in ${interaction.user.tag}'s account!`);
		}

	},
};