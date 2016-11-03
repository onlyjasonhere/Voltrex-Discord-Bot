var Discord = require("discord.js");
var bot = new Discord.Client();
var prefix = "?" //You can change this to a prefix you like but, PLEASE DON'T USE "!"

bot.on("ready", () => {
  console.log("Bot is online and ready on " + bot.guilds.size + " servers!");
});

bot.on("message", msg => {

  if (msg.content.startsWith(prefix + "ping")) {
    channel.sendMessage("Do I have to say pong?");
  }

  if (msg.content.startsWith(prefix + "whoami")) {
    channel.sendMessage("You're " + msg.author.username + "!")
  }
});

bot.login("BOT-TOKEN-HERE");
