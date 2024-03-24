const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const { Users } = require("../models/database");
const { basicEmbed, loader, successEmbed } = require("../helpers/discord/embed");
const { fetchShop } = require("../helpers/valorant/shop");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("logout-select"),
	async execute(interaction) {
		await interaction.deferUpdate();
		console.log(`[select] - ${interaction.user.tag} picked from the menu.`);

		if (interaction.message.interaction.user.id !== interaction.user.id) {
			return await interaction.reply({
				embeds: [basicEmbed("**That's not your message!** Use `/logout` to remove your account.")],
				ephemeral: true
			});
		}
		const selected = [];
		const user = await Users.findOne({ id: interaction.user.id, 'users.puuid': interaction.values[0] });
		const filteredUsers = user.users.filter((u) => {
			if (u.puuid !== interaction.values[0]) {
				return u;
			}
			selected.push(u);
		});
		await Users.updateOne({ id: interaction.user.id }, { $set: { users: filteredUsers } });
		interaction.followUp({
			embeds: [successEmbed(`Successfully logged out **${selected[0].username}**!`)],
			ephemeral: true
		});
		console.log(`Logged out ${selected[0].username}!`);
	},
};