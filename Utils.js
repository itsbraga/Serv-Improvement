const { stripIndent } = require("common-tags");
const { WebhookClient } = require("discord.js");
const { MongoClient } = require("mongodb");
const get_webhhok = async (guild) => {
	const mongo = await MongoClient.connect(process.env.MONGO_URI, {
		useUnifiedTopology: true,
	});
	const col = mongo.db("Savante").collection("configs");
	const target = await col.findOne({ id: guild.id });

	if (!target) return null;

	return target.webhook;
};

module.exports = {
	wait: (ms) => {
		return new Promise((res) => setTimeout(res, ms));
	},
	load: async () => {
		for (let i = 0; i <= 20; i++) {
			const dots = ".".repeat(i);
			const left = 20 - i;
			const empty = " ".repeat(left);

			process.stdout.write(`\r[${dots}${empty}] ${i * 5}%`);
			await this.wait(80);
		}
	},

	log: {
		error: async (guild, err, ctx) => {
			console.error(err);
			const webhook = await get_webhhok(guild);
			if (!webhook) return;
			const whClient = new WebhookClient({ url: webhook });
			whClient.send({
				username: "Error",
				content: `${ctx}\n\`\`\`diff\n-${err}\n\`\`\``,
			});
		},
		warn: async (guild, ctx) => {
			console.warn(ctx);
			const webhook = await get_webhhok(guild);
			if (!webhook) return;
			const whClient = new WebhookClient({ url: webhook });
			whClient.send({
				username: "Warn",
				content: `\`\`\`fix\n${ctx}\n\`\`\``,
			});
		},
		info: async (guild, ctx) => {
			console.log(ctx);
			const webhook = await get_webhhok(guild);
			if (!webhook) return;
			const whClient = new WebhookClient({ url: webhook });
			whClient.send({
				username: "info",
				content: "```\n" + ctx + "```\n",
			});
		},
	},

	database: {
		add: async (col, player) => {
			try {
				await col.insertOne(player);
			} catch (err) {
				console.error(err);
			}
		},
	},

	Player: class Player {
		constructor(user) {
			this.name = user.username;
			this.tag = user.tag;
			this.id = user.id;
			this.xp = user.xp || 0;
			this.lvl = user.lvl || 0;
			this.titles = user.titles || [];
		}
		static ratio = 1.5;

		get progression() {
			const current = this.xp - 100 * Player.ratio ** (this.lvl - 1);
			const roof = this.next_lvl - 100 * Player.ratio ** (this.lvl - 1);
			return Math.floor((current * 100) / roof);
		}

		get next_lvl() {
			return 100 * Player.ratio ** this.lvl;
		}
		get past_lvl() {
			return 100 * Player.ratio ** (this.lvl - 1);
		}

		inc_xp(n) {
			const past = this.lvl;
			while (n > 0) {
				this.xp++;
				this.lvl_up();
				n--;
			}
			return this.lvl - past;
		}
		red_xp(n) {
			const past = this.lvl;
			while (n < 0) {
				this.xp--;
				this.lvl_down();
				n++;
			}
			return past - this.lvl;
		}
		lvl_up() {
			if (this.xp >= this.next_lvl) {
				this.lvl++;
			}
		}
		lvl_down() {
			if (this.xp <= this.past_lvl) {
				this.lvl--;
			}
		}
	},
};
