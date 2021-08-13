const { WebhookClient, MessageEmbed } = require("discord.js");
const whClient = new WebhookClient({ url: process.env.LOG_WEBHOOK });

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
		error: (err, ctx) => {
			whClient.send({
				username: "Error",
				content: `${ctx}\n\`\`\`diff\n-${err}\n\`\`\``,
			});
		},
		warn: (ctx) => {
			whClient.send({
				username: "Warn",
				content: `\n\`\`\`fix\n${ctx}\n\`\`\``,
			});
		},
		info: (ctx) => {
			whClient.send({
				username: "info",
				content: ctx,
			});
		},
	},
	Player: class Player {
		constructor(user) {
			this.name = user.name;
			this.tag = user.tag;
			this.id = user.id;
			this.xp = user.xp || 0;
			this.lvl = user.lvl || 0;
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

		inc_xp(n) {
			const past = this.lvl;
			while (n > 0) {
				this.xp++;
				this.lvl_up();
				n--;
			}
			return this.lvl - past;
		}
		lvl_up() {
			if (this.xp >= this.next_lvl) {
				this.lvl++;
				return true;
			}
			return false;
		}
	},
};
