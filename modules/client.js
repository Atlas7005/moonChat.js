var { Socket } = require("./socket");
var Rest = require("./rest");

/**
 * Initialize the client.
 * @name Client
 * @class
 * @example
 * var { Client } = require("moonchat.js");
 * var client = new Client();
 */
module.exports = class Client {
	constructor() {
		this.connected = false;
		this.id = null;
		this.room = null;

		this.socket = null;
	};

	_exit() {
		if(this !== null) {
			this.leave(this.id, this.room);
		}
	};

	/**
	 * @callback callback
	 * @param {(Object|Error)} response
	 */

	/**
	 * @function Client#connect
	 * @param {String} id - The id of the client user.
	 * @param {String} room - The room name.
	 * @param {callback} cb - The callback that handles the user/error.
	 * @example
	 * var { Client } = require("moonchat.js");
	 * var client = new Client();
	 * client.connect("SomeIdIDontEvenKnowTBH", "room", resp => {
	 *     console.log(resp); // resp will be a user if the user is found, else an error is returned.
	 * });
	 */
	connect(id, room, cb = null) {
		if(id) {
			if(room) {
				this.id = id;
				this.room = room;
				this.connected = true;
				this.socket = new Socket();
				this.getPrivateUser(this.id, body => cb == null ? null : cb(body.user));
				this.join(this.id, this.room);
				process.on("exit", this._exit.bind(null));
				process.on("SIGINT", this._exit.bind(null));
				process.on("SIGUSR1", this._exit.bind(null));
				process.on("SIGUSR2", this._exit.bind(null));
				process.on("uncaughtException", this._exit.bind(null));
			} else {
				cb(new Error("Missing room parameter"));
			}
		} else {
			cb(new Error("Missing id parameter"));
		}
	};

	/**
	 * @function Client#disconnect
	 * @param {callback} cb - The callback called when disconnected.
	 */
	disconnect(cb = null) {
		this.leave(this.id, this.room, () => {
			this.connected = false;
			this.id = null;
			this.room = null;
			this.socket.unload(() => cb == null ? null : cb());
		});
	};

	/**
	 * @function Client#onMessage
	 * @param {String} room - The room name to listen for.
	 * @param {callback} cb - The callback called when message is received.
	 */
	onMessage(room = this.room, cb = null) {
		this.socket.onMessage(room, cb == null ? null : cb);
	};

	/**
	 * @function Client#onAdmin
	 * @param {String} room - The room name to listen for.
	 * @param {callback} cb - The callback called when message is received.
	 */
	onAdmin(room = this.room, cb = null) {
		this.socket.onAdmin(room, cb == null ? null : cb);
	};

	/**
	 * @function Client#sendMessage
	 * @param {String} room - The room to send a message in.
	 * @param {String} message - The message to send.
	 * @param {callback} cb - The callback with either an error or response object.
	 * @example
	 * var { Client } = require("moonchat.js");
	 * var client = new Client();
	 * client.connect("SomeIdIDontEvenKnowTBH", "room", resp => {
	 *     if(resp.name != null) {
	 *         client.sendMessage("room", "some message", res => {
	 *             if(res.msg) {
	 *                 console.log(`sent message "${res.msg}"`);
	 *             }
	 *         });
	 *     }
	 * });
	 */
	sendMessage(room = this.room, message, cb = null) {
		Rest.sendMessage(this.id, room, message, cb == null ? null : cb);
	};

	/**
	 * @function Client#getPublicUser
	 * @param {String} name - The name of the user you wanna get information about.
	 * @param {callback} cb - The callback with either an error or the user information.
	 */
	getPublicUser(name, cb = null) {
		Rest.getPublicUser(name, cb == null ? null : cb);
	};

	/**
	 * @function Client#getPrivateUser
	 * @param {String} id - The id of the user you wanna get information about.
	 * @param {callback} cb - The callback with either an error or the user information.
	 */
	getPrivateUser(id = this.id, cb = null) {
		Rest.getPrivateUser(id, cb == null ? null : cb);
	};

	/**
	 * @function Client#join
	 * @param {String} id - The id of the user you want to join a room with.
	 * @param {String} room - The room name you wanna join.
	 * @param {callback} cb - The callback with either an error or response.
	 */
	join(id = this.id, room = this.room, cb = null) {
		Rest.join(id, room, cb == null ? null : cb);
	};

	/**
	 * @function Client#leave
	 * @param {String} id - The id of the user you want to leave a room with.
	 * @param {String} room - The room name you wanna leave.
	 * @param {callback} cb - The callback with either an error or response.
	 */
	leave(id = this.id, room = this.room, cb = null) {
		Rest.leave(id, room, cb == null ? null : cb);
	};

};
