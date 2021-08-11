const {} = require(process.cwd() + "/Utils.js");
const fs = require("fs");

module.exports = {
	name: "deploy",
	description: "deploy commands",
	execute(msg) {
		const commandFiles = fs
			.readdirSync(process.cwd() + "/commands")
			.filter((file) => file.endsWith(".js"));

		for (const file of commandFiles) {
			const command = require(`${process.cwd()}/commands/${file}`);
			msg.client.commands.set(command.name, command);
		}
		console.log("Deployment done.");
		msg.reply("Deployment done.");
	},
};
