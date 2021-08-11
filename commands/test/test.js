const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	category: "test",
	data: new SlashCommandBuilder()
		.setName("test")
		.setDescription("Replies with test!"),
	async execute(interaction) {
		await interaction.reply("Test!");
	},
};
