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
    help += "```"
    msg.channel.sendMessage("Sending commands now...").then(function(message){
    msg.author.sendMessage(help).then(function(){
      message.edit("Commands in your DM's now")
    })
  })
}else{

  if(env.general[e]){
    msg.channel.sendMessage(`\`\`\`\n${env.prefix}${env.general[e].usage}\n\n${env.general[e].description}\`\`\``)
  }else{
    msg.channel.sendMessage("Command `"+e+"` not found")
  }
}
  }
}

command.git = {
  "name":"git",
  "usage":"git",
  "description":"Sends a link to bot github URL",
  "process":function(bot,msg,env){
    msg.reply("My github url is here: https://github.com/Betaaaaa/v10-discord.js-discordbot")
  }
}


module.exports = command
