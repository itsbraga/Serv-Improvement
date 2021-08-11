module.exports = {
  name: "ready",
  once: true,
  execute(client) {
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
