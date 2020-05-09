const Discord = require('discord.js');

module.exports = async (bot, emoji) => {
  const rows = await bot.db.query(`SELECT * FROM serverInfo WHERE serverID = '${emoji.guild.id}'`).catch(console.error);
  const logYN = rows[0].serverLog;
  if (logYN === 'Y') {
    const botPerms = emoji.guild.me.permissions.has(['SEND_MESSAGES', 'VIEW_AUDIT_LOG', 'EMBED_LINKS', 'MANAGE_EMOJIS'], true);
    if (!botPerms) { return; } else if (botPerms) {
      const logChannel = emoji.guild.channels.find(channel => channel.id === rows[0].serverClogID);
      let executor;
      try {
        executor = await emoji.fetchAuthor().then(user => user.id).catch(console.log);
      } catch (e) {
        console.log(e);
      }

      const embed = new Discord.RichEmbed()
      .setAuthor('Emoji created')
      .setDescription(`By: <@${executor}> \nName: **${emoji.name}**\n ID: **${emoji.id}**`)
      .setColor('#42f456')
      .setTimestamp();

      if (!logChannel) { return; } else if (logChannel) { return logChannel.send(embed); }
    }
  } else { return; }
};
module.exports.help = {
  name: ''
};
