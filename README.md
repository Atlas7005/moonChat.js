# moonChat.js
Node.js library for [moonChat](https://chat.twplayer.co/).

## Example
```js
var { Client } = require("moonchat.js");
var client = new Client();

client.connect("somevaliduserid", "atlas", user => {
	console.log(`Logged in to #atlas as ${user.name}`);
});

client.onMessage("atlas", (sender, message, color) => {
	console.log(`${sender.replace(/<[^>]*>?/gm, "")}: ${message}`);
});
```