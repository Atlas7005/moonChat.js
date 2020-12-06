var SIO = require("socket.io-client");
	
module.exports.Socket = class Socket {
	constructor() {
		this.socket = SIO("https://chat.twplayer.co");
	};

	unload(cb = null) {
		this.socket.close();
		this.socket = null;
		cb == null ? null : cb();
	};

	onMessage(room, cb = null) {
		if(this.socket == null) {
			cb(new Error("Socket not loaded."));
		} else {
			this.socket.on(`${room}-message`, (sender, message, color) => cb == null ? null : cb(sender.replace(/<[^>]*>?/gm, ""), message, color));
		}
	};

	onAdmin(room, cb = null) {
		if(this.socket == null) {
			cb(new Error("Socket not loaded."));
		} else {
			this.socket.on(`${room}-admin`, cb == null ? null : cb);
		}
	};

};