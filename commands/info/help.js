const { MessageEmbed } = require("discord.js");

const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	category: "info",
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("List all commands and give informations about")
		.addStringOption((option) =>
			option.setName("command").setDescription("The command you want help on")
		),

	async execute(interaction) {
		const prefix = process.env.PREFIX;
		const data = new MessageEmbed().setColor("RANDOM");
		const commands = (category) => {
			return interaction.client.commands
				.filter((cmd) => cmd.category === category)
				.map((cmd) => `• ${cmd.data.name}`)
				.join("\n");
		};

		/* General help */
		if (!interaction.options.getString("command")) {
			data
				.setAuthor(
					interaction.client.user.tag,
					interaction.client.user.avatarURL()
				)
				.setThumbnail(interaction.client.user.avatarURL())
				.setTitle("**Man**")
				.setDescription(
					[
						"Hello, my name is **Man** !! 🖐",
						`Ask me \`/help [command name]\` to get infos about the command`,
					].join("\n")
				)
				.setFooter(`</> with ❤ for Moineau 42`);

			/* Only show command that the user can use */
			const categories = interaction.member.permissions.has("ADMINISTRATOR")
				? interaction.client.categories
				: interaction.client.categories.filter(
						(cat) => !["test", "staff"].includes(cat)
				  );
			await categories.map((cat) => {
				data.addField(cat, commands(cat).toString(), true);
			});

			return interaction.member
				.send({ embeds: [data] })
				.then((msg) =>
					interaction.reply({ content: "Check your DM", ephemeral: true })
				)
				.catch((er) => {
					console.error(
						`Could not reply help to ${interaction.member.user.tag}.\n${er}`
					);
					interaction.reply({
						content: "Ooops ! Seems like I can't send you a DM.",
						ephemeral: true,
					});
				});
		}

		/* Help on a specific command */
		const cmdName = await interaction.options
			.getString("command")
			.toLowerCase();
		const cmd = interaction.client.commands.get(cmdName);

		if (!cmd) return interaction.reply("This commmand doesn't exist");
		if (
			["test", "staff"].includes(cmd.category) &&
			!interaction.member.permissions.has("ADMINISTRATOR")
		)
			return interaction.reply(
				`${interaction.options.getString("command")} is restricted to admins`
			);

		data.setTitle(cmd.data.name);

		if (cmd.data.description) data.setDescription(cmd.data.description);
		if (cmd.usage)
			data.addField("Usage", prefix + cmd.name + " " + (cmd.usage || " "));

		return interaction.member
			.send({ embeds: [data] })
			.then((msg) =>
				interaction.reply({ content: "Check your DM", ephemeral: true })
			)
			.catch((err) => {
				console.error(
					`Could not reply help to ${interaction.member.user.tag}.\n${err}`
				);
				interaction.reply({
					content: "Ooops ! Seems like I can't send you a DM.",
					ephemeral: true,
				});
			});
	},
};
