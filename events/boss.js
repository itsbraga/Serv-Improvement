module.exports = {
	name: 'messageCreate',
    execute(message, client) {
        if (message.mentions.members.has('552212798055383052')) {
            message.reply(":warning: DON'T SPAM THE BOSS ! :warning:");
        }
	},
};