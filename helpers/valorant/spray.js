const { Sprays } = require("../../models/database");
const { fetch } = require("../utilities");

const getSpraysList = async () => {
    // console.log("Clearing sprays list...");
    await Sprays.clear();
    // console.log("Cleared sprays list!!!");
    // console.log("Fetching valorant sprays list...");

    const req = await fetch("https://valorant-api.com/v1/sprays");
    console.assert(req.statusCode === 200, `Valorant sprays status code is ${req.statusCode}!`, req);

    const json = JSON.parse(req.body);
    console.assert(json.status === 200, `Valorant sprays data status code is ${json.status}!`, json);

    let sprays = [];
    for(const spray of json.data) {
        sprays.push({
            uuid: spray.uuid,
            name: spray.displayName,
            displayIcon: spray.displayIcon,
            fullIcon: spray.fullTransparentIcon,
            animatedIcon: spray.animationPng
        });
    }
    // console.log("Inserting sprays...")
    await Sprays.insertMany(sprays);
    // console.log("Sprays inserted!!!")
}

module.exports = {
    getSpraysList
}