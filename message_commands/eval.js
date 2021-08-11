const { MessageEmbed } = require("discord.js");
const beautify = require("beautify");

module.exports = {
	name: "eval",
	description: "Evaluate code",
	usage: "<code to eval>",
	category: "admin",
	async execute(msg, args) {
		if (msg.author.id !== process.env.OWNER_ID) {
			return msg.reply("Nope!").then((m) => m.delete(5000));
		}

		const client = msg.client;

		if (!args[0]) {
			msg.channel
				.send("What do you wanna evaluate??")
				.then((m) => m.delete(5000));
		}

		try {
			if (args.join(" ").toLowerCase().includes("token")) {
				return;
			}

			const toEval = args.join(" ");
			const evaluated = await eval(toEval);

			let embed = new MessageEmbed()
				.setColor("#00ff00")
				.setTimestamp()
				.setFooter(client.user.username, client.user.displayAvatarURL)
				.setTitle("Eval")
				.addField(
					"To Evaluate",
					`\`\`\`js\n${beautify(args.join(" "), {
						format: "js",
					})}\n\`\`\``
				)
				.addField("Evaluated", evaluated.toString())
				.addField("Type of", typeof evaluated);

			msg.channel.send({ embeds: [embed] });
			console.log(evaluated);
		} catch (e) {
			let embed = new MessageEmbed()
				.setColor("#ff0000")
				.setTitle(":x: Error!")
				.setDescription(e.toString())
				.setFooter(client.user.username, client.user.displayAvatarURL);

			msg.channel.send({ embeds: [embed] });
		}
	},
};
