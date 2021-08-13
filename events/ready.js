const fs = require("fs");

module.exports = {
	name: "ready",
	once: true,
	async execute(client) {
		console.log(`${client.user.tag} ready!`);
		client.user.setPresence({
			status: "available",
		});
		client.user.setActivity({
			type: "WATCHING",
			name: "The norminette",
		});

		/* Slash commands set */
		fs.readdirSync(process.cwd() + "/commands/").forEach(async (dir) => {
			const commandFiles = fs
				.readdirSync(`${process.cwd()}/commands/${dir}/`)
				.filter((file) => file.endsWith(".js"));

			for (const file of commandFiles) {
				const command = require(`${process.cwd()}/commands/${dir}/${file}`);
				client.commands.set(command.data.name, command);

				if (!client.application?.owner) await client.application?.fetch();

				if (command.global === "true" && process.env.DEV_MODE !== "true") {
					client.application.commands.create(command.data);
				} else {
					client.guilds.cache
						.get(process.env.GUILD_ID)
						?.commands.create(command.data)
						.then((cmd) => {
							// if (cmd.defaultPermission) {
							// 	const admins = client.guilds.cache.roles.cache
							// 		.map((r) => r.name === "Admin")
							// 		.map((r) => r.members);
							// 	console.log(admins);
							// 	cmd.permissions.add({
							// 		permissions: [
							// 			{
							// 				id: client.application.owner.id,
							// 				type: "USER",
							// 				permission: true,
							// 			},
							// 		],
							// 	});
							// }
						});
				}
			}
		});
	},
};
