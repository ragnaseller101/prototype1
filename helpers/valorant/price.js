const { Users, Prices } = require("../../models/database");
const { authUser } = require("./auth");
const { fetch, isMaintenance } = require("../utilities");

const getPrices = async (user=null) => {
    // if no ID is passed, try with all users
    if(user === null) {
        const data = await Users.find();
        for(const temp of data[0].users) {
            if(!temp || !temp.auth) continue;
            const success = await getPrices(temp);
            if(success) return true;
        }
        return false;
    }

    if(!user) return false;

    const authSuccess = await authUser(user);

    if (authSuccess.user) user = authSuccess.user;

    if(!authSuccess.success || !user.auth.rso || !user.auth.ent || !user.region) return false;

    // console.log("Clearing prices list...");
    await Prices.clear();
    // console.log("Cleared prices list!!!");

    // console.log(`Fetching skin prices using ${user.username}'s access token...`);

    // https://github.com/techchrism/valorant-api-docs/blob/trunk/docs/Store/GET%20Store_GetOffers.md
    const req = await fetch(`https://pd.${user.region}.a.pvp.net/store/v1/offers/`, {
        headers: {
            "Authorization": "Bearer " + user.auth.rso,
            "X-Riot-Entitlements-JWT": user.auth.ent
        }
    });
    console.assert(req.statusCode === 200, `Valorant skins prices code is ${req.statusCode}!`, req);

    const json = JSON.parse(req.body);
    
    if(json.httpStatus === 400 && json.errorCode === "BAD_CLAIMS") return false; // user rso is invalid, should we delete the user as well?
    else if(isMaintenance(json)) return false;

    let prices = [];
    for(const offer of json.Offers) {
        prices.push({
            uuid: offer.OfferID,
            price: offer.Cost[Object.keys(offer.Cost)[0]]
        })
    }

    // console.log("Inserting prices...")
    await Prices.insertMany(prices);
    // console.log("Prices inserted!!!")
    return true;
}


module.exports = {
    getPrices
}