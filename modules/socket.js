var SIO = require("socket.io-client");
	
module.exports = {
	load(cb = null) {
		this.socket = SIO("https://chat.twplayer.co");
		cb == null ? null : cb();
	},

	onMessage(room, cb = null) {
		if(this.socket == null) {
			cb(new Error("Socket not loaded."));
		} else {
			this.socket.on(`${room}-message`, cb == null ? null : cb);
		}
	},

	onAdmin(room, cb = null) {
		if(this.socket == null) {
			cb(new Error("Socket not loaded."));
		} else {
			this.socket.on(`${room}-admin`, cb == null ? null : cb);
		}
	}
};