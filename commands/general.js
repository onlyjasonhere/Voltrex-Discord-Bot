var command = {}

command.ping = {
  "name":"ping",
  "usage":"ping",
  "description":"Ping Pong command",
  "process":function(bot,msg,env){
    msg.reply("Pong!")
  }
}

module.exports = command
