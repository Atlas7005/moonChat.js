var Socket = require("./socket");
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
			this.id = id;
			if(room) {
				this.room = room;
				this.connected = true;
				Socket.load(() => {
					this.getPrivateUser(this.id, body => cb == null ? null : cb(body.user));
				});
			} else {
				cb(new Error("Missing room parameter"));
			}
		} else {
			cb(new Error("Missing id parameter"));
		}
	};

	/**
	 * @function Client#onMessage
	 * @param {String} room - The room name to listen for.
	 * @param {callback} cb - The callback called when message is received.
	 */
	onMessage(room = this.room, cb = null) {
		Socket.onMessage(room, cb == null ? null : cb);
	};

	/**
	 * @function Client#onAdmin
	 * @param {String} room - The room name to listen for.
	 * @param {callback} cb - The callback called when message is received.
	 */
	onAdmin(room = this.room, cb = null) {
		Socket.onAdmin(room, cb == null ? null : cb);
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
};