const Discord = require('discord.js');

module.exports = async (bot, emoji) => {
  const rows = await bot.db.query(`SELECT * FROM serverInfo WHERE serverID = '${emoji.guild.id}'`).catch(console.error);
    const logYN = rows[0].serverLog;
    if (logYN === 'Y') {
    const botPerms = emoji.guild.me.permissions.has(['SEND_MESSAGES', 'VIEW_AUDIT_LOG', 'EMBED_LINKS'], true);
    if (!botPerms) { return; } else if (botPerms) {
      const logChannel = emoji.guild.channels.find(channel => channel.id === rows[0].serverClogID);
      let executor;
      try {
        executor = await emoji.guild.fetchAuditLogs({ type: 'EMOJI_DELETE', limit: 1 }).then(aLog => aLog.entries.first().executor).then(user => user.id);
      } catch (e) {
        console.log(e);
      }
      const embed = new Discord.RichEmbed()
      .setAuthor('Emoji deleted')
      .setDescription(`By: <@${executor}> \nName: **${emoji.name}**\n ID: **${emoji.id}**`)
      .setColor('#ff3a28')
      .setTimestamp();

      if (!logChannel) { return; } else if (logChannel) { return logChannel.send(embed); }
    }
  } else { return; }
};
module.exports.help = {
  name: ''
};
