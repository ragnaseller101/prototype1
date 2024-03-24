const { Permissions } = require("discord.js");
const { client_id } = require("../../config");

const canCreateEmojis = (guild) => guild && guild.me && guild.me.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS);

const externalEmojisAllowed = (channel) => !channel.guild || channel.permissionsFor(channel.guild.roles.everyone).has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS);

const checkPermissions = (channel) => {
	return channel.permissionsFor(client_id).has([Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES]);
}

module.exports = {
	canCreateEmojis,
	externalEmojisAllowed,
	checkPermissions
}