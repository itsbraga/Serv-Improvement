const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	category: "info",
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with Pong!"),

	async execute(interaction) {
		await interaction.reply(
			`🏓\n Ping : ${
				Date.now() - interaction.createdTimestamp
			}ms\n API's Ping: ${interaction.client.ws.ping}ms`
		);
	},
};
