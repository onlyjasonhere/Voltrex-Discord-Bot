var command = {}

command.coinflip = {
    "name": "coinflip",
    "usage": "coinflip",
    "description": "Coinflip command",
    "process": function(bot, msg, env) {
        let coin = Math.random() > 0.5 ? 'Heads' : 'Tails'
        msg.channel.sendMessage("The coin landed on " + `${coin}!`);
    }
}

module.exports = command
