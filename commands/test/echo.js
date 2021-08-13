const { SlashCommandBuilder } = require("@discordjs/builders");
const { stripIndents } = require("common-tags");

module.exports = {
	category: "test",
	global: "true",
	data: {
		name: "echo",
		description: "Send your input in the channel you choose",
		options: [
			{
				type: "STRING",
				name: "input",
				description: "The input to echo",
				required: true,
			},
			{
				type: "CHANNEL",
				name: "dst",
				description: "The channel of destionation",
			},
		],
	},

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
