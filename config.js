const dotenv = require("dotenv");
dotenv.config();
module.exports = {
	token: process.env.token,
	client_id: process.env.client_id,
	db_url: process.env.db_url,
	home_server: process.env.home_server,
	log_channel: process.env.log_channel,
	balance_emoji: {
		allowed: "<a:spinning_dollar:1010100837881741323>",
		default: ":moneybag:"
	},
	timer_emoji: {
		allowed: "<a:alarm_on:1010100842487095357>",
		default: ":alarm_clock:"
	},
	shop_emoji: {
		allowed: ":shopping_cart:",
		default: ":shopping_cart:"
	},
	vp_emoji_name: "ValorantPoints",
	rp_emoji_name: "RadianitePoints",
	kc_emoji_name: "KingdomCredits",
	dl_emoji_name: "DiscordLoader"


}