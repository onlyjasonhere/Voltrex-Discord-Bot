var Discord = require("discord.js");
var bot = new Discord.Client();
var prefix = "v!" //You can change this to a prefix you like but, PLEASE DON'T USE "!"
var general = require("./commands/general.js")
var admin = require("./commands/admin.js")
var args = require("optimist").argv

if (process.env.BOT_TOKEN) {
    var token = process.env.BOT_TOKEN
} else {
    // Put your token below if you are not using an environment variable
    if (args.token) {
        // This code is for if you incorporate token when running bot
        var token = args.token
    } else {
        // If your too lazy to do any of these put your token below:
        var token = "BOT-TOKEN"
    }
}

if (process.env.OWNER_ID) {
    var owner = String(process.env.OWNER_ID)
} else {
    if (args.owner) {
        var owner = args.owner
    } else {
        // Put your ID here
        var owner = "ID"
    }

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
    --token           The token to start the bot with
    --git, -g         Link to github repo,
    --owner           Set owner id for when bot is run
    --help, -h        Shows this message`)
    process.exit()
}

if (args.g || args.git) {
    console.log("My github link: https://github.com/Betaaaaa/Voltrex-Discord-Bot")
    process.exit(0)
}

bot.on("error", () => {
    console.log(error)
})

bot.on("ready", () => {
    console.log("Bot is online and ready on " + bot.guilds.size + " servers!");
    bot.user.setStatus("online", prefix + 'help | ' + bot.guilds.size + ' Servers');
});

bot.on('guildMemberAdd', function(member) {
    if(member.guild.channels.find("name","v-logs")){
        member.guild.channels.find("name","v-logs").sendMessage("```diff\n+ " + member.user.username + "\n(" + member.user.id + ")```");
      }
});

bot.on('guildBanAdd', (member) => {
  if(member.guild.channels.find("name","v-logs")){
      member.guild.channels.find("name","v-logs").sendMessage("```diff\n! " + member.user.username + "\n(" + member.user.id + ")```");
    }
});

bot.on('guildMemberRemove', (member) => {
  if(member.guild.channels.find("name","v-logs")){
      member.guild.channels.find("name","v-logs").sendMessage("```diff\n- " + member.user.username + "\n(" + member.user.id + ")```");
    }
});

bot.on("message", function(msg) {
    if (msg.author.id === owner) {
        if (msg.content === prefix + "reload") {
            try {
                delete require.cache[require.resolve("./commands/general.js")]
                general = require("./commands/general.js")
                msg.channel.sendMessage("Files reloaded!")
            } catch (err) {
                msg.channel.sendMessage("Could not reload files, error: ```" + err.stack + "```")
            }
        }
    }
})

bot.on("message", function(msg) {


    var env = {
        "bot": bot,
        "msg": msg,
        "general": general,
        "process": process,
        "prefix": prefix,
        "owner":owner
    }

    var input = msg.content.toLowerCase();
    if (!input.startsWith(prefix)) return;
    if (msg.author.bot) return;

    var input = msg.content.toLowerCase().replace(prefix, "");
    for (var x of Object.keys(general)) {
        if (input.startsWith(x)) {
            try {
                general[x].process(bot, msg, env);
            } catch (err) {
                msg.reply("It seems I could not process that command properely, the bot developer has been notified")
                console.log("Error processing " + msg.content + ", error was: " + err.stack)
            }
            break;
        }
    }

    if(msg.author.id === owner){
      for (var x of Object.keys(admin)) {
          if (input.startsWith(x)) {
              try {
                  admin[x].process(bot, msg, env);
              } catch (err) {
                  msg.reply("It seems I could not process that command properely, the bot developer has been notified")
                  console.log("Error processing " + msg.content + ", error was: " + err.stack)
              }
              break;
          }
      }
    }
});

bot.login(token);
