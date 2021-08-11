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
		interaction.client.categories.map((cat) => console.log(commands(cat)));

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
			await interaction.client.categories.map((cat) => {
				data.addField(cat, commands(cat).toString(), true);
			});

			interaction.reply("⬇️");
			return interaction.channel.send({ embeds: [data] }).catch((er) => {
				console.error(
					`Could not reply help to ${interaction.author.tag}.\n${er}`
				);
				interaction.reply("Ooops ! There is an error, try again later🤪");
			});
		}

		/* Help on a specific command */
		const cmdName = await interaction.options
			.getString("command")
			.toLowerCase();
		const cmd = interaction.client.commands.get(cmdName);

		if (!cmd) {
			return interaction.reply("This commmand doesn't exist");
		}

		data.setTitle(cmd.data.name);

		if (cmd.data.description) data.setDescription(cmd.data.description);
		if (cmd.usage)
			data.addField("Usage", prefix + cmd.name + " " + (cmd.usage || " "));

		await interaction.channel.send({ embeds: [data] });

		return interaction.reply("⬇️");
	},
};
