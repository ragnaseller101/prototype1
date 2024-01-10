const { PlayerCards } = require("../../models/database");
const { fetch } = require("../utilities");

const getPlayerCardsList = async () => {
    // console.log("Clearing player cards list...");
    await PlayerCards.clear();
    // console.log("Cleared player cards list!!!");
    // console.log("Fetching valorant player cards list...");

    const req = await fetch("https://valorant-api.com/v1/playercards");
    console.assert(req.statusCode === 200, `Valorant player cards status code is ${req.statusCode}!`, req);

    const json = JSON.parse(req.body);
    console.assert(json.status === 200, `Valorant player cards data status code is ${json.status}!`, json);

    let playerCards = [];
    for(const playerCard of json.data) {
        playerCards.push({
            uuid: playerCard.uuid,
            name: playerCard.displayName,
            smallIcon: playerCard.smallArt,
            wideIcon: playerCard.wideArt,
            largeIcon: playerCard.largeArt
        });
    }
    // console.log("Inserting player cards...")
    await PlayerCards.insertMany(playerCards);
    // console.log("Player cards inserted!!!")
}

module.exports = {
    getPlayerCardsList
}