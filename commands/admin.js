var command = {}
const child_process = require('child_process');

command.gitupdate = {
  "name":"gitupdate",
  "usage":"gitupdate",
  "description":"For Admins Only - Updates Bot",
  "process":function(bot,msg,env){
    child_process.execSync('git pull');
    process.exit(0);
  }
}
