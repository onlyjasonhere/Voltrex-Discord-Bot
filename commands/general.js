var command = {}

command.ping = {
  "name":"ping",
  "usage":"ping",
  "description":"Ping Pong command",
  "process":function(bot,msg,env){
    var now = Date.now()
    msg.channel.sendMessage("Pinging...").then(function(message){
      var end = Date.now()
      message.edit("Pong! `"+(end - now)+"ms`")
    })
  }
}

command.help = {
  "name":"help",
  "usage":"help",
  "description":"Sends you list of commands and help",
  "process":function(bot,msg,env){
    var e = msg.content.split(" ").splice(1).join(" ")
    if(e === ""){
    var help = "```ruby\nBot Commands:\n"
    var commands = env.general
    for(var i = 0;i<Object.keys(commands).length;i++){
      help += `${env.prefix}${commands[Object.keys(commands)[i]].usage} - ${commands[Object.keys(commands)[i]].description}\n`
    }
    for(var i = 0;i<Object.keys(env.admin).length;i++){
      help += `${env.prefix}${commands[Object.keys(env.admin)[i]].usage} - ${commands[Object.keys(env.admin)[i]].description}\n`
    }
    help += "\n\nFor more info on a command type "+env.prefix+"help [command name]\n```"
    msg.channel.sendMessage("Sending commands now...").then(function(message){
    msg.author.sendMessage(help).then(function(){
      message.edit("Commands in your DM's now!")
    })
  })
}else{

  if(env.general[e]){
    msg.channel.sendMessage(`\`\`\`\n${env.prefix}${env.general[e].usage}\n\n${env.general[e].description}\`\`\``)
  }
  if(env.admin[e]){
    msg.channel.sendMessage(`\`\`\`\n${env.prefix}${env.admin[e].usage}\n\n${env.admin[e].description}\`\`\``)
  }
  if(!env.admin[e] && !env.general[e]){
    msg.channel.sendMessage("Sorry I could not find command `"+e+"`")
  }
}
  }
}

command.git = {
  "name":"git",
  "usage":"git",
  "description":"Sends a link to the bot's GitHub repo",
  "process":function(bot,msg,env){
    msg.reply("check out my GitHub at https://github.com/Betaaaaa/v10-discord.js-discordbot !")
  }
}


module.exports = command
