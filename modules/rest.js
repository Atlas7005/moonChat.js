var request = require("request");
var baseUrl = `https://chat.twplayer.co`;

module.exports = {
	sendMessage(id, room, message, cb) {
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
				cb(body);
			}
		);
	},

	getPublicUser(name, cb) {
		request(
			{
				url: `${baseUrl}/api/users/publ/${name}`,
				method: "GET",
				json: true
			},
			(err, res, body) => {
				if(err) return cb(new Error(err));
				cb(body);
			}
		);
	},

	getPrivateUser(id, cb) {
		request(
			{
				url: `${baseUrl}/api/users/priv/${id}`,
				method: "GET",
				json: true
			},
			(err, res, body) => {
				if(err) return cb(new Error(err));
				cb(body);
			}
		);
	}
};