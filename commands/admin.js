var command = {}
const child_process = require('child_process');

command.update = {
  "name":"update",
  "usage":"update",
  "description":"For Admins Only - Updates Bot",
  "process":function(bot,msg,env){
    msg.channel.sendMessage("Preparing to update").then(function(e){
    var evaled = eval("child_process.execSync('git pull origin').toString()");
    msg.channel.sendMessage(evaled).then(function(message){
      if(evaled === "Already up-to-date."){
        e.edit("There was nothing to update")
        message.edit("There was nothing to update")
      }else{
        e.edit("I have downloaded all the new files but you will need to restart for it to take effect, I will now shut down").then(function(r){
        message.edit("I have downloaded all the new files but you will need to restart for it to take effect, I will now shut down").then(function(t){
          process.exit(0)
        })
      })
      }
    })
})
  }
}

command.shutdown = {
  "name":"shutdown",
  "usage":"shutdown <reason>",
  "description":"Restarts bot",
  "process":function(bot,msg,env){
    msg.channel.sendMessage("Shutdown initiated! Bot shutting down...");
    process.exit(1);
  }
}

module.exports = command
