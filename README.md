# moonChat.js
[![Stars](https://badgen.net/github/stars/Atlas7005/moonChat.js)](https://www.npmjs.com/package/moonchat.js) [![Issues](https://badgen.net/github/issues/Atlas7005/moonChat.js)](https://github.com/Atlas7005/moonChat.js/issues) [![Downloads](https://badgen.net/npm/dt/moonchat.js)](https://www.npmjs.com/package/moonchat.js)
Node.js library for [moonChat](https://chat.twplayer.co/).

## Example
```js
var { Client } = require("moonchat.js");
var client = new Client();

// Connect the client.
client.connect("somevaliduserid", "atlas", user => {
	console.log(`Logged in to #atlas as ${user.name}`);
});

// Message event listener.
// Returns sender username, message, and username color.
client.onMessage("atlas", (sender, message, color) => {
	console.log(`${sender}: ${message}`);

	// If a message includes !disconnect, disconnect the client.
	if(message.toLowerCase().includes("!disconnect")) {
		client.disconnect();
	// If a message includes "hey", say "Hello there!"
	} else if(message.toLowerCase().includes("hey")) {
		client.sendMessage("atlas", "Hello there!");
	// If a message includes !whoami, return basic public information about them.
	} else if(message.toLowerCase().includes("!whoami")) {
		client.getPublicUser(sender, body => {
			// If the user exists (checks if it's an error or invalid response).
			if(body.user) {
				// If user exists, make a shorthand variable to reference it.
				var user = body.user;
				// Send a message with the nice good good stuff information.
				client.sendMessage("atlas", `You are ${user.name}, with the color ${user.color}. You ${user.staff == false ? "are not" : "are"} a staff member. You ${user.verified == false ? "are not" : "are"} verified. Your account was created ${timeSince(new Date(user.createdAt))}`);
			}
		});
	}
});

// Admin message event listener. (Join/Leave events for now.)
client.onAdmin("atlas", message => {
	console.log(`${message}`);
});

// Courtesy of Sam (8853650) - stackoverflow
const intervals = [
  { label: 'year', seconds: 31536000 },
  { label: 'month', seconds: 2592000 },
  { label: 'day', seconds: 86400 },
  { label: 'hour', seconds: 3600 },
  { label: 'minute', seconds: 60 },
  { label: 'second', seconds: 0 }
];

function timeSince(date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const interval = intervals.find(i => i.seconds < seconds);
  const count = Math.floor(seconds / interval.seconds);
  return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
}
```