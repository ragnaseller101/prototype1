
const DELUXE = {
    uuid: "0cebb8be-46d7-c12a-d306-e9907bfc5a25",
    name: "Deluxe",
    color: 0x009C84,
    icon: "https://media.valorant-api.com/contenttiers/0cebb8be-46d7-c12a-d306-e9907bfc5a25/displayicon.png"
}
const EXCLUSIVE = {
    uuid: "e046854e-406c-37f4-6607-19a9ba8426fc",
    name: "Exclusive",
    color: 0xFA9459,
    icon: "https://media.valorant-api.com/contenttiers/e046854e-406c-37f4-6607-19a9ba8426fc/displayicon.png"
}
const PREMIUM = {
    uuid: "60bca009-4182-7998-dee7-b8a2558dc369",
    name: "Premium",
    color: 0xD1548C,
    icon: "https://media.valorant-api.com/contenttiers/60bca009-4182-7998-dee7-b8a2558dc369/displayicon.png"
}
const SELECT = {
    uuid: "12683d76-48d7-84a3-4e09-6985794f0445",
    name: "Select",
    color: 0x5B9FE1,
    icon: "https://media.valorant-api.com/contenttiers/12683d76-48d7-84a3-4e09-6985794f0445/displayicon.png"
}
const ULTRA = {
    uuid: "411e4a55-4e59-7757-41f0-86a53f101bb5",
    name: "Ultra",
    color: 0xFAD763,
    icon: "https://media.valorant-api.com/contenttiers/411e4a55-4e59-7757-41f0-86a53f101bb5/displayicon.png"
}

const getRarity = (uuid) => {
    switch(uuid) {
        case DELUXE.uuid: return DELUXE;
        case EXCLUSIVE.uuid: return EXCLUSIVE;
        case PREMIUM.uuid: return PREMIUM;
        case SELECT.uuid: return SELECT;
        case ULTRA.uuid: return ULTRA;
        default: return null;
    }
}


module.exports = {
    getRarity
}