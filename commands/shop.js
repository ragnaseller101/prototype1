const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const { defer } = require("../helpers/utilities");
const { Users } = require("../models/database");
const { fetchShop } = require("../helpers/valorant/shop");
const { errorEmbed, basicEmbed } = require("../helpers/discord/embed");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shop")
        .setDescription("Show your current daily shop."),
    async execute(interaction) {
        await defer(interaction);
		console.log(`[command] - ${interaction.user.tag} used /shop.`);
        const user = await Users.findOne({id: interaction.user.id});
        if (user) {
            if (user.users.length === 1) {
                const message = await fetchShop(interaction.channel, user.users[0], true);
                await interaction.followUp(message);
                console.log(`Sent ${interaction.user.tag}'s daily shop!`);
            }
            else {
				let options = [];
				for ( let i = 0; i < user.users.length; i++ ) {
					options.push({
						label: user.users[i].username,
						value: user.users[i].puuid
					})
				}
				const placeholder = 'Choose an Account';
				const row = new MessageActionRow();
				const select = new MessageSelectMenu();
				const id = `shop-select`;
				row.addComponents(select.setCustomId(id).setPlaceholder(placeholder).addOptions(options));

				await interaction.followUp({
					embeds: [basicEmbed("Which account would you like to check the daily shop?")],
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