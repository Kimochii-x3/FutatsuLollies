const Discord = require('discord.js');

module.exports = async (bot, oldMember, newMember) => {
  setTimeout(async () => {
    const rows = await bot.db.query(`SELECT * FROM serverInfo WHERE serverID = '${oldMember.guild.id}'`).catch(console.error);
    const logYN = rows[0].serverLog;
    if (logYN === 'Y') {
      const botPerms = newMember.guild.me.permissions.has(['SEND_MESSAGES', 'VIEW_AUDIT_LOG', 'EMBED_LINKS'], true);
      if (!botPerms) { return; } else if (botPerms) {
        const logChannel = oldMember.guild.channels.find(channel => channel.id === rows[0].serverClogID);
        const log = await oldMember.guild.fetchAuditLogs({ limit: 1 }).then(aLog => aLog.entries.first());
        if (log.action === 'MEMBER_ROLE_UPDATE') {
          const uTarget = log.target.id;
          if (log.changes[0].key === '$add') {
            const role = oldMember.guild.roles.find(r => r.id === log.changes[0].new[0].id);
            const r$Add = new Discord.RichEmbed()
            .setAuthor('Role added to member')
            .setDescription(`Member: <@${uTarget}>\nRole: ${role}`)
            .setColor('#14cdfc')
            .setTimestamp();

            return logChannel.send(r$Add);
          } else if (log.changes[0].key === '$remove') {
            const role = oldMember.guild.roles.find(r => r.id === log.changes[0].new[0].id);
            const r$Remove = new Discord.RichEmbed()
            .setAuthor('Role removed from member')
            .setDescription(`Member: <@${uTarget}>\nRole: ${role}`)
            .setColor('#fc2b14')
            .setTimestamp();

            return logChannel.send(r$Remove);
          }
        } else if (log.action === 'MEMBER_UPDATE') {
          if (log.changes[0].old === undefined) {
            const nick = new Discord.RichEmbed()
            .setAuthor('Changed nickname')
            .setDescription(`Member: ${oldMember.user}\nFrom: **${log.target.username}**\nTo: **${log.changes[0].new}**`)
            .setColor('GREY')
            .setTimestamp();

            return logChannel.send(nick);
          } else if (log.changes[0].new !== undefined) {
            const nick = new Discord.RichEmbed()
            .setAuthor('Changed nickname')
            .setDescription(`Member: ${oldMember.user}\nFrom: **${log.changes[0].old}**\nTo: **${log.changes[0].new}**`)
            .setColor('GREY')
            .setTimestamp();

            return logChannel.send(nick);
          } else if (log.changes[0].new === undefined) {
            const nick = new Discord.RichEmbed()
            .setAuthor('Removed nickname')
            .setDescription(`Member: ${oldMember.user}\nFrom: **${log.changes[0].old}**\nTo: **${log.target.username}**`)
            .setColor('GREY')
            .setTimestamp();

            return logChannel.send(nick);
          }
        }
      }
    } else { return; }
  }, 1000);
};
module.exports.help = {
  name: ''
};
