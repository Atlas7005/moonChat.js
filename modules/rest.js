var request = require("request");
var baseUrl = `https://chat.twplayer.co`;

module.exports = {
	sendMessage(id, room, message, cb = null) {
		request(
			{
				url: `${baseUrl}/api/messages/send`,
				method: "POST",
				body: {
					id,
					room,
					message
				},
				json: true
			},
			(err, res, body) => {
				if(err) return cb(new Error(err));
				cb == null ? null : cb(body);
			}
		);
	},

	getPublicUser(name, cb = null) {
		request(
			{
				url: `${baseUrl}/api/users/publ/${name}`,
				method: "GET",
				json: true
			},
			(err, res, body) => {
				if(err) return cb(new Error(err));
				cb == null ? null : cb(body);
			}
		);
	},

	getPrivateUser(id, cb = null) {
		request(
			{
				url: `${baseUrl}/api/users/priv/${id}`,
				method: "GET",
				json: true
			},
			(err, res, body) => {
				if(err) return cb(new Error(err));
				cb == null ? null : cb(body);
			}
		);
	},

	join(id, room, cb = null) {
		request(
			{
				url: `${baseUrl}/api/rooms/join`,
				method: "POST",
				body: {
					id,
					room
				},
				json: true
			},
			(err, res, body) => {
				if(err) return cb == null ? null : cb(new Error(err));
				cb == null ? null : cb(body);
			}
		);
	},

	leave(id, room, cb = null) {
		request(
			{
				url: `${baseUrl}/api/rooms/leave`,
				method: "POST",
				body: {
					id,
					room
				},
				json: true
			},
			(err, res, body) => {
				if(err) return cb == null ? null : cb(new Error(err));
				cb == null ? null : cb(body);
			}
		);
	}
};