module.exports = {
	name: "free",
	description: "Free the commands",
	category: "admin",
	execute(msg) {
		msg.client.application.commands.set([]);
		msg.guild.commands.set([]);
		console.log("Freed.");
		msg.reply("Freed.");
	},
};
