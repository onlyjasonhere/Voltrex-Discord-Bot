var command = {}
const child_process = require('child_process');

command.update = {
  "name":"gitupdate",
  "usage":"gitupdate",
  "description":"For Admins Only - Updates Bot",
  "process":function(bot,msg,env){
    msg.channel.sendMessage("Ok updating and then shutting down")
    child_process.execSync('git pull');
    process.exit(1);
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
