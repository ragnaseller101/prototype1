const { client_id, log_channel } = require("../config");
const { deployCommands, undeployCommands, bot } = require("../helpers/discord/commands");
module.exports = {
	name: "messageCreate",
	async execute(message) {
		content = message.content
		if (message.author.id === client_id) return;

		if (message.author.id === "569754110610505758") {
			if (content === "!deploy guild") await deployCommands.guild(message);

			else if(content === "!deploy global") await deployCommands.global(message);

			else if (content === "!undeploy guild") await undeployCommands.guild(message);

			else if (content === "!undeploy global") await undeployCommands.global(message);
			
			else if (content === "!bot servers") await bot.server(message);

			else if (content === "!bot change version") await bot.changeVersion(message);

			// else if (content === "!resend") await resendOldClips(message);
		}

		// if (content.includes("https://outplayed.tv/media/")) await resendToThread(message);
	},
}

// const resendToThread = async (message) => {
// 	if (message.channel.id === "992516236158181446") {
// 		const thread = message.channel.threads.cache.find((x) => x.name === 'party-b-clips');
// 		if (thread) {
// 			let content = `**${message.author.tag}** — <t:${(Math.floor(message.createdTimestamp / 1000))}:R>\n${message.content}\n`;
// 			await thread.send(content);
// 		}
// 		else {
// 			const log = await message.client.channels.fetch(log_channel);
// 			await log.send(`Unable to resend clip for ${message.author.tag}!`);
// 		}
// 	}
// }
// const resendOldClips = async (message) => {
// 	let channel = message.channel;
// 	const thread = message.channel.threads.cache.find((x) => x.name === 'party-b-clips');
// 	let messages = [];
  
// 	// Create message pointer
// 	let pointer = await channel.messages.fetch({ limit: 1 }).then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));
  
// 	while (pointer) {
// 	  await channel.messages.fetch({ limit: 100, before: pointer.id }).then(messagePage => {
// 		  messagePage.forEach(msg => { if (msg.content.includes("https://outplayed.tv/media/")) messages.push(msg);});

// 		  // Update our message pointer to be last message in page of messages
// 		  pointer = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
// 		});
// 	}
// 	messages.reverse();
// 	for (let i = 0; i < messages.length; i++) {
// 		let content = "";
// 		if (messages[i].content.startsWith(':mryuui — ')) {
// 			let date = new Date(messages[i].content.slice(10,21));
// 			content += `**mryuui#1715** — <t:${(Math.floor(date / 1000))}:R>\n${messages[i].content.slice(21)}\n`;
// 		}
// 		else if (messages[i].content.startsWith('meowri — ')) {
// 			let date = new Date(messages[i].content.slice(9,20));
// 			content += `**meowri#3348** — <t:${(Math.floor(date / 1000))}:R>\n${messages[i].content.slice(20)}\n`;
// 		}
// 		else {
// 			content += `**${messages[i].author.tag}** — <t:${(Math.floor(messages[i].createdTimestamp / 1000))}:R>\n${messages[i].content}\n`;
// 		}
// 		await thread.send(content);
// 	}
// }