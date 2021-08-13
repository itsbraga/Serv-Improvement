require("dotenv").config();
const { log } = require(process.cwd() + "/Utils.js");
const fs = require("fs");
const { Client, Collection, Intents } = require("discord.js");
const { stripIndent } = require("common-tags");
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.commands = new Collection();
client.message_commands = new Collection();
client.categories = fs.readdirSync("./commands/");

/* Events set */
const eventFiles = fs
	.readdirSync("./events")
	.filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

/* Message commands set */
const msgCommandFiles = fs
	.readdirSync("./message_commands")
	.filter((file) => file.endsWith(".js"));

for (const file of msgCommandFiles) {
	const msgCommand = require(`./message_commands/${file}`);
	client.message_commands.set(msgCommand.name, msgCommand);
}

client.login(process.env.TOKEN);
