var { Client } = require("moonchat.js");
var client = new Client();

// Connect the client.
client.connect("somevaliduserid", "atlas", user => {
	console.log(`Logged in to #atlas as ${user.name}`);
});

// Message event listener.
// Callback returns a message object, similar to Discord.js's.
client.onMessage("atlas", message => {
	console.log(`${message.sender.name}: ${message.content}`); // Log the message normally - ex: "Atlas: Hello there."
	if(message.sender.name.toLowerCase() == client.user.name.toLowerCase()) return; // We can also make sure that if the sender is the bot, do not run any commands.

    var msgArr = message.content.split(" "); // Split the message into an array by spaces so "Hello there" will turn into [ "Hello", "there" ]
    var cmd = msgArr[0].toLowerCase(); // cmd is the command, which is usually the first part of a message, and we'll make it lowercase for simplicity.
    var args = msgArr.slice(1); // Args is everything after the command, we'll use the array but take out the first part (which is the command).
    var argsRaw = args.join(" "); // For simplicity we'll also make a variable to store the args in a string, do this by joining the args back together by a space.

    // If cmd is !whoami, write information back.
    if(cmd == "!whoami") {
    	// Send a message containing the user info to the message channel/room.
    	client.sendMessage(message.channel, `You are ${message.sender.name}, with the color ${message.sender.color}. You ${message.sender.staff == false ? "are not" : "are"} a staff member. You ${message.sender.verified == false ? "are not" : "are"} verified. You ${message.sender.bughunter == false ? "are not" : "are"} a bug hunter. Your account was created ${timeSince(new Date(message.sender.createdAt))}`);
    } else if(cmd == "hey") {
    // If cmd is hey, say hey back. Notice how this doesn't include a prefix, this means a normal message where the first word is hey, it will respond to.
    	client.sendMessage(message.channel, "Hey there!");
    } else if(cmd == "!color") {
    // If cmd is !color and there is a arg (index 0 because yes). Try to change the bot's username color to that, and say what is returned.
    	if(args[0]) {
    		client.sendMessage(message.channel, "/color "+args[0], response => {
    			client.sendMessage(message.channel, response.msg);
    		});
    	}
    }
});

// Admin message event listener.
// Callback returns a string.
client.onAdmin("atlas", message => {
	console.log(message);
});

// Leave event listener.
// Callback returns the User object.
client.onLeave("atlas", user => {
	console.log(user);
});

// Join event listener.
// Callback returns the User object.
client.onJoin("atlas", user => {
	console.log(user);
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