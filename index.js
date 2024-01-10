const { fork, spawn } = require("child_process");

const bot = fork(__dirname + "/bot.js");

bot.on("message", async (message) => {
	if (message.status === 429) {
		const shell = spawn("bash", [__dirname + "/main.sh"], {
			shell: true,
			env: { status: message.status },
		});
		shell.on("close", (code) => {
			if (code) {
				console.log(`shell exited with code ${code}`);
			}
		});
		shell.on("error", (err) => {
			console.error("Failed to start subprocess.");
		});
	}
});

