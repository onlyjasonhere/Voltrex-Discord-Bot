var Discord = require("discord.js");
var bot = new Discord.Client();
var prefix = "?" //You can change this to a prefix you like but, PLEASE DON'T USE "!"
var general = require("./commands/general.js")


bot.on("ready", () => {
    console.log("Bot is online and ready on " + bot.guilds.size + " servers!");
});

bot.on("message", msg => {
  if(!msg.content.startsWith(prefix))
  var cmd = ""
  var splitmsg = msg.content.split("")
  for(var i = 0;i<splitmsg.length;i++){
    if(i != ""){
      cmd += splitmsg[i]
    }else{
      return
    }
  cmd = cmd.join("")
  cmd = cmd.replace(prefix,"")
  cmd = cmd.trim()
  var env = {
    "bot":bot,
    "msg":msg,
    "general":general,
    "process":process
  }
  for(var i = 0;i<Object.keys(general).length;i++){
    if(Object.keys(general)[i].name === cmd){
      Object.keys(general)[i].process(bot,msg,env)
      return
    }
  }
  }
});

bot.login("BOT-TOKEN-HERE");
