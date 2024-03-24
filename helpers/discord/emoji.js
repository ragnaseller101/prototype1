const { canCreateEmojis } = require("./permissions");
const { home_server, vp_emoji_name, rp_emoji_name, kc_emoji_name, dl_emoji_name } = require("../../config");
// valorant points
const VpEmojiName = vp_emoji_name;
const VpEmojiUrl = "https://media.valorant-api.com/currencies/85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741/displayicon.png";
// radianite points
const RpEmojiName = rp_emoji_name;
const RpEmojiUrl = "https://media.valorant-api.com/currencies/e59aa87c-4cbf-517a-5983-6e81511be9b7/displayicon.png";

const KcEmojiName = kc_emoji_name;
const KcEmojiUrl = "https://media.valorant-api.com/currencies/85ca954a-41f2-ce94-9b45-8ca3dd39a00d/displayicon.png";

const DlEmojiName = dl_emoji_name;
const DlEmojiUrl = "https://cdn.discordapp.com/attachments/1192077296069259344/1192077339618717837/discord_loader.gif?ex=65a7c389&is=65954e89&hm=5a178b6153a7cfdb9d646fffb4cd3ed6f4ff20c5428725a843a01e6116e52470&"

const ValorantPointsEmoji = async (channel, externalEmojisAllowed = false) => await getEmoji(channel, VpEmojiName, VpEmojiUrl, externalEmojisAllowed);

const RadianitePointsEmoji = async (channel, externalEmojisAllowed = false) => await getEmoji(channel, RpEmojiName, RpEmojiUrl, externalEmojisAllowed);

const KingdomCreditsEmoji = async (channel, externalEmojisAllowed = false) => await getEmoji(channel, KcEmojiName, KcEmojiUrl, externalEmojisAllowed);

const DiscordLoaderEmoji = async (channel, externalEmojisAllowed = false) => await getEmoji(channel, DlEmojiName, DlEmojiUrl, externalEmojisAllowed);

const getEmoji = async (channel, name, url, externalEmojisAllowed) => {
	if (!name || !url) return;

	const guild = channel.guild;

	// see if emoji exists already
	const emoji = emojiInGuild(guild, name);
	if (emoji && emoji.available) return emoji;
	// check in other guilds
	if (externalEmojisAllowed) {
		if (home_server) {
			try {
				const emojiGuild = await channel.client.guilds.fetch(home_server);
				if (!emojiGuild) console.error("Server not found! Either the ID is incorrect or I am not in that server anymore!");
				else {
					const emoji = emojiInGuild(emojiGuild, name);
					if (emoji && emoji.available) return emoji;
				}
			} catch (e) { }
		}
	}

	// couldn't find usable emoji, create it
	if (guild) return await createEmoji(guild, name, url);
}

const createEmoji = async (guild, name, url) => {
	if (!guild || !name || !url) return;

	if (!canCreateEmojis(guild)) return console.log(`Don't have permission to create emoji ${name} in guild ${guild.name}!`);

	if (guild.emojis.cache.size >= maxEmojis(guild))
		return console.log(`Emoji limit of ${maxEmojis(guild)} reached for ${guild.name} while uploading ${name}!`);

	console.log(`Uploading emoji ${name} in ${guild.name}...`);
	try {
		return await guild.emojis.create(url, name);
	} catch (e) {
		console.error(`Could not create ${name} emoji in ${guild.name}! Either I don't have the right role or there are no more emoji slots`);
		console.error(`${e.name}: ${e.message}`);
	}
}

const emojiInGuild = (guild, name) => {
	return guild && guild.emojis.cache.find(emoji => emoji.name === name);
}

const emojiToString = (emoji) => {
	if (emoji) {
		if (emoji.animated) return `<a:${emoji.name}:${emoji.id}>`;
		else return `<:${emoji.name}:${emoji.id}>`;
	}
}

const maxEmojis = (guild) => {
	switch (guild.premiumTier) {
		case "NONE": return 50;
		case "TIER_1": return 100;
		case "TIER_2": return 150;
		case "TIER_3": return 250;
	}
}

module.exports = {
	ValorantPointsEmoji,
	RadianitePointsEmoji,
	KingdomCreditsEmoji,
	DiscordLoaderEmoji,
	emojiInGuild,
	emojiToString
}