const Discord = require('discord.js');

module.exports = {
  name: 'prefix',
  description: 'showcases or changes the prefix for the server, limited to 3 characters, you can also do `@FutatsuLollies prefix?` to see the prefix',
  usage: 'fl.prefix / fl.prefix <prefix> -set',
  args: false,
  async execute(bot, message, args, option, commands, prefix) {
  const botOwner = bot.users.get('254349985963835393');
    if (!args[0]) {
      return message.channel.send(`The prefix for this server is: \`${prefix}\`, default prefix is: \`fl.\``);
    } else if (args[0]) {
      if (option[1] === 'set') {
        if (message.member.permissions.has(['ADMINISTRATOR'], true) || message.author.id === botOwner.id) {
          if (args[0].length > 3) {
            message.reply('maximum allowed characters for prefix is 3');
          } else if (args[0].length <= 3) {
            await bot.db.query(`UPDATE serverInfo SET prefix = '${args[0].toLowerCase()}' WHERE serverID = ${message.guild.id}`).catch(console.error);
            return message.channel.send(`Successfully changed the prefix to \`${args[0].toLowerCase()}\``);
          }
        } else {
          return message.reply('you do not have administrator permission');
        }
      }
    }
  },
};
