module.exports = {
	name: "free",
	description: "Free the commands",
	execute(msg) {
		msg.client.commands.delete();
		msg.guild.commands.set([]);
		console.log("Freed.");
		msg.reply("Freed.");
	},
};
