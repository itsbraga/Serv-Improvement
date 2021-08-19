const { Interaction , User} = require("discord.js");
const { MongoClient } = require("mongodb");
const { Player, database, log } = require(process.cwd() + "/Utils");
const { stripIndent } = require("common-tags");
const { MessageEmbed } = require("discord.js");

module.exports = {
    category: "info",
    global: "true",
    data: {

        name: "show_xp",
        description: "Show `int xp` of a `player`",
        options: [
            {
                type: "USER",
                name: "user",
                description: "the user you wanna show the xp",
            },
        ],
    },
    async execute(interaction = new Interaction) {
        MongoClient.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
        }).then(async (mongo) => {
            const col = mongo.db("Savante").collection("users");
            const user = await interaction.options.getUser("user");
            let user_id;
            if (user){
                user_id = user.id;
            }
            else
                user_id = interaction.user.id;
            const target = await col.findOne({ id: user_id });

            let player;

            if (!target) {
                player = new Player(user);
                player.xp = 100;
                player.lvl = 1;
                await database.add(col, player);
                log.info(
                    interaction.guild,
                    stripIndent`
						# New player!
						name: ${player.name}, id: ${player.id}
						`
                );
            } else {
                player = new Player(target);
            }
            console.log(player);
            let embed = new MessageEmbed()
                .setColor("#5055aa")
                //.setFooter(interaction.client.user.username, interaction.client.user.displayAvatarURL)
                .setTitle(player.name + "'s xp :")
                .addField("XP : ",  player.xp.toString())
				.addField("Level : ",  player.lvl.toString());

			interaction.reply({ embeds: [embed] });

        })
    }
}