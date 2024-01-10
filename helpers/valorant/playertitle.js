const { PlayerTitles } = require("../../models/database");
const { fetch } = require("../utilities");

const getPlayerTitlesList = async () => {
    // console.log("Clearing player titles list...");
    await PlayerTitles.clear();
    // console.log("Cleared player titles list!!!");
    // console.log("Fetching valorant player titles list...");

    const req = await fetch("https://valorant-api.com/v1/playertitles");
    console.assert(req.statusCode === 200, `Valorant player cards status code is ${req.statusCode}!`, req);

    const json = JSON.parse(req.body);
    console.assert(json.status === 200, `Valorant player cards data status code is ${json.status}!`, json);

    let playerTitles = [];
    for(const playerTitle of json.data) {
        playerTitles.push({
            uuid: playerTitle.uuid,
            name: playerTitle.displayName,
            titleText: playerTitle.titleText,
            icon: "https://valorantinfo.com/images/us/tear-jerker-title_valorant_icon_56925.webp"
        });
    }
    // console.log("Inserting titles cards...")
    await PlayerTitles.insertMany(playerTitles);
    // console.log("Player titles inserted!!!")
}

module.exports = {
    getPlayerTitlesList
}