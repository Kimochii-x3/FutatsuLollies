const Discord = require('discord.js');

module.exports = {
  name: 'log',
  description: 'enable/disable event logging (you need administator permission to use this command)',
  usage: 'fl.log Y/N -set (to set the logging; Y = yes; N = no)',
  args: true,
  async  execute(bot, message, args, option, commands, prefix) {
    // console.log(option);
    let botOwner = bot.users.get('254349985963835393');
    if (args[0]) {
      if (option[1] === 'set') {
        if (message.member.permissions.has(['ADMINISTRATOR'], true) || message.author.id === botOwner.id) {
          if (args[0].toLowerCase() === 'y') {
            await bot.db.query(`UPDATE serverInfo SET serverLog = '${args[0].toUpperCase()}' WHERE serverID = ${message.guild.id}`).catch(console.error);
            // let sql = `UPDATE serverInfo SET serverLog = '${args[0].toUpperCase()}' WHERE serverID = ${message.guild.id}`
            // console.log(sql);
            message.channel.send('Successfully **enabled** the logging');
          } else if (args[0].toLowerCase() === 'n') {
            await bot.db.query(`UPDATE serverInfo SET serverLog = '${args[0].toUpperCase()}' WHERE serverID = ${message.guild.id}`).catch(console.error);
            // let sql = `UPDATE serverInfo SET serverLog = '${args[0].toUpperCase()}' WHERE serverID = ${message.guild.id}`
            // console.log(sql);
            message.channel.send('Successfully **disabled** the logging');
          } else {
            message.reply('allowed only `y` for `yes` or `n` for `no`');
          }
        } else {
          return message.reply('you do not have `administrator` permission');
        }
      }
    }
  },
};
