require("dotenv").config();
const { log } = require(process.cwd() + "/Utils.js");
const fs = require("fs");
const { Client, Collection, Intents } = require("discord.js");
const { stripIndents } = require("common-tags");
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.commands = new Collection();
client.message_commands = new Collection();
client.categories = fs.readdirSync("./commands/");

/* Events set listeners */
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

client
	.login(process.env.TOKEN)
	.then(() =>
		console.log(stripIndents`
		» ${process.env.npm_package_name}@${process.env.npm_package_version}
		» node@${process.version}
		
	`)
	)
	.catch((err) => console.error(err));
