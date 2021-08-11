require("dotenv").config();
const fs = require("fs");
const { Client, Collection, Intents } = require("discord.js");
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.commands = new Collection();
client.message_commands = new Collection();

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

/* Interaction commands set */
const commandFiles = fs
	.readdirSync("./commands")
	.filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

/* Interaction commands handler */
client.on("interactionCreate", async (interaction) => {
	if (!interaction.isCommand()) return;

	if (!client.commands.has(interaction.commandName)) return;

	try {
		await client.commands.get(interaction.commandName).execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({
			content: "Sorry, we run into troubles",
			ephemeral: true,
		});
	}
});

client.login(process.env.TOKEN);
