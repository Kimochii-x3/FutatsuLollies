const Discord = require('discord.js');
// channel command used to set the logging channel for a server
module.exports = {
  name: 'channel',
  description: 'set the event logging channel requires to have event logging enabled as well and the permissions requested upon inviting the bot [you need administator permission]',
  usage: 'fl.channel #<channel name> -set',
  args: true,
  async execute(bot, message, args, option, commands, prefix) {
    const botOwner = bot.users.get('254349985963835393');
    if (args[0]) {
      if (option[1] === 'set') {
        if (message.member.permissions.has(['ADMINISTRATOR'], true) || message.author.id === botOwner.id) {
          const cID = message.mentions.channels.first();
          if (cID) {
            await bot.db.query(`UPDATE serverInfo SET serverClogID = '${cID.id}' WHERE serverID = ${message.guild.id}`).catch(console.error);
            return message.channel.send(`Successfully **changed** the logging channel to ${cID}`);
          } else if (!cID) {
            return message.reply('issue occured, check if you have mentioned a channel');
          }
        } else {
          return message.reply('you do not have administrator permission');
        }
      } else if (option[1] === 'remove') {
        if (message.member.permissions.has(['ADMINISTRATOR'], true) || message.author.id === botOwner.id) {
          await bot.db.query(`UPDATE serverInfo SET serverClogID = '${null}' WHERE serverID = ${message.guild.id}`).catch(console.error);
          message.channel.send('Successfully **nullified** the logging channel in the database');
        } else {
          return message.reply('you do not have administrator permission');
        }
      }
    }
  },
};
