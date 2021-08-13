/* Handle msg commands `${prefix}command [args] */
const { Message } = require("discord.js");

const prefix = process.env.PREFIX;
module.exports = {
	name: "messageCreate",
	async execute(msg = new Message()) {
		const client = msg.client;

		if (msg.content.toLowerCase().startsWith(prefix.toLowerCase())) {
			const args = msg.content.slice(prefix.length).trim().split(/ +/);
			const cmdName = args.shift().toLowerCase();
			const cmd = client.message_commands.get(cmdName);
			console.log(cmd);
			if (
				cmd.category === "admin" &&
				(!msg.member.permissions.has("ADMINISTRATOR") ||
					msg.channel.type === "dm")
			)
				return msg.reply("You dont have the perms.");

			try {
				console.log(
					`[${msg.author.tag}] use ${prefix}${cmd.name} ${args.join(" ")}`
				);
				cmd.execute(msg, args);
				msg.react("👀");
			} catch (err) {
				console.error(err);
				msg.reply("There is a problem with this command");
			}
		}
	},
};
