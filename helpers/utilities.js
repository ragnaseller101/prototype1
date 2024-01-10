const https = require("https")

const tlsCiphers = [
    'TLS_CHACHA20_POLY1305_SHA256',
    'TLS_AES_128_GCM_SHA256',
    'TLS_AES_256_GCM_SHA384',
    'ECDHE-ECDSA-CHACHA20-POLY1305',
    'ECDHE-RSA-CHACHA20-POLY1305',
    'ECDHE-ECDSA-AES128-SHA256',
    'ECDHE-RSA-AES128-SHA256',
    'ECDHE-ECDSA-AES256-GCM-SHA384',
    'ECDHE-RSA-AES256-GCM-SHA384',
    'ECDHE-ECDSA-AES128-SHA',
    'ECDHE-RSA-AES128-SHA',
    'ECDHE-ECDSA-AES256-SHA',
    'ECDHE-RSA-AES256-SHA',
    'RSA-PSK-AES128-GCM-SHA256',
    'RSA-PSK-AES256-GCM-SHA384',
    'RSA-PSK-AES128-CBC-SHA',
    'RSA-PSK-AES256-CBC-SHA',
];

const tlsSigAlgs = [
    'ecdsa_secp256r1_sha256',
    'rsa_pss_rsae_sha256',
    'rsa_pkcs1_sha256',
    'ecdsa_secp384r1_sha384',
    'rsa_pss_rsae_sha384',
    'rsa_pkcs1_sha384',
    'rsa_pss_rsae_sha512',
    'rsa_pkcs1_sha512',
    'rsa_pkcs1_sha1',
]

const fetch = (url, options = {}) => {
    //if(config.logUrls) console.log("Fetching url " + url.substring(0, 200) + (url.length > 200 ? "..." : ""));

    return new Promise((resolve, reject) => {
        const req = https.request(url, {
            agent: options.proxy,
            method: options.method || "GET",
            headers: {
                cookie: "dummy=cookie", // set dummy cookie, helps with cloudflare 1020
                "Accept-Language": "en-US,en;q=0.5", // same as above
                "referer": "https://github.com/giorgi-o/SkinPeek", // to help other APIs (e.g. Spirit's) see where the traffic is coming from
                ...options.headers
            },
            ciphers: tlsCiphers.join(':'),
            sigalgs: tlsSigAlgs.join(':'),
            minVersion: "TLSv1.3",
        }, resp => {
            const res = {
                statusCode: resp.statusCode,
                headers: resp.headers
            };
            let chunks = [];
            resp.on('data', (chunk) => chunks.push(chunk));
            resp.on('end', () => {
                res.body = Buffer.concat(chunks).toString(options.encoding || "utf8");
                resolve(res);
            });
            resp.on('error', err => {
                console.error(err);
                reject(err);
            });
        });
        req.write(options.body || "");
        req.end();
        req.on('error', err => {
            console.error(err);
            reject(err);
        });
    });
}

const extractTokensFromUri = (uri) => {
    // thx hamper for regex
    const [, accessToken, idToken] = uri.match(/access_token=((?:[a-zA-Z]|\d|\.|-|_)*).*id_token=((?:[a-zA-Z]|\d|\.|-|_)*).*expires_in=(\d*)/);
    return [accessToken, idToken]
}

const parseSetCookie = (setCookie) => {
    const cookies = {};
    for (const cookie of setCookie) {
        const sep = cookie.indexOf("=");
        cookies[cookie.slice(0, sep)] = cookie.slice(sep + 1, cookie.indexOf(";"));
    }
    return cookies;
}

const stringifyCookies = (cookies) => {
    const cookieList = [];
    for (let [key, value] of Object.entries(cookies)) {
        cookieList.push(key + "=" + value);
    }
    return cookieList.join("; ");
}

const tokenExpiry = (token) => {
    return decodeToken(token).exp * 1000;
}

const defer = async (interaction, ephemeral = false) => {
    // discord only sets deferred to true once the event is sent over ws, which doesn"t happen immediately
    await interaction.deferReply({ ephemeral });
    interaction.deferred = true;
}

const decodeToken = (token) => {
    const encodedPayload = token.split('.')[1];
    return JSON.parse(atob(encodedPayload));
}
const isMaintenance = (json) => {
    return json.httpStatus === 403 && json.errorCode === "SCHEDULED_DOWNTIME";
}

function isYesterday(date) {
    if (!date) return false;
    const yesterday = new Date();
    yesterday.setMinutes(yesterday.getMinutes() + 480 + ((yesterday.getTimezoneOffset() == 0) ? 0 : yesterday.getTimezoneOffset()));
    yesterday.setDate(yesterday.getDate() - 1);
    if (yesterday.toDateString() === date.toDateString()) return true;
    return false;
}

function isLastWeek(date) {
    if (!date) return false;
    const yesterday = new Date();
    yesterday.setMinutes(yesterday.getMinutes() + 480 + ((yesterday.getTimezoneOffset() == 0) ? 0 : yesterday.getTimezoneOffset()));
    yesterday.setDate(yesterday.getDate() - 7);
    if (yesterday.toDateString() === date.toDateString()) return true;
    return false;
}

function setDateToYesterday(date) {
    if (!date) return new Date(0);
    const yesterday = date;
    yesterday.setMinutes(yesterday.getMinutes() + 480 + ((yesterday.getTimezoneOffset() == 0) ? 0 : yesterday.getTimezoneOffset()));
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
}

function setDateToLastWeek(date) {
    if (!date) return new Date(0);
    const currentDayOfWeek = date.getDay();
    let daysToSubtract = (currentDayOfWeek + 7 - 3) % 7;

    if (daysToSubtract == 0) {
        daysToSubtract = 7;
    }

    const lastWednesday = date;
    lastWednesday.setMinutes(lastWednesday.getMinutes() + 480 + ((lastWednesday.getTimezoneOffset() == 0) ? 0 : lastWednesday.getTimezoneOffset()));
    lastWednesday.setDate(lastWednesday.getDate() - daysToSubtract);
    return lastWednesday;
}

function getDateToday() {
    const today = new Date();
    today.setMinutes(today.getMinutes() + 480 + ((today.getTimezoneOffset() == 0) ? 0 : today.getTimezoneOffset()));
    return today;
}

const getCurrentHour = () => {
    let today = getDateToday();
    return today.getHours();
}

const endsWithNumber = (str) => {
    return /[0-9]+$/.test(str);
}

const getNumberAtEnd = (str) => {
    if (endsWithNumber(str)) return Number(str.match(/[0-9]+$/)[0]);
    return null;
}

module.exports = {
    fetch,
    extractTokensFromUri,
    parseSetCookie,
    stringifyCookies,
    tokenExpiry,
    defer,
    isMaintenance,
    isYesterday,
    isLastWeek,
    setDateToYesterday,
    setDateToLastWeek,
    getDateToday,
    getCurrentHour,
    endsWithNumber,
    getNumberAtEnd
}
