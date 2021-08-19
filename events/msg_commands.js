/* Handle msg commands `${prefix}command [args] */
const { MongoClient } = require("mongodb");
const { Message } = require("discord.js");

const prefix = process.env.PREFIX;
module.exports = {
	name: "messageCreate",
	async execute(msg = new Message()) {
		const client = msg.client;
		// MongoClient.connect(process.env.MONGO_URI, {
		// 	useUnifiedTopology: true,
		// }).then(async (mongo) => {
		// 	const col = mongo.db("Savante").collection("configs");
		// 	const target = col.findOne({ id: msg.guild.id });
		// 	if (target?.prefix) prefix = target.prefix;
		// });

		if (msg.content.toLowerCase().startsWith(prefix.toLowerCase())) {
			const args = msg.content.slice(prefix.length).trim().split(/ +/);
			const cmdName = args.shift().toLowerCase();
			const cmd = client.message_commands.get(cmdName);
			if (
				cmd.category === "admin" &&
				((!msg.member.permissions.has("ADMINISTRATOR")
					&& msg.member.id != process.env.OWNER_ID) ||
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
