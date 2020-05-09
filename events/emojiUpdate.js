const Discord = require('discord.js');

module.exports = async (bot, oldEmoji, newEmoji) => {
  const rows = await bot.db.query(`SELECT * FROM serverInfo WHERE serverID = '${oldEmoji.guild.id}'`).catch(console.error);
  const logYN = rows[0].serverLog;
  if (logYN === 'Y') {
    const botPerms = newEmoji.guild.me.permissions.has(['SEND_MESSAGES', 'VIEW_AUDIT_LOG', 'EMBED_LINKS'], true);
    if (!botPerms) { return; } else if (botPerms) {
      let executor;
      try {
        executor = await newEmoji.guild.fetchAuditLogs({ type: 'EMOJI_UPDATE', limit: 1 }).then(aLog => aLog.entries.first().executor).then(user => user.id);
      } catch (e) {
        console.log(e);
      }
      const logChannel = newEmoji.guild.channels.find(channel => channel.id === rows[0].serverClogID);
      if (executor) {
        const embed = new Discord.RichEmbed()
        .setAuthor('Emoji renamed')
        .setDescription(`By: <@${executor}> \nFrom: **${oldEmoji.name}**\n To: **${newEmoji.name}**`)
        .setColor('#2381ee')
        .setTimestamp();

        if (!logChannel) { return; } else if (logChannel) { return logChannel.send(embed); }
      } else if (!executor) {
        const embed = new Discord.RichEmbed()
        .setAuthor('Emoji renamed')
        .setDescription(`From: **${oldEmoji.name}**\n To: **${newEmoji.name}`)
        .setColor('#2381ee')
        .setTimestamp();

        if (!logChannel) { return; } else if (logChannel) { return logChannel.send(embed); }
      }
    }
  } else { return; }
};
module.exports.help = {
  name: ''
};
