var SIO = require("socket.io-client");
var EventEmitter = require("eventemitter3");
	
module.exports = {
	load(cb = null) {
		this.socket = SIO("https://chat.twplayer.co");
		cb();
	},

	onMessage(room, cb) {
		if(this.socket == null) {
			cb(new Error("Socket not loaded."));
		} else {
			this.socket.on(`${room}-message`, cb);
		}
	},

	onAdmin(room, cb) {
		if(this.socket == null) {
			cb(new Error("Socket not loaded."));
		} else {
			this.socket.on(`${room}-admin`, cb);
		}
	}
};