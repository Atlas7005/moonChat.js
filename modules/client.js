var Socket = require("./socket");
var Rest = require("./rest");

module.exports = class Client {
	constructor(options = {}) {
		this.options = options;

		this.connected = false;
		this.id = null;
		this.room = null;
	};

	connect(id = this.id, room = this.room, cb = null) {
		if(id) {
			this.id = id;
			if(room) {
				this.room = room;
				this.connected = true;
				this.getPrivateUser(this.id, body => {
					Socket.load(cb == null ? null : cb);
				});
			} else {
				cb(new Error("Missing room parameter"));
			}
		} else {
			cb(new Error("Missing id parameter"));
		}
	};

	onMessage(room = this.room, cb = null) {
		Socket.onMessage(room, cb == null ? null : cb);
	};

	onAdmin(room = this.room, cb = null) {
		Socket.onAdmin(room, cb == null ? null : cb);
	};

	sendMessage(message, cb = null) {
		Rest.sendMessage(this.id, this.room, message, cb == null ? null : cb);
	};

	getPublicUser(name) {
		return Rest.getPublicUser(name, body => {
			return body;
		});
	};

	getPrivateUser(id = this.id) {
		return Rest.getPrivateUser(id, body => {
			return body;
		});
	};
};