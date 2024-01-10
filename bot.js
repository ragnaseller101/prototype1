const fs = require("node:fs");
const { Client, Collection, Intents } = require("discord.js");
const { token } = require("./config");

// initialize client
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Collection();
client.menus = new Collection();

// commands
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require("./commands/" + file);
    client.commands.set(command.data.name, command);
}

// menus
const menuFiles = fs.readdirSync("./menus").filter(file => file.endsWith(".js"));
for (const file of menuFiles) {
    const menu = require("./menus/" + file);
    client.menus.set(menu.data.name, menu);
}

// events
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of eventFiles) {
    const event = require("./events/" + file);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

console.log("Bot client logging in...");
client.login(token);