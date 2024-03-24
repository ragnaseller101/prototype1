module.exports = {
	name: "error",
	execute(error) {
		console.error(`client's WebSocket encountered a connection error: ${error}`);
	},
}