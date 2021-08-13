/* give n xp to a user */

const { MongoClient } = require("mongodb");

module.exports = {
	category: "staff",
	data: {
		name: "give_xp",
		description: "give <int nb> of xp to a <user>",
		defaultPermission: false,
	},
	async execute(interaction) {
		// MongoClient.connect(process.env.MONGO_URI, {
		// 	useUndifinedTopology: true,
		// }).then(async (mongo) => {
		// 	const col = mongo.db("man_bot").collection("users");
		// 	const user = await col.findOne({user_id: interaction.user.id})
		// 	col.insertOne({
		// 		name: interaction.user.category,
		// 		discord_id: interaction.user.id,
		// 	})
		// });
	},
};
