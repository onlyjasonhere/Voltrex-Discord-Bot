var Discord = require("discord.js");
var bot = new Discord.Client();
var args = require("optimist").argv

var fs = require("fs")

var Commands = new Map()

try {
	var config = require("./config.json");
} catch (err) {
	try {
		var config = require("./config-example.json")
	} catch (err) {
		console.log("No Config or example config found, oh well, we can try and start without it")
	}
}

if (args.prefix) {
	var prefix = args.prefix
} else {
	if (process.env.BOT_PREFIX) {
		var prefix = process.env.BOT_PREFIX
	} else {
		var prefix = config.prefix //You can change this to a prefix you like but, PLEASE DON'T USE "!"
	}
}

if (process.env.BOT_TOKEN) {
	var token = process.env.BOT_TOKEN
} else {
	// Put your token below if you are not using an environment variable
	if (args.token) {
		// This code is for if you incorporate token when running bot
		var token = args.token
	} else {
		// If your too lazy to do any of these put your token below:
		var token = config.token
	}
}

if (process.env.OWNER_ID) {
	var owner = String(process.env.OWNER_ID)
} else {
	if (args.owner) {
		var owner = args.owner
	} else {
		// Put your ID here
		var owner = config.owner
	}
}

if (args.admins) {
	var admins = args.admins.toString().split(" ")
	console.log("Setting admins: " + admins)
} else {
	console.log("No admins specified, reading from config.json")
	var admins = config.admins
}

if (owner != "ID") {
	console.log("Owner set: " + owner)
} else {
	console.log("I have no owner, I will respond to no admin commands")
}

if (args.h || args.help) {
	console.log("")
	console.log("I am an instance of Beta's open source discord.js bot")
	console.log("I was written to be modular and allow users to create plugins")
	console.log("To start me you can do one of the 3 following options")
	console.log("\n")

	console.log("1. Change the values in bot.js and type 'node bot.js'")
	console.log("")
	console.log("2. Set 2 environment variables called BOT_TOKEN and OWNER_ID (the contents of them is obvious)")
	console.log("")
	console.log("3. Run this command: 'node bot.js --token [TOKEN] --owner [OWNER ID]'")

	console.log("\n\n")
	console.log(`
Other possible start up flags:
    --token                        The token to start the bot with
    --git, -g                      Link to github repo,
    --owner                        Set owner id for when bot is run
    --help, -h                     Shows this message
    --admins "[ID1] [ID2]"         Set IDs for people who should be able to acces admin commands
    --prefix, -p                   Sets prefix for the bot to run`)
	process.exit()
}

if (args.g || args.git) {
	console.log("My github link: https://github.com/Betaaaaa/Voltrex-Discord-Bot")
	process.exit(0)
}

function loadCommands(){

return new Promise(function(resolve,reject){

try{
var files = fs.readdirSync('./plugins')
for(var file of files){
Commands.set(file.replace(/\.js/gi,""),require("./plugins/"+file))
}
resolve()
}catch(err){
reject(err)
}

})

}


function loadCommand(name){
	return new Promise(resolve,reject){
		try{
			Commands.set(name,require("./commands/"+name+".js"))
			resolve(Commands.get(name))
		}catch(err){
			reject(err)
		}
	}
}

function unloadCommand(name){
	return new Promise(resolve,reject){
		try{
			Commands.delete(name)
			resolve()
		}catch(err){
			reject(err)
		}
	}
}

function reloadCommand(name){
	return new Promise(resolve,reject){
		try{
			unloadCommand(name).then(function(){
				delete require.cache[require.resolve('./commands/'+name+'.js')]
				loadCommand(name).then(function(command){
					resolve(command)
				}).catch()
			}).catch(function(err){
				reject(err)
			})
		}catch(err){
			reject(err)
		}
	}
}

bot.on("error", () => {
	console.log(error)
})

bot.on("ready", () => {
	loadPlugins().then(function(){
	console.log("Bot is online and ready on " + bot.guilds.size + " servers! There are "+Commands.size+" commands loaded!");
	bot.user.setGame(prefix + 'help | ' + bot.guilds.size + ' Servers', "https://twitch.tv/beta_rocket");
}).catch(function(err){
	console.log("I couldn't load something properely, did you modify me? Error: \n"+err.stack)
	process.exit(1)
})
});

bot.on('guildMemberAdd', function(member) {
	if (member.guild.channels.find("name", "v-logs")) {
		member.guild.channels.find("name", "v-logs").sendMessage("```diff\n+ " + member.user.username + "\n(" + member.user.id + ")```");
	}
});



bot.on('guildMemberRemove', (member) => {
	if (member.guild.channels.find("name", "v-logs")) {
		member.guild.channels.find("name", "v-logs").sendMessage("```diff\n- " + member.user.username + "\n(" + member.user.id + ")```");
	}
});

bot.on("message", function(msg) {


	if (!msg.guild && msg.content.indexOf(prefix + "help") != 0 && msg.author.id != bot.user.id) return msg.channel.sendMessage("Sorry but I can not function in Direct Messages, try again in a server")
	if (msg.content.startsWith(prefix)) {
		if (!msg.guild) return msg.channel.sendMessage("Sorry but I can not function in Direct Messages, try again in a server").then(function() {

			return
		})
		var cmd = msg.content.replace(prefix, "")
		var cmd = cmd.trim()

if(Commands.has(cmd)){
	var env = new Map()
	env.set("bot",bot)
	env.set("msg",msg)
	env.set("Commands",Commands)
	env.set("config",config)
try{
	Commands.get(cmd).run(bot,msg,env)
}catch(err){
	unloadCommand(name).then(function(){
		msg.channel.sendMessage("That command failed to run, I am going to unload it")
	}).catch(function(err){
		msg.channel.sendMessage("That command failed to run, and I couldn't unload it either :(")
	})
}
}


});

bot.login(token);
