# Man bot

This bot is dev for both personal user and moineaux 42

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`TOKEN`

`MONGO_URI`

`PREFIX`="Man "

`NODE_ENV`="development"

## Run Locally

Clone the project

```bash
  git clone -b shocquen https://github.com/abraga42/Serv-Improvement.git my-project
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the bot

```bash
  npm run start
```

## Add a command

Folder: `/commands/`

```js
module.exports = {
	category: "cat",
	global: "true", //useless for the moment
	data: {
		name: "cmd",
		description: "This is a command",
		options: [
			{
				type: "STRING",
				name: "option_1",
				description: "An option",
			},
		],
	}
	async execute(interaction) {
		// Handle the interaction here
	}
}
```

## Add an event

Folder: `/events/`

```js
module.exports = {
	name: "ready",
	once: true, // not required
	async execute(client) {
		console.log(`${client.user.tag} ready!`);
		client.user.setPresence({
			status: "available",
		});
		client.user.setActivity({
			type: "WATCHING",
			name: "The norminette",
		});
	},
};
```

## use mongodb

If you write in the DB I'm not responsible for any bugs

```
db/
	configs/
		document
	users/
		document
```

### configs documents

```json
{
	"id": "", // Guild id
	"name": "", // Guild name
	"webhook": "", // URL's webhook for the logs
	"commands": ["all"], // all or the commands names
	"admin": "520256478859493387" // the admin role
}
```

### users documents

```json
{
	"name": "Saky",
	"tag": "Saky#3566",
	"id": "212581406344216578",
	"xp": 2147483647, // Interger (^_−)☆ | Min = 100
	"lvl": 9001, // Min = 1
	"titles": ["Author", "sushi eater", "beer lover"] // Can be use in /user_info
}
```

## Tech Stack

**Server:** Node, Discord.js

## Authors

- [@MrSaky](https://www.github.com/MrSaky)
