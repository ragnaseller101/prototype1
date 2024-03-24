const { getNumberAtEnd } = require("../helpers/utilities");

module.exports = {
	name: "interactionCreate",
	async execute(interaction) {
		if (interaction.isCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) return;

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				if (interaction.deferred) {
					await interaction.followUp({ content: "There was an error while executing this command!", ephemeral: true });
				}
				else {
					await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
				}
			}
		}
		else if (interaction.isSelectMenu()) {
			let id = interaction.customId;
			const number = getNumberAtEnd(id);
			if (number) {
				id = id.slice(0, id.length - getNumberAtEnd(id).toString().length - 1)
			}
			const menu = interaction.client.menus.get(id);

			if (!menu) return;

			try {
				await menu.execute(interaction);
			} catch (error) {
				console.error(error);
				if (interaction.deferred) {
					await interaction.followUp({ content: "There was an error while executing this menu!", ephemeral: true });
				}
				else {
					await interaction.reply({ content: "There was an error while executing this menu!", ephemeral: true });
				}
			}
		}
		else return;
	},
}