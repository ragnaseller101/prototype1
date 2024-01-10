const { Buddies } = require("../../models/database");
const { fetch } = require("../utilities");

const getBuddiesList = async () => {
    // console.log("Clearing buddies list...");
    await Buddies.clear();
    // console.log("Cleared buddies list!!!");
    // console.log("Fetching valorant buddies list...");

    const req = await fetch("https://valorant-api.com/v1/buddies");
    console.assert(req.statusCode === 200, `Valorant buddies status code is ${req.statusCode}!`, req);

    const json = JSON.parse(req.body);
    console.assert(json.status === 200, `Valorant buddies data status code is ${json.status}!`, json);

    let buddies = [];
    for(const buddy of json.data) {
        const levelOne = buddy.levels[0];
        buddies.push({
            uuid: levelOne.uuid,
            name: buddy.displayName,
            icon: levelOne.displayIcon,
        });
    }
    // console.log("Inserting buddies...")
    await Buddies.insertMany(buddies);
    // console.log("Buddies inserted!!!")
}

module.exports = {
    getBuddiesList
}