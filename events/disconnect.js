module.exports = {
	name: "disconnect",
	execute(event) {
        console.log("The WebSocket has closed and will no longer attempt to reconnect");
	},
}