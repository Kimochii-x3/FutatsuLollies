const Discord = require('discord.js');

module.exports = async (bot, oldChannel, newChannel) => {
  const rows = await bot.db.query(`SELECT * FROM serverInfo WHERE serverID = '${oldChannel.guild.id}'`).catch(console.error);
  if (rows[0].serverLog === 'Y') {
    const botPerms = oldChannel.guild.me.permissions.has(['SEND_MESSAGES', 'VIEW_AUDIT_LOG', 'EMBED_LINKS'], true);
    if (!botPerms) { return; } else if (botPerms) {
      const logChannel = oldChannel.guild.channels.find(channel => channel.id === rows[0].serverClogID);
      const executor = await oldChannel.guild.fetchAuditLogs({ type: 'CHANNEL_UPDATE', limit: 1 }).then(aLog => aLog.entries.first().executor).then(u => u.id).catch(() => {});
       if (rows[0].muteRoleID !== null) {
          const mtr = newChannel.guild.roles.find(r => r.id === rows[0].muteRoleID);
          if (newChannel.guild.me.permissions.has(['MANAGE_ROLES', 'VIEW_AUDIT_LOG'], true)) {
            if (newChannel.type === 'category') {
              const prmToCheck = ['SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'ADD_REACTIONS', 'EMBED_LINKS', 'ATTACH_FILES', 'SPEAK', 'USE_VAD'];
              for (const prm of prmToCheck) {
                let prmSingle = Discord.Permissions.FLAGS[prm];
                if (!(newChannel.permissionOverwrites.get(mtr.id).deny & prmSingle)) {
                  await newChannel.overwritePermissions(mtr, { [prm]: false }, `Updating perms for ${newChannel.type} named ${newChannel.name}`).catch(console.error);
                } else if (newChannel.permissionOverwrites.get(mtr.id).deny & prmSingle) {
                    return;
                }
              }
            } else if (newChannel.type === 'voice') {
              const denyPrm = ['SPEAK', 'USE_VAD'];
              for (const prm of denyPrm) {
                let prmSingle = Discord.Permissions.FLAGS[prm];
                if (!(newChannel.permissionOverwrites.get(mtr.id).deny & prmSingle)) {
                  await newChannel.overwritePermissions(mtr, { [prm]: false }, `Updating perms for ${newChannel.type} named ${newChannel.name}`).catch(console.error);
                } else if ((newChannel.permissionOverwrites.get(mtr.id).deny & prmSingle)) {
                    return;
                }
              }
            } else if (newChannel.type === 'text') {
              const denyPrm = ['SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'ADD_REACTIONS', 'EMBED_LINKS', 'ATTACH_FILES'];
              for (const prm of denyPrm) {
                let prmSingle = Discord.Permissions.FLAGS[prm];
                if (!(newChannel.permissionOverwrites.get(mtr.id).deny & prmSingle)) {
                  await newChannel.overwritePermissions(mtr, { [prm]: false }, `Updating perms for ${newChannel.type} named ${newChannel.name}`).catch(console.error);
                } else if (newChannel.permissionOverwrites.get(mtr.id).deny & prmSingle) {
                    return;
                }
              }
            }
          }
        }

      if (executor) {
        const embedName = new Discord.RichEmbed()
        .setAuthor('Channel name changed')
        .setDescription(`By: <@${executor}>\nFrom: **${oldChannel.name}**\nTo: **${newChannel.name}**`)
        .setColor('YELLOW')
        .setTimestamp();
        const embedTopic = new Discord.RichEmbed()
        .setAuthor('Channel topic changed')
        .setDescription(`By: <@${executor}>\nFrom: **${oldChannel.topic}**\nTo: **${newChannel.topic}**`)
        .setColor('YELLOW')
        .setTimestamp();

        if (oldChannel.name === newChannel.name) {
          if (oldChannel.topic !== newChannel.topic) {
            if (!logChannel) { return; } else if (logChannel) { return logChannel.send(embedTopic); }
          } else if (oldChannel.topic === newChannel.topic) {
            return;
          }
        }
        if (oldChannel.name !== newChannel.name) {
          if (!logChannel) { return; } else if (logChannel) { return logChannel.send(embedName); }
        }
      } else if (!executor) {
        const embedName = new Discord.RichEmbed()
        .setAuthor('Channel name changed')
        .setDescription(`From: **${oldChannel.name}**\n To: **${newChannel.name}**`)
        .setColor('YELLOW')
        .setTimestamp();

        const embedTopic = new Discord.RichEmbed()
        .setAuthor('Channel topic changed')
        .setDescription(`From: **${oldChannel.topic}**\n To: **${newChannel.topic}**`)
        .setColor('YELLOW')
        .setTimestamp();

        if (oldChannel.name === newChannel.name) {
          if (oldChannel.topic !== newChannel.topic) {
            if (!logChannel) { return; } else if (logChannel) { return logChannel.send(embedTopic); }
          } else if (oldChannel.topic === newChannel.topic) { return; }
        }
        if (oldChannel.name !== newChannel.name) {
          if (!logChannel) { return; } else if (logChannel) { return logChannel.send(embedName); }
        }
      }
    }
  } else { return; }
};
module.exports.help = {
  name: ''
};
