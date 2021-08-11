const { SlashCommandBuilder } = require("@discordjs/builders");
const { stripIndents } = require("common-tags");

module.exports = {
	category: "test",
	data: new SlashCommandBuilder()
		.setName("echo")
		.setDescription("Replies with your input!")
		.addStringOption((option) =>
			option
				.setName("input")
				.setDescription("The input to echo back")
				.setRequired(true)
		)
		.addChannelOption((option) =>
			option.setName("dst").setDescription("The channel destionation")
		),

	async execute(interaction) {
		const content = interaction.options.getString("input");
		const channel = interaction.options.getChannel("dst")
			? interaction.options.getChannel("dst")
			: interaction.channel;
		await interaction.reply({
			content: stripIndents`
			Sent: ${interaction.options.getString("input")}
			in ${
				interaction.options.getChannel("dst")
					? interaction.options.getChannel("dst")
					: interaction.channel
			}
			`,
			ephemeral: true,
		});
		channel?.send({ content: content });
	},
};
