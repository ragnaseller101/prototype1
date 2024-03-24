const { fetch } = require("../utilities");

const getValorantVersion = async () => {
	// console.log("Fetching current valorant version...");

	const req = await fetch("https://valorant-api.com/v1/version");
	console.assert(req.statusCode === 200, `Valorant version status code is ${req.statusCode}!`, req);

	const json = JSON.parse(req.body);
	console.assert(json.status === 200, `Valorant version data status code is ${json.status}!`, json);

	return json.data;
}

module.exports = {
	getValorantVersion
}