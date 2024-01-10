const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const { Users } = require("../models/database");
const { basicEmbed, loader } = require("../helpers/discord/embed");
const { fetchNightMarket } = require("../helpers/valorant/shop");

module.exports = {
	data: new SlashCommandBuilder()
    .setName("night-market-select"),
	async execute(interaction) {
        await interaction.deferUpdate();
        console.log(`[select] - ${interaction.user.tag} picked from the menu.`);

        if(interaction.message.interaction.user.id !== interaction.user.id) {
            return await interaction.reply({
                embeds: [basicEmbed("**That's not your message!** Use `/nightmarket` to check your night market.")],
                ephemeral: true
            });
        }

        loader(interaction);

        const user = await Users.findOne({ 'users.puuid': interaction.values[0] })
        const chosenAccount = user.users.find(acc => acc.puuid === interaction.values[0]);
        const message = await fetchNightMarket(interaction.channel, chosenAccount);
        let options = [];
        for ( let i = 0; i < user.users.length; i++ ) {
            if (interaction.values[0] !== user.users[i].puuid) {
                options.push({
                    label: user.users[i].username,
                    value: user.users[i].puuid
                })
            }
        }
        const placeholder = `${chosenAccount.username}`;
        const row = new MessageActionRow();
        const select = new MessageSelectMenu();
        const id = `night-market-select`;
        row.addComponents(select.setCustomId(id).setPlaceholder(placeholder).addOptions(options));

        await interaction.editReply({
            content: null,
            embeds: message.embeds,
            components: [row]
        });
	},
};