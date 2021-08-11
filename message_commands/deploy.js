const {} = require(process.cwd() + "/Utils.js");
const fs = require("fs");

module.exports = {
	name: "deploy",
	description: "deploy commands",
	category: "admin",
	execute(msg) {
		const client = msg.client;

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
		console.log("Deployment done.");
		msg.reply("Deployment done.");
	},
};
