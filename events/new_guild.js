const { MongoClient } = require("mongodb");
const { stripIndents } = require("common-tags");

module.exports = {
	name: "guildCreate",
	async execute(guild, client) {
		console.log(`Popped in ${guild.name} !`);
		MongoClient.connect(process.env.MONGO_URI, {
			useUnifiedTopology: true,
		}).then(async (mongo) => {
			const col = mongo.db("Savante").collection("configs");
			const target = await col.findOne({ id: guild.id });

			/* Ask the guild to config the bot */
			if (!target) {
				guild.systemChannel.send(stripIndents`
					Hello ${guild.name}!
					Thanks to config me with ${client.application.owner}.
				`);
			}
		});
	},
};
