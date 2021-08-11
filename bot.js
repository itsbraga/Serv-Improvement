require("dotenv").config();
const fs = require("fs");
const { Client, Collection, Intents } = require("discord.js");
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

/* Slash commands set */
fs.readdirSync(process.cwd() + "/commands/").forEach((dir) => {
	const commandFiles = fs
		.readdirSync(`${process.cwd()}/commands/${dir}/`)
		.filter((file) => file.endsWith(".js"));

	for (const file of commandFiles) {
		const command = require(`${process.cwd()}/commands/${dir}/${file}`);
		client.commands.set(command.data.name, command);

		client.guilds.cache
			.get(process.env.GUILD_ID)
			?.commands.create(command.data);
	}
});

/* Slash commands handler */
client.on("interactionCreate", async (interaction) => {
	console.log(interaction.commandName);
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
