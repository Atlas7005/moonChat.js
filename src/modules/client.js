var { Socket } = require("./socket");
var Rest = require("./rest");
var cheerio = require("cheerio");


/**
 * An object with user information.
 * @typedef {Object} User
 * @property {String} name - The name of the user.
 * @property {String} color - The hex color code of the user.
 * @property {Date} createdAt - The time the user was created.
 * @property {Boolean} staff - If the user is staff or not.
 * @property {Boolean} verified - If the user is verified or not.
 * @property {Boolean} bughunter - If the user is a bug hunter or not.
 */

/**
 * An object with emote information.
 * @typedef {Object} Emote
 * @property {String} code - The Emote code. Ex: EleGiggle.
 * @property {String} src - The URL to the emote image source.
 */

/**
 * An object containing all Message information.
 * @typedef {Object} Message
 * @property {User} sender - An object with the user information.
 * @property {String} content - What the user writes.
 * @property {(String|null)} emotesRaw - String of all the emotes in the message. null if none.
 * @property {(Emote[]|null)} emotes - Array of all the emotes in the message. null if none.
 * @property {Date} createdAt - Time the message was sent.
 * @property {String} channel - The room the message was sent in.
 */

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
		/** The connection status of the client. */
		this.connected = false;
		/** The ID of the Client User. */
		this.id = null;
		/** The room the Client is connected to. */
		this.room = null;
		/** The client user. */
		this.user = null;
		this.socket = null;

		return;
	};

	/**
	 * @function Client#connect
	 * @param {String} id - The id of the client user.
	 * @param {String} room - The room name.
	 * @param {(User|Error)} cb - The callback that handles the user/error.
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
				this.getPrivateUser(this.id, body => {
					this.user = body.user;
					cb == null ? null : cb(body.user);
				});
				this.join(this.id, this.room);
				['beforeExit', 'uncaughtException', 'unhandledRejection', 'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT','SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'].forEach(evt => process.on(evt, (code) => this._exitHandle(code, this.id, this.room)));
			} else {
				cb(new Error("Missing room parameter"));
			}
		} else {
			cb(new Error("Missing id parameter"));
		}
		return;
	};

	/**
	 * @function Client#disconnect
	 * @param {(Object|Error)} cb - The callback called when disconnected.
	 */
	disconnect(cb = null) {
		this.leave(this.id, this.room, () => {
			this.connected = false;
			this.id = null;
			this.room = null;
			this.socket.unload(() => cb == null ? null : cb());
		});
		return;
	};

	/**
	 * @function Client#onMessage
	 * @param {String} room - The room name to listen for.
	 * @param {Message} cb - The callback called when message is received.
	 */
	onMessage(room = this.room, cb = null) {
		var sendObject = {};
		this.socket.onMessage(room, (sender, message, color) => {
			var $ = cheerio.load(message);
			var emotes = [];
			var emotesHtml = $("img.twitch-emote");
			for (var i = 0; i < emotesHtml.length; i++) {
				var emote = emotesHtml[i];
				emotes.push({ code: emote.attribs.title, src: emote.attribs.src });
			}
			this.getPublicUser(sender.toLowerCase(), (user) => {
				sendObject.sender = user.user;
				sendObject.content = message.replace(/<[^>]*>?/gm, "").trim();
				sendObject.emotesRaw = emotes.length > 0 ? emotes.map(emote => `<e:${emote.code}>`).join(" ") : null;
				sendObject.emotes = emotes.length > 0 ? emotes : null;
				sendObject.createdAt = new Date();
				sendObject.channel = room;
				cb == null ? null : cb(sendObject);
			});
		});
		return;
	};

	/**
	 * @function Client#onAdmin
	 * @param {String} room - The room name to listen for.
	 * @param {String} cb - The callback called when message is received.
	 */
	onAdmin(room = this.room, cb = null) {
		this.socket.onAdmin(room, cb == null ? null : cb);
		return;
	};

	/**
	 * @function Client#onJoin
	 * @param {String} room - The room name to listen for.
	 * @param {(User|Error)} cb - The callback called when someone joins.
	 */
	onJoin(room = this.room, cb = null) {
		this.socket.onJoin(room, sender => this.getPublicUser(sender.replace(/<[^>]*>?/gm, "").toLowerCase(), user => cb == null ? null : cb(user.user)));
		return;
	};

	/**
	 * @function Client#onLeave
	 * @param {String} room - The room name to listen for.
	 * @param {(User|Error)} cb - The callback called when someone leaves.
	 */
	onLeave(room = this.room, cb = null) {
		this.socket.onLeave(room, sender => this.getPublicUser(sender.replace(/<[^>]*>?/gm, "").toLowerCase(), user => cb == null ? null : cb(user.user)));
		return;
	};

	/**
	 * @function Client#sendMessage
	 * @param {String} room - The room to send a message in.
	 * @param {String} message - The message to send.
	 * @param {(Object|Error)} cb - The callback with either an error or response object.
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
		return;
	};

	/**
	 * @function Client#getPublicUser
	 * @param {String} name - The name of the user you wanna get information about.
	 * @param {(User|Error)} cb - The callback with either an error or the user information.
	 */
	getPublicUser(name, cb = null) {
		Rest.getPublicUser(name, cb == null ? null : cb);
		return;
	};

	/**
	 * @function Client#getPrivateUser
	 * @param {String} id - The id of the user you wanna get information about.
	 * @param {(User|Error)} cb - The callback with either an error or the user information.
	 */
	getPrivateUser(id = this.id, cb = null) {
		Rest.getPrivateUser(id, cb == null ? null : cb);
		return;
	};

	/**
	 * @function Client#join
	 * @param {String} id - The id of the user you want to join a room with.
	 * @param {String} room - The room name you wanna join.
	 * @param {Object} cb - The callback with either an error or response.
	 */
	join(id = this.id, room = this.room, cb = null) {
		Rest.join(id, room, cb == null ? null : cb);
		return;
	};

	/**
	 * @function Client#leave
	 * @param {String} id - The id of the user you want to leave a room with.
	 * @param {String} room - The room name you wanna leave.
	 * @param {Object} cb - The callback with either an error or response.
	 */
	leave(id = this.id, room = this.room, cb = null) {
		Rest.leave(id, room, cb == null ? null : cb);
		return;
	};

	async _exitHandle(evtOrExitCodeOrError, id, room) {
		try {
			Rest.leave(id, room, () => {
				if(typeof evtOrExitCodeOrError == "object") {
					console.error(evtOrExitCodeOrError);
				}
				process.exit(isNaN(+evtOrExitCodeOrError) ? 1 : +evtOrExitCodeOrError);
			});
		} catch (e) {
			console.error(e);
			if(typeof evtOrExitCodeOrError == "object") {
				console.error(evtOrExitCodeOrError);
			}
			process.exit(isNaN(+evtOrExitCodeOrError) ? 1 : +evtOrExitCodeOrError);
		}
	};

};
