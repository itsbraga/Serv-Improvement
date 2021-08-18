/* Handle slash commands `/command` */

const { log } = require(process.cwd() + "/Utils.js");
const { stripIndent } = require("common-tags");

module.exports = {
	name: "interactionCreate",
	async execute(interaction) {
		const client = interaction.client;

		/* Slash commands handler */
		log.info(
			interaction.guild,
			stripIndent`
		${interaction.user.tag} used /${
				interaction.commandName
			} ${interaction.options.data
				.map((option) => `${option.name}: ${option.value}`)
				.join(" ")}
		Channel: ${interaction.channel.name}, ${interaction.channel.id}
		Guild: ${interaction.guild.name}, ${interaction.guild.id}
	`
		);
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
	},
};
