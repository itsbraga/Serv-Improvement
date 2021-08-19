const { MongoClient } = require("mongodb");
const { Player, database, log } = require(process.cwd() + "/Utils");
const { stripIndent } = require("common-tags");

module.exports = {
	category: "info",
	global: "true",
	data: {
		name: "rank",
		description: "Bunch of info about the rank",
		options: [
			{
				type: "SUB_COMMAND",
				name: "leaderboard",
				description: "Get the top10 users",
			},
		],
	},
	async execute(interaction) {
		MongoClient.connect(process.env.MONGO_URI, {
			useUnifiedTopology: true,
		}).then(async (mongo) => {
			const col = mongo.db("Savante").collection("users");
			const targets = await col
				.aggregate([{ $sort: { xp: -1 } }])
				.limit(10)
				.toArray();
			console.log(targets);
			interaction.reply(targets.map((u) => u.name).join("\n"));
		});
	},
};
