const fs = require("fs");
const { MongoClient } = require("mongodb");

module.exports = {
	name: "ready",
	set_guilds_commands: async function (client, command) {
		MongoClient.connect(process.env.MONGO_URI, {
			useUnifiedTopology: true,
		}).then(async (mongo) => {
			const col = mongo.db("Savante").collection("configs");
			const guilds = await col.find().toArray();

			/* Add only commands that the guild need */
			guilds.forEach(async (guild) => {
				if (
					guild.commands.includes(command.data.name) ||
					guild.commands.includes("all")
				) {
					client.guilds.cache
						.get(guild.id)
						?.commands.create(command.data)
						.then(async (cmd) => {
							console.log(`${cmd.name} set in ${guild.name}`);
							if (!cmd.defaultPermission) {
								const role = await cmd.guild.roles.fetch(guild.admin);
								if (role) {
									cmd.permissions
										.set({
											permissions: [
												{
													id: role.id,
													type: "ROLE",
													permission: true,
												},
												{
													id: client.application.owner.id,
													type: "USER",
													permission: true,
												},
											],
										})
										.then(() =>
											console.log(
												`${cmd.name} permissions set to ${role?.name}`
											)
										)
										.catch((err) => console.error(err));
								}
								await cmd.permissions.add({
									permissions: [
										{
											id: client.application.owner.id,
											type: "USER",
											permission: true,
										},
									],
								});
							}
						})
						.catch((err) => {
							console.error(err);
							console.log(
								`${command.data.name} failed to set in ${guild.name}`
							);
						});
				}
			});
		});
	},
	async execute(client) {
		/* Message commands set */
		const msgCommandFiles = fs
			.readdirSync(process.cwd() + "/message_commands")
			.filter((file) => file.endsWith(".js"));

		for (const file of msgCommandFiles) {
			const msgCommand = require(`${process.cwd()}/message_commands/${file}`);
			client.message_commands.set(msgCommand.name, msgCommand);
		}

		/* Slash commands set */
		fs.readdirSync(process.cwd() + "/commands/").forEach(async (dir) => {
			const commandFiles = fs
				.readdirSync(`${process.cwd()}/commands/${dir}/`)
				.filter((file) => file.endsWith(".js"));

			for (const file of commandFiles) {
				const command = require(`${process.cwd()}/commands/${dir}/${file}`);
				client.commands.set(command.data.name, command);

				if (!client.application?.owner) await client.application?.fetch();

				if (
					command.global === "true" &&
					process.env.NODE_ENV !== "development"
				) {
					client.application.commands.create(command.data);
				} else {
					this.set_guilds_commands(client, command);
				}
			}
		});
	},
};
