/* give n xp to a user */

const { MongoClient } = require("mongodb");
const { Player, database, log } = require(process.cwd() + "/Utils");
const { stripIndent } = require("common-tags");

module.exports = {
	category: "staff",
	data: {
		name: "xp",
		description: "manage xp of a player",
		defaultPermission: false,
		options: [
			{
				type: "SUB_COMMAND",
				name: "give",
				description: "Give `int xp` to a `player`",
				options: [
					{
						type: "INTEGER",
						name: "xp",
						description: "the amount of xp you wanna give",
						required: true,
					},
					{
						type: "USER",
						name: "user",
						description: "the user you wanna give the xp",
						required: true,
					},
				],
			},
			{
				type: "SUB_COMMAND",
				name: "remove",
				description: "Remove `int xp` to a `player`",
				options: [
					{
						type: "INTEGER",
						name: "xp",
						description: "the amount of xp you wanna remive",
						required: true,
					},
					{
						type: "USER",
						name: "user",
						description: "the user you wanna give the xp",
						required: true,
					},
				],
			},
			{
				type: "SUB_COMMAND",
				name: "reset",
				description: "Remove `int xp` to a `player`",
				options: [
					{
						type: "USER",
						name: "user",
						description: "the user you wanna give the xp",
						required: true,
					},
				],
			},
		],
	},
	async execute(interaction) {
		MongoClient.connect(process.env.MONGO_URI, {
			useUnifiedTopology: true,
		}).then(async (mongo) => {
			const col = mongo.db("Savante").collection("users");
			const user = await interaction.options.getUser("user");
			const target = await col.findOne({ id: user.id });

			let xp = interaction.options.getInteger("xp");
			let player;

			if (interaction.options.data[0].name === "give") {
				if (!target) {
					player = new Player(user);
					await database.add(col, player);
					log.info(
						interaction.guild,
						stripIndent`
							# New player!
							name: ${player.name}, id: ${player.id}
							`
					);
					xp += 100;
				} else {
					player = new Player(target);
				}
				const lvld_up = player.inc_xp(xp);
				await col
					.updateOne({ id: user.id }, { $inc: { xp: xp, lvl: lvld_up } })
					.then(() =>
						log.info(
							interaction.guild,
							`${user.tag} have recieved ${xp} and passed ${lvld_up} lvl.`
						)
					);
				interaction.reply(
					`${user} have recieved ${xp} and passed ${lvld_up} lvl.`
				);
			} else if (interaction.options.data[0].name === "reset") {
				reset_player(user, col, interaction);
				return;
			} else {
				if (!target) {
					interaction.reply({
						ephemeral: true,
						content: `**${user.tag}** is not in the DB`,
					});
					return;
				}
				player = new Player(target);

				if (xp > 0) xp *= -1;
				if (player.xp - -xp <= 100) {
					reset_player(user, col, interaction);
					return;
				}
				const lvld_down = player.red_xp(xp);
				await col
					.updateOne({ id: user.id }, { $inc: { xp: xp, lvl: -lvld_down } })
					.then(() =>
						log.info(
							interaction.guild,
							`${user.tag} have lost ${xp} and ${lvld_down} lvl.`
						)
					);
				interaction.reply(`${user} have lost ${xp} and ${lvld_down} lvl.`);
			}
		});
	},
};

async function reset_player(user, col, interaction) {
	await col
		.updateOne({ id: user.id }, { $set: { xp: 100, lvl: 1 } })
		.then(() =>
			log.info(interaction.guild, `${user.tag} has been reset to lvl 1.`)
		);
	interaction.reply({
		ephemeral: true,
		content: `${user.tag} has been reset to lvl 1.`,
	});
}
