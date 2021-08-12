## .env

The **.env** is more flexible than the **config.json**. Especially when you deploy and host the bot.

Change it as your will.

```env
TOKEN=''
GUILD_ID=''
OWNER_ID=''
LOG_WEBHOOK=''
MONGO_URI='mongodb://localhost:27017'
PREFIX="Man "
DEV_MODE="false"
```

## commands

With discord.js v 13 we have the **slash commands** but we still have the use of the **_classic_ commands** (!deploy, !free, ...).

### There are 3 handlers :

- events
- slash commands
- _classic_ commands ( set in bot.js and handled in /events/message_create.js )

To add a command, an event or a slash command, please follow exemple of `module.exports` in existing commands. It'll help a lot.

## Npm scripts

When we work with **node** we work whit **npm**. You already know `npm install`, but you can make your own npm scripts in **package.json**
I advise the use of **nodemon** that will rerun for you the code every time you save a file.
