const { authUser } = require("../valorant/auth");
const { fetch, isMaintenance } = require("../utilities");
const { ValorantPointsEmoji, RadianitePointsEmoji, KingdomCreditsEmoji } = require("../discord/emoji");
const { externalEmojisAllowed } = require("../discord/permissions");
const { renderBalance } = require("../discord/embed");

const fetchBalance = async (channel, user) => {
	const balance = await getBalance(user);
	const VpEmoji = await ValorantPointsEmoji(channel, externalEmojisAllowed(channel));
	const RpEmoji = await RadianitePointsEmoji(channel, externalEmojisAllowed(channel));
	const KcEmoji = await KingdomCreditsEmoji(channel, externalEmojisAllowed(channel));
	return await renderBalance(channel.guild, balance, user, VpEmoji, RpEmoji, KcEmoji);
}

const getBalance = async (user) => {
	const authSuccess = await authUser(user);
	if (authSuccess.user) user = authSuccess.user;

	if (!authSuccess.success) return authSuccess;

	// console.log(`Fetching balance for ${user.username}...`);

	// https://github.com/techchrism/valorant-api-docs/blob/trunk/docs/Store/GET%20Store_GetWallet.md
	const req = await fetch(`https://pd.${user.region}.a.pvp.net/store/v1/wallet/${user.puuid}`, {
		headers: {
			"Authorization": "Bearer " + user.auth.rso,
			"X-Riot-Entitlements-JWT": user.auth.ent
		}
	});
	console.assert(req.statusCode === 200, `Valorant balance code is ${req.statusCode}!`, req);

	const json = JSON.parse(req.body);
	if (json.httpStatus === 400 && json.errorCode === "BAD_CLAIMS") return { success: false };
	else if (isMaintenance(json)) return { success: false, maintenance: true };

	return {
		success: true,
		vp: json.Balances["85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741"],
		rad: json.Balances["e59aa87c-4cbf-517a-5983-6e81511be9b7"],
		kc: json.Balances["85ca954a-41f2-ce94-9b45-8ca3dd39a00d"]
	};
}

module.exports = {
	fetchBalance
}