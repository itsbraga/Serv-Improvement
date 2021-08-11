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
};
