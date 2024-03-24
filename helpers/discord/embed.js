const { getSkinWithPrice, getSkinRarity } = require("../valorant/skin");
const { getRarity } = require("../valorant/rarity");
const { emojiToString, DiscordLoaderEmoji } = require("./emoji");
const { externalEmojisAllowed } = require("./permissions");
const { balance_emoji, timer_emoji, shop_emoji } = require("../../config");
const { fetch, isMaintenance } = require("../utilities");
const { Buddies, PlayerCards, Sprays, PlayerTitles } = require("../../models/database");

const COLOR_RED = 0xFD4553;
const COLOR_GREEN = 0x00FF00;
const COLOR_WHITE = 0xFFFFFF;

const successEmbed = (content) => {
	return {
		description: content,
		color: COLOR_GREEN
	};
}
const errorEmbed = (content) => {
	return {
		description: content,
		color: COLOR_RED
	};
}

const renderOffers = async (guild, response, user, VpEmoji, shopCommand = false) => {
	const content = shopCommand ? null : `<@${user.id}>`;
	if (!response.success) return { content: content, embeds: [errorEmbed(`**Couldn't fetch your shop**, there was a problem logging in!`)] };
	const offers = response.shop.SkinsPanelLayout.SingleItemOffers;
	const embeds = [shopHeaderEmbed(guild, response, user)];
	const VpEmojiString = emojiToString(VpEmoji);
	for (const uuid of offers) {
		const skin = await getSkinWithPrice(uuid);
		const rarity = getRarity(skin.rarity);
		const embed = skinEmbed(skin, rarity, VpEmojiString);
		embeds.push(embed);
	}
	return { content, embeds };
}

const renderAccessoryOffers = async (guild, response, user, KcEmoji, shopCommand = false) => {
	const content = shopCommand ? null : `<@${user.id}>`;
	if (!response.success) return { content: content, embeds: [errorEmbed(`**Couldn't fetch your shop**, there was a problem logging in!`)] };
	const offers = response.shop.AccessoryStore.AccessoryStoreOffers;
	let embeds = [];
	const KcEmojiString = emojiToString(KcEmoji);
	let temp = {
		buddy: [],
		card: [],
		spray: [],
		title: []
	};
	for (const x of offers) {
		let y = x.Offer.Rewards[0];
		let info = await getItemInfo(y.ItemTypeID, y.ItemID);

		let new_item = {
			uuid: info.uuid,
			name: info.name,
			price: x.Offer.Cost[`85ca954a-41f2-ce94-9b45-8ca3dd39a00d`],
			rarity: getRarity(info.rarity),
			icon: info.fullIcon ?? info.largeIcon ?? info.icon ?? info.displayIcon
		}

		const embed = itemEmbed(new_item, KcEmojiString);
		temp = pushToArray(temp, info.type, embed);
	}
	const header = [accessoryShopHeaderEmbed(guild, response, user)];
	embeds = header.concat(temp.buddy.concat(temp.card.concat(temp.spray.concat(temp.title))));
	return { content, embeds };
}

const renderNightMarket = async (guild, response, user, VpEmoji, shopCommand = false) => {
	const content = null;
	if (!response.success) return { content: content, embeds: [errorEmbed(`**Couldn't fetch your nightmarket**, there was a problem logging in!`)] };
	const offers = response.shop.BonusStore.BonusStoreOffers;
	const embeds = [nightMarketHeaderEmbed(guild, response, user)];
	const VpEmojiString = emojiToString(VpEmoji);
	for (const offer of offers) {
		let skin = await getSkinWithPrice(offer.Offer.OfferID);
		skin.discountPercent = offer.DiscountPercent;
		skin.discountedPrice = offer.DiscountCosts['85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741'];
		const rarity = getRarity(skin.rarity);
		const embed = nightMarketSkinEmbed(skin, rarity, VpEmojiString);
		embeds.push(embed);
	}
	return { content, embeds };
}

const renderBalance = async (guild, balance, user, VpEmoji, RpEmoji, KcEmoji) => {
	const VpEmojiString = emojiToString(VpEmoji);
	const RpEmojiString = emojiToString(RpEmoji);
	const KcEmojiString = emojiToString(KcEmoji);
	let titleEmoji = externalEmojisAllowed(guild) ? balance_emoji.allowed : balance_emoji.default;

	const embeds = [{
		title: `${titleEmoji} ${user.username}'s wallet: `,
		color: COLOR_WHITE,
		fields: [
			{ name: "Valorant Points", value: `${VpEmojiString} ${balance.vp}`, inline: true },
			{ name: "Radianite Points", value: `${RpEmojiString} ${balance.rad}`, inline: true },
			{ name: "Kingdom Credits", value: `${KcEmojiString} ${balance.kc}`, inline: true }
		]
	}];

	return { embeds };
}

const basicEmbed = (content) => {
	return {
		description: content,
		color: COLOR_WHITE
	}
}

const skinEmbed = (skin, rarity, VpEmoji) => {
	return {
		author: {
			name: skin.name,
			icon_url: rarity.icon
		},
		description: `${VpEmoji} **${skin.price}**`,
		color: rarity.color,
		thumbnail: {
			url: skin.icon
		}
	};
}

const itemEmbed = (item, VpEmoji) => {
	return {
		author: {
			name: item.name,
			icon_url: item.rarity ? item.rarity.icon : ""
		},
		description: `${VpEmoji} **${item.price}**`,
		color: item.rarity ? item.rarity.color : COLOR_WHITE,
		thumbnail: {
			url: item.icon
		}
	};
}

const nightMarketSkinEmbed = (skin, rarity, VpEmoji) => {
	return {
		author: {
			name: skin.name,
			icon_url: rarity.icon
		},
		description: `${VpEmoji} **${skin.discountedPrice}** ~~${skin.price}~~ (-${skin.discountPercent}%)`,
		color: rarity.color,
		thumbnail: {
			url: skin.icon
		}
	};
}

const shopHeaderEmbed = (guild, response, user) => {
	let timer = externalEmojisAllowed(guild) ? timer_emoji.allowed : timer_emoji.default;
	let shop = externalEmojisAllowed(guild) ? shop_emoji.allowed : shop_emoji.default;
	const expires = `<t:${Math.floor(Date.now() / 1000) + response.shop.SkinsPanelLayout.SingleItemOffersRemainingDurationInSeconds + 60}:R>`;
	return {
		description: `${shop} Daily shop for **${user.username}**\n${timer} New shop ${expires}`,
		color: COLOR_WHITE,
	};
}

const accessoryShopHeaderEmbed = (guild, response, user) => {
	let timer = externalEmojisAllowed(guild) ? timer_emoji.allowed : timer_emoji.default;
	let shop = externalEmojisAllowed(guild) ? shop_emoji.allowed : shop_emoji.default;
	const expires = `<t:${Math.floor(Date.now() / 1000) + response.shop.AccessoryStore.AccessoryStoreRemainingDurationInSeconds + 60}:R>`;
	return {
		description: `${shop} Weekly accessory shop for **${user.username}**\n${timer} New shop ${expires}`,
		color: COLOR_WHITE,
	};
}

const nightMarketHeaderEmbed = (guild, response, user) => {
	let timer = externalEmojisAllowed(guild) ? timer_emoji.allowed : timer_emoji.default;
	let shop = externalEmojisAllowed(guild) ? shop_emoji.allowed : shop_emoji.default;
	const expires = `<t:${Math.floor(Date.now() / 1000) + response.shop.BonusStore.BonusStoreRemainingDurationInSeconds + 60}:R>`;
	return {
		description: `${shop} Nightmarket for **${user.username}**\n${timer} Ends ${expires}`,
		color: COLOR_WHITE,
	};
}

const getItemInfo = async (type, uuid) => {
	switch (type) {
		case "dd3bf334-87f3-40bd-b043-682a57a8dc3a": //buddy
			const buddy = await Buddies.findOne({ uuid: uuid });
			buddy.type = "Buddy";
			return buddy;
		case "3f296c07-64c3-494c-923b-fe692a4fa1bd": //card
			const playercard = await PlayerCards.findOne({ uuid: uuid });
			playercard.type = "Player Card";
			return playercard;
		case "d5f120f8-ff8c-4aac-92ea-f2b5acbe9475": //spray
			const spray = await Sprays.findOne({ uuid: uuid });
			spray.type = "Spray";
			return spray;
		case "de7caa6b-adf7-4588-bbd1-143831e786c6": //title
			const title = await PlayerTitles.findOne({ uuid: uuid });
			title.type = "Player Title";
			return title;
	}
}

const pushToArray = (array, type, object) => {
	switch (type) {
		case "Buddy": //buddy
			array.buddy.push(object);
			return array;
		case "Player Card": //card
			array.card.push(object);
			return array;
		case "Spray": //spray
			array.spray.push(object);
			return array;
		case "Player Title": //title
			array.title.push(object);
			return array;
	}
}

const loader = async (interaction) => {

	const DlEmoji = await DiscordLoaderEmoji(interaction.channel, externalEmojisAllowed(interaction.channel));
	return await interaction.editReply({
		content: emojiToString(DlEmoji),
		embeds: [],
		components: []
	})
}

module.exports = {
	successEmbed,
	errorEmbed,
	basicEmbed,
	renderOffers,
	renderAccessoryOffers,
	renderNightMarket,
	renderBalance,
	loader
}