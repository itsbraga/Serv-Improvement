const { log } = require(process.cwd() + "/Utils.js");

module.exports = {
	category: "utils",
	data: {
		name: "rename",
		description: "Rename a user",
		defaultPermission: false,
		options: [
			{
				type: "USER",
				name: "user",
				description: "The user to rename",
				required: true,
			},
			{
				type: "STRING",
				name: "new_nick",
				description: "The new nick",
				required: true,
			},
		],
	},
	async execute(interaction) {
		const author = await interaction.member;
		if (!author.permissions.has("MANAGE_NICKNAMES")) {
			interaction.reply({
				ephemeral: true,
				content: "Seems like you miss permissions…",
			});
			return;
		}

		const user = await interaction.options.getUser("user");
		const member = await interaction.guild.members.fetch(user);
		const new_nick = await interaction.options.getString("new_nick");

		member
			.setNickname(new_nick)
			.then(() => {
				log.info(
					interaction.guild,
					`${author.user.tag} renamed ${user.tag} on ${interaction.guild.name}`
				);
				interaction.reply({
					ephemeral: true,
					content: `**${user.tag}** is renamed **${new_nick}**!`,
				});
			})
			.catch((err) => {
				log.error(
					interaction.guild,
					err,
					`${author.user.tag} failed to rename ${user.tag} on ${interaction.guild.name}`
				);
				interaction.reply({
					ephemeral: true,
					content: `Oops, there's a problem:\n${err}`,
				});
			});
	},
};
