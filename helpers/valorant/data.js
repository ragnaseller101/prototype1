const { ValorantVersion } = require("../../models/database");
const { getSkinList } = require("./skin");
const { getPrices } = require("./price");
const { getBuddiesList } = require("./buddy");
const { getPlayerCardsList } = require("./playercard");
const { getPlayerTitlesList } = require("./playertitle");
const { getSpraysList } = require("./spray");
const { getValorantVersion } = require("./version");

const loadData = async () => {
    const versionDatabase = await ValorantVersion.get();
    const versionApi = await getValorantVersion();
    if (versionDatabase.manifestId !== versionApi.manifestId) {
        console.log("Version is different. Updating database...");
        await ValorantVersion.update({}, {manifestId: versionApi.manifestId, riotClientVersion: versionApi.riotClientVersion});
        await getSkinList();
        await getPrices();
        await getBuddiesList();
        await getPlayerCardsList();
        await getPlayerTitlesList();
        await getSpraysList();
        console.log("Data refreshed!")
    }
}

module.exports = {
    loadData 
}