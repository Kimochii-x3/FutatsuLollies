const Discord = require("discord.js");

module.exports = {
  name: 'log',
  description: 'enable/disable event logging (requires the logging channel and permissions)',
  usage: 'fl.log Y/N -set (to set the logging; Y = yes; N = no)',
  args: true,
  execute(bot, message, args, option, commands, prefix) {
    // console.log(option);
    if (args[0]) {
      if (option[1] === 'set'){
        if (message.member.permissions.has(['ADMINISTRATOR'], true)){
          if(args[0].toLowerCase() == 'y') {
            let sql = `UPDATE serverInfo SET serverLog = '${args[0].toUpperCase()}' WHERE serverID = ${message.guild.id}`
            // console.log(sql);
            bot.db.query(sql);
            message.channel.send(`Successfully **enabled** the logging`)
          }
          else if (args[0].toLowerCase() == 'n') {
            let sql = `UPDATE serverInfo SET serverLog = '${args[0].toUpperCase()}' WHERE serverID = ${message.guild.id}`
            // console.log(sql);
            bot.db.query(sql);
            message.channel.send(`Successfully **disabled** the logging`)
          }
          else {
            message.reply('allowed only `y` for `yes` or `n` for `no`')
          }
        }
        else {
          return message.reply('you do not have administrator permission');
        }
      }
    }
  },
};
