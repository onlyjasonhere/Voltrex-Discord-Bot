var Discord = require("discord.js");
var bot = new Discord.Client();
var prefix = "v!" //You can change this to a prefix you like but, PLEASE DON'T USE "!"
var general = require("./commands/general.js")
var admin = require("./commands/admin.js")
var args = require("optimist").argv
var custom = require("./data/customcoms.json")
var fs = require("fs")

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
    --token           The token to start the bot with
    --git, -g         Link to github repo,
    --owner           Set owner id for when bot is run
    --help, -h        Shows this message
    --admins          Set IDs for people who should be able to acces admin commands`)
    process.exit()
}

if (args.g || args.git) {
    console.log("My github link: https://github.com/Betaaaaa/Voltrex-Discord-Bot")
    process.exit(0)
}

if (args.admins) {

    var admins = args.admins.toString().split(" ")
    console.log("Setting admins: " + admins)
} else {
    console.log("No admins specified, just taking owner argument")
    var admins = []
}

bot.on("error", () => {
    console.log(error)
})

bot.on("ready", () => {
    console.log("Bot is online and ready on " + bot.guilds.size + " servers!");
    bot.user.setGame(prefix + 'help | ' + bot.guilds.size + ' Servers', "https://twitch.tv/beta_rocket");
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
    if (msg.content.startsWith(prefix)) {
        var cmd = msg.content.replace(prefix, "")
        var cmd = cmd.trim()
        if (custom[msg.guild.id]) {
            if (custom[msg.guild.id][cmd]) {
                var toSend = custom[msg.guild.id][cmd]

                toSend = toSend.replace(/{user}/gi, msg.author.toString())
                toSend = toSend.replace(/{id}/gi, msg.author.id)
                toSend = toSend.replace(/{username}/gi, msg.author.username)
                toSend = toSend.replace(/{discriminator}/gi, msg.author.discriminator)
                toSend = toSend.replace(/{server}/gi, msg.guild.name)
                toSend = toSend.replace(/{serverid}/gi, msg.guild.id)
                toSend = toSend.replace(/{channel}/gi, "<#" + msg.channel.id + ">")
                toSend = toSend.replace(/{channelid}/gi, msg.channel.id)


                msg.channel.sendMessage(toSend)
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
        "owner": owner,
        "admin": admin
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

    if (msg.author.id === owner || admins.indexOf(msg.author.id) != -1) {
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
