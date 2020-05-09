const Discord = require('discord.js');

module.exports = async (bot, member) => {
  const rows = await bot.db.query(`SELECT * FROM serverInfo WHERE serverID = '${member.guild.id}'`).catch(console.error);
  const logYN = rows[0].serverLog;
  if (logYN === 'Y') {
    const botPerms = member.guild.me.permissions.has(['SEND_MESSAGES', 'VIEW_AUDIT_LOG', 'EMBED_LINKS'], true);
    if (!botPerms) { return; } else if (botPerms) {
      const logChannel = member.guild.channels.find(channel => channel.id === rows[0].serverClogID);
      const tempTimestamp = Date.now();
      const aLogFound = await member.guild.fetchAuditLogs({ type: 'MEMBER_KICK', limit: 1 }).then(aLog => aLog.entries.first()).catch(console.error);
      if (aLogFound) {
        const uTarget = aLogFound.target; // await member.guild.fetchAuditLogs({ type: 'MEMBER_KICK', limit: 1 }).then(aLog => aLog.entries.first().target).catch(console.error);
        // let uTarget2 = await member.guild.fetchAuditLogs({type: 'MEMBER_KICK', limit: 1}).then(aLog => aLog.entries.first()).then(aLog2 => aLog2.target).then(user => user.id);
        const aLogTimestamp = aLogFound.createdTimestamp; // await member.guild.fetchAuditLogs({ type: 'MEMBER_KICK', limit: 1 }).then(aLog => aLog.entries.first()).then(aLog2 => aLog2.createdTimestamp).catch(console.error);
        // const memberLeft = await bot.fetchUser(member.id, true).then(u => u.tag);
        const userRole = member.guild.roles.find(role => role.name === `USER-${member.id}`);

        const embedLeave = new Discord.RichEmbed()
        .setAuthor('User leave')
        .setDescription(`Username: **${member.user.tag}**`)
        .setColor('#c4150f')
        .setTimestamp();

        if (tempTimestamp <= aLogTimestamp + 10000) {
          if (uTarget.id !== member.id) {
            if (userRole) { userRole.delete(`Member ${member.user.tag} left the server'`); }
            if (!logChannel) { return; } else if (logChannel) { return logChannel.send(embedLeave); }
          } else if (uTarget.id === member.id) {
            const executor = await member.guild.fetchAuditLogs({ type: 'MEMBER_KICK', limit: 1 }).then(aLog => aLog.entries.first().executor).then(user => user.id);
            const embedKick = new Discord.RichEmbed()
            .setAuthor('User kicked')
            .setDescription(`Moderator: <@${executor}>\n Member: **${member.user.tag}**`)
            .setColor('#c4150f')
            .setTimestamp();
            if (userRole) { userRole.delete(`Member ${member.user.tag} was kicked from the server`); }
            if (!logChannel) { return; } else if (logChannel) { return logChannel.send(embedKick); }
          }
        } else if (tempTimestamp >= aLogTimestamp + 10000) {
          if (userRole) { userRole.delete(`Member ${member.user.tag} left the server`); }
          if (!logChannel) { return; } else if (logChannel) { return logChannel.send(embedLeave); }
        }
      } else {
        const embedLeave = new Discord.RichEmbed()
        .setAuthor('User leave')
        .setDescription(`Username: **${member.user.tag}**`)
        .setColor('#c4150f')
        .setTimestamp();

        if (!logChannel) { return; } else if (logChannel) { return logChannel.send(embedLeave); }
        }
    }
  } else { return; }
};
module.exports.help = {
  name: ''
};
