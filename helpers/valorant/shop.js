const { authUser } = require("../valorant/auth");
const { renderOffers, renderAccessoryOffers, renderNightMarket } = require("../discord/embed");
const { ValorantPointsEmoji, KingdomCreditsEmoji } = require("../discord/emoji");
const { externalEmojisAllowed } = require("../discord/permissions");
const { fetch, isMaintenance } = require("../utilities");
const { loadData } = require("./data");

const fetchShop = async (channel, user, shopCommand) => {
    await loadData();
    const response = await getOffers(user);
    const VpEmoji = await ValorantPointsEmoji(channel, externalEmojisAllowed(channel));
    return await renderOffers(channel.guild, response, user, VpEmoji, shopCommand);
}

const fetchAccessoryShop = async (channel, user, shopCommand) => {
    await loadData();
    const response = await getOffers(user);
    const KcEmoji = await KingdomCreditsEmoji(channel, externalEmojisAllowed(channel));
    return await renderAccessoryOffers(channel.guild, response, user, KcEmoji, shopCommand);
}

const fetchNightMarket = async (channel, user) => {
    await loadData();
    const response = await getOffers(user);
    const VpEmoji = await ValorantPointsEmoji(channel, externalEmojisAllowed(channel));
    return await renderNightMarket(channel.guild, response, user, VpEmoji);
}

const getOffers = async (user) => {
    const authSuccess = await authUser(user);
    if (authSuccess.user) user = authSuccess.user;

    if(!authSuccess.success) return authSuccess;
    
    // console.log(`Fetching shop for ${user.username}...`);

    // https://github.com/techchrism/valorant-api-docs/blob/trunk/docs/Store/GET%20Store_GetStorefrontV2.md
    const req = await fetch(`https://pd.${user.region}.a.pvp.net/store/v2/storefront/${user.puuid}`, {
        headers: {
            "Authorization": "Bearer " + user.auth.rso,
            "X-Riot-Entitlements-JWT": user.auth.ent
        }
    });
    console.assert(req.statusCode === 200, `Valorant skins offers code is ${req.statusCode}!`, req);

    const json = JSON.parse(req.body);
    
    if(json.httpStatus === 400 && json.errorCode === "BAD_CLAIMS") return {success: false}
    else if(isMaintenance(json)) return {success: false, maintenance: true};

    return {success: true, shop: json};
}

module.exports = {
    fetchShop,
    fetchAccessoryShop,
    fetchNightMarket,
    getOffers
}
