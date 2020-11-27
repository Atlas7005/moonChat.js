[![Stars](https://badgen.net/github/stars/Atlas7005/moonChat.js)](https://www.npmjs.com/package/moonchat.js) [![Issues](https://badgen.net/github/issues/Atlas7005/moonChat.js)](https://github.com/Atlas7005/moonChat.js/issues) [![Downloads](https://badgen.net/npm/dt/moonchat.js)](https://www.npmjs.com/package/moonchat.js)

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