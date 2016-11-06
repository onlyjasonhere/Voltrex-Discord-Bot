var command = {}
const child_process = require('child_process');

command.gitupdate = {
  "name":"gitupdate",
  "usage":"gitupdate",
  "description":"For Admins Only - Updates Bot",
  "process":function(bot,msg,env){
    child_process.execSync('git pull');
    process.exit(1);
  }
}

command.shutdown = {
  "name":"shutdown",
  "usage":"shutdown <reason>",
  "description":"Restarts bot",
  "process":function(bot,msg,env){
    msg.reply("shutdown initiated! Bot shutting down...");
    process.exit(1);
  }
}
