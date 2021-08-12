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
};
