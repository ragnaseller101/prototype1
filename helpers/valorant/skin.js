const { Skins, Prices } = require("../../models/database");
const { fetch } = require("../utilities");

const getSkinList = async () => {
	// console.log("Clearing skins list...");
	await Skins.clear();
	// console.log("Cleared skins list!!!");
	// console.log("Fetching valorant skin list...");

	const req = await fetch("https://valorant-api.com/v1/weapons/skins");
	console.assert(req.statusCode === 200, `Valorant skins status code is ${req.statusCode}!`, req);

	const json = JSON.parse(req.body);
	console.assert(json.status === 200, `Valorant skins data status code is ${json.status}!`, json);

	let skins = [];
	for (const skin of json.data) {
		const levelOne = skin.levels[0];
		skins.push({
			uuid: levelOne.uuid,
			name: skin.displayName,
			icon: levelOne.displayIcon,
			rarity: skin.contentTierUuid
		});
	}
	// console.log("Inserting skins...")
	await Skins.insertMany(skins);
	// console.log("Skins inserted!!!")
}

const getSkinWithPrice = async (uuid) => {

	let skin = await Skins.findOne({ uuid: uuid });

	if (!skin) return null;

	value = await Prices.findOne({ uuid: uuid });
	skin.price = value.price;

	return skin;
}

const getSkinRarity = async (uuid) => {

	let skin = await Skins.findOne({ uuid: uuid });

	return skin ? skin.rarity : null;
}
module.exports = {
	getSkinList,
	getSkinWithPrice,
	getSkinRarity
}