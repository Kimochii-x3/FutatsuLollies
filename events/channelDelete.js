const Discord = require('discord.js');

module.exports = async (bot, channel) => {
    const rows = await bot.db.query(`SELECT * FROM serverInfo WHERE serverID = '${channel.guild.id}'`).catch(console.error);
    const logYN = rows[0].serverLog;
    if (logYN === 'Y') {
      const botPerms = channel.guild.me.permissions.has(['SEND_MESSAGES', 'VIEW_AUDIT_LOG', 'EMBED_LINKS'], true);
      if (!botPerms) { return; } else if (botPerms) {
        const logChannel = channel.guild.channels.find(() => channel.id === rows[0].serverClogID);
        let executor;
        try {
          executor = await channel.guild.fetchAuditLogs({ type: 'CHANNEL_DELETE', limit: 1 }).then(aLog => aLog.entries.first().executor).then(u => u.id);
        } catch (e) {
          console.log(e);
        }
        if (executor) {
          const embed = new Discord.RichEmbed()
          .setAuthor('Channel/Category deleted')
          .setDescription(`By: <@${executor}>\nName: **${channel.name}**`)
          .setColor('RED')
          .setTimestamp();

          if (!logChannel) { return; } else if (logChannel) { return logChannel.send(embed); }
        } else if (!executor) {
          const embed = new Discord.RichEmbed()
          .setAuthor('Channel/Category deleted')
          .setDescription(`Name: **${channel.name}**`)
          .setColor('RED')
          .setTimestamp();

          if (!logChannel) { return; } else if (logChannel) { return logChannel.send(embed); }
        }
      }
    } else { return; }
};
module.exports.help = {
  name: ''
};
