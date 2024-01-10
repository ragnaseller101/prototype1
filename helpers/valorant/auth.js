const { fetch, extractTokensFromUri, parseSetCookie, stringifyCookies, tokenExpiry, setDateToYesterday, setDateToLastWeek } = require("../utilities");
const { Users, ValorantVersion } = require("../../models/database");
// const userAgent = "RiotClient/release-07.02-shipping-19-935635.1234567 rso-auth (Windows;10;;Professional, x64)";

const redeemUsernamePassword = async (id, login, password) => {
	const version = await ValorantVersion.get();
	// prepare cookies for auth request
	const req1 = await fetch("https://auth.riotgames.com/api/v1/authorization", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"user-agent": `RiotClient/${version.riotClientVersion}.1234567 rso-auth (Windows;10;;Professional, x64)`
		},
		body: JSON.stringify({
			"client_id": "play-valorant-web-prod",
			"response_type": "token id_token",
			"redirect_uri": "https://playvalorant.com/opt_in",
			"scope": "account openid",
			"nonce": "1",
		})
	});
	console.assert(req1.statusCode === 200, `Auth Request Cookies status code is ${req1.statusCode}!`, req1);

	const setCookieHeader = req1.headers["set-cookie"];
	let cookies = {};
	if (setCookieHeader) {
		cookies = parseSetCookie(setCookieHeader);
	}
	else {
		console.error("Riot didn't return any cookies during the auth request! Cloudflare might have something to do with it...");
		console.error(req1);
	}

	// get access token
	const req2 = await fetch("https://auth.riotgames.com/api/v1/authorization", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"user-agent": `RiotClient/${version.riotClientVersion}.1234567 rso-auth (Windows;10;;Professional, x64)`,
			"cookie": stringifyCookies(cookies)
		},
		body: JSON.stringify({
			"type": "auth",
			"username": login,
			"password": password,
			"remember": true
		})
	});
	console.assert(req2.statusCode === 200, `Auth status code is ${req2.statusCode}!`, req2);

	if (req2.statusCode === 429) return { success: false, rateLimit: true };

	cookies = { 
		...cookies, 
		...parseSetCookie(req2.headers["set-cookie"]) 
	};

	const json2 = JSON.parse(req2.body);
	if (json2.type === "error") {
		if (json2.error === "auth_failure") console.error("Authentication failure!", json2);
		else console.error("Unknown auth error!", JSON.stringify(json2, null, 2));
		return { success: false };
	}

	if (json2.type === "response") {
		const user = await processAuthResponse(id, { login, password, cookies }, json2);
		return { success: true, user: user };
	}

	return { success: false };
}

const authUser = async (user) => {
	// doesn't check if token is valid, only checks it hasn't expired
	if (!user || !user.auth || !user.auth.rso) return { success: false };

	const rsoExpiry = tokenExpiry(user.auth.rso);

	if (rsoExpiry - Date.now() > 10_000) return { success: true };

	return await refreshToken(user);
}

const refreshToken = async (user) => {
	// console.log(`Refreshing ${user.username}'s token...`);
	let response = { success: false }

	if (!user) return response;

	if (!response.success && user.auth.login && user.auth.password) response = await redeemUsernamePassword(user.id, user.auth.login, user.auth.password);

	if (!response.success && !response.rateLimit) return { success: false };
	
	return response;
}

const processAuthResponse = async (id, authData, resp, user = null) => {
	if (!user) {
		user = {
			id: id,
			puuid: "",
			auth: {},
			username: "",
			region: ""
		};
	}

	const [rso, idt] = extractTokensFromUri(resp.response.parameters.uri);
	user.auth = {
		...user.auth,
		rso: rso,
		idt: idt,
	};

	user.auth.login = authData.login;
	user.auth.password = authData.password;

	// get user info
	const userInfo = await getUserInfo(user);
	user.puuid = userInfo.puuid;
	user.username = userInfo.username;

	// get entitlements token
	user.auth.ent = await getEntitlements(user);

	// get region
	user.region = await getRegion(user);

	return user;
}

const getUserInfo = async (user) => {
	const req = await fetch("https://auth.riotgames.com/userinfo", {
		headers: {
			"Authorization": "Bearer " + user.auth.rso
		}
	});
	console.assert(req.statusCode === 200, `User info status code is ${req.statusCode}!`, req);

	const json = JSON.parse(req.body);

	if (json.acct) return { puuid: json.sub, username: json.acct.game_name + "#" + json.acct.tag_line }
}

const getEntitlements = async (user) => {
	const req = await fetch("https://entitlements.auth.riotgames.com/api/token/v1", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + user.auth.rso
		}
	});
	console.assert(req.statusCode === 200, `Auth status code is ${req.statusCode}!`, req);

	const json = JSON.parse(req.body);
	return json.entitlements_token;
}

const getRegion = async (user) => {
	const req = await fetch("https://riot-geo.pas.si.riotgames.com/pas/v1/product/valorant", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + user.auth.rso
		},
		body: JSON.stringify({
			"id_token": user.auth.idt,
		})
	});
	console.assert(req.statusCode === 200, `PAS token status code is ${req.statusCode}!`, req);

	const json = JSON.parse(req.body);
	return json.affinities.live;
}

module.exports = {
	redeemUsernamePassword,
	authUser
}
