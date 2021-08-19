const fs = require("fs");

const { set_guilds_commands } = require(process.cwd() + "/events/set_commands");

module.exports = {
	name: "deploy",
	description: "deploy commands",
	category: "admin",
	execute(msg) {
		const client = msg.client;

		/* Slash commands set */
		fs.readdirSync(process.cwd() + "/commands/").forEach(async (dir) => {
			if (dir) {
				const commandFiles = fs
					.readdirSync(`${process.cwd()}/commands/${dir}/`)
					.filter((file) => file.endsWith(".js"));

				for (const file of commandFiles) {
					const command = require(`${process.cwd()}/commands/${dir}/${file}`);
					client.commands.set(command.data.name, command);
					console.log(command);

					if (command.global === "true" &&
						process.env.NODE_ENV !== "development") {
						if (!client.application?.owner) await client.application?.fetch();
						client.application.commands.create(command.data);
					} else {
						if (!client.application?.owner) await client.application?.fetch();
						await set_guilds_commands(client, command);
					}
				}
			}
		});
		console.log("Deployment done.");
		msg.reply("Deployment done.");
	},
};
