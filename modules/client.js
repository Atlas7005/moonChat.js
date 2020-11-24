var EventEmitter = require("eventemitter3");
var Socket = require("./socket");

module.exports = class Client {
	constructor(options = {}) {
		this.options = options;

		this.connected = false;
	};

	connect(id = this.options.id, room = this.options.room, cb) {
		if(id) {
			if(room) {
				this.connected = true;
				Socket.load(cb());
			} else {
				cb(new Error("Missing room parameter"));
			}
		} else {
			cb(new Error("Missing id parameter"));
		}
	};

	onMessage(room, cb) {
		Socket.onMessage(room, cb);
	};

	onAdmin(room, cb) {
		Socket.onAdmin(room, cb);
	};
};