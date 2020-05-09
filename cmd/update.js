const Discord = require('discord.js');

module.exports = {
  name: 'update',
  description: 'used to update the bot\'s status [bot owner restricted]',
  usage: 'fl.update',
  args: false,
  async execute(bot, message, args, option, commands, prefix) {
    const botOwner = bot.users.get('254349985963835393');
    if (message.author.id === botOwner.id) {
      const status = option.shift();
      if (option[0] === 'set') {
        await bot.db.query(`UPDATE botStats SET motd = '${status}'`).catch(console.error);
        await bot.user.setActivity(`${bot.guilds.size} servers // fl.help / MOTD: ${status}`, { type: 'WATCHING' }).catch(console.error);
      } else if (option[0] === 'delete') {
        await bot.user.setActivity(`${bot.guilds.size} servers // fl.help`, { type: 'WATCHING' }).catch(console.error);
        await bot.db.query('UPDATE botStats SET motd = \'\'').catch(console.error);
      } else if (option[0] === 'guilds') {
        const botGuildsCh = bot.channels.get('681880245871050763');
        const guildNames = [];
        const guildLookups = bot.guilds.map(g => `${g.name}\n ${g.id} ${g.owner}`);
        for (const g of guildLookups) {
          guildNames.push(g);
        }
        botGuildsCh.send(guildNames, { split: true });
      } else if (option[0] === 'server') {
        const guildName = bot.guilds.has(status.trim());
        console.log(guildName);
      }
   } else {
     return message.reply('this command can be executed only from bot owner');
   }
  },
};
