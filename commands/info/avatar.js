module.exports = {
    category: "info",
    global: "true",
    data: {
        name: 'avatar',
        description: 'Get the avatar URL of the selected 42 user login.',
        options: [{
            name: 'target',
            description: 'The user\'s avatar to show',
            type: 'STRING',
        }],
    },
	async execute(interaction) {
		const { MessageEmbed } = require('discord.js');
        if (!interaction.options.getString("target")) {
            interaction.reply("User ID needed");
            return;
        }

		const embedAvatar = new MessageEmbed()
			.setDescription(interaction.options.getString("target") + "'s 42 picture :")
            .setColor('BLURPLE')
	        .setImage("https://cdn.intra.42.fr/users/" + interaction.options.getString("target") + ".jpg")
        interaction.reply({ embeds: [embedAvatar] });
        console.log(("https://cdn.intra.42.fr/users/" + interaction.options.getString("target") + ".jpg"));
	},
};
