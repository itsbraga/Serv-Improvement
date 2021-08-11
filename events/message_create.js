const prefix = process.env.PREFIX;
module.exports = {
	name: "messageCreate",
	async execute(msg) {
		const client = msg.client;

		if (msg.content.toLowerCase().startsWith(prefix.toLowerCase())) {
			const args = msg.content.slice(prefix.length).trim().split(/ +/);
			const cmdName = args.shift().toLowerCase();
			const cmd = client.message_commands.get(cmdName);

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
