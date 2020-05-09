const Discord = require('discord.js');

module.exports = async (bot, channel) => {
  const tempTimestamp = Date.now();
  if (channel.type === 'dm') {
    return;
  } else if (tempTimestamp <= channel.createdTimestamp + 30000) {
    setTimeout(async () => {
     const rows = await bot.db.query(`SELECT * FROM serverInfo WHERE serverID = '${channel.guild.id}'`).catch(console.error);
        const logYN = rows[0].serverLog;
        if (logYN === 'Y') {
          const botPerms = channel.guild.me.permissions.has(['SEND_MESSAGES', 'VIEW_AUDIT_LOG', 'EMBED_LINKS'], true);
          if (!botPerms) {
            return;
          } else if (botPerms) {
              const logChannel = channel.guild.channels.find(() => channel.id === rows[0].serverClogID);
              let executor;
              try {
              executor = await channel.guild.fetchAuditLogs({ type: 'CHANNEL_CREATE', limit: 1 }).then(aLog => aLog.entries.first().executor).then(u => u.id).catch(() => {});
              } catch (e) {
                console.log(e);
              }
              if (channel.type === 'category') {
                  channel.overwritePermissions(channel.guild.roles.find(r => r.id === rows[0].muteRoleID), { SEND_MESSAGES: false, SEND_TTS_MESSAGES: false, ADD_REACTIONS: false, EMBED_LINKS: false, ATTACH_FILES: false, SPEAK: false, USE_VAD: false }, 'Updating perms for the mute role').catch(console.error);
                  console.log(`Denying perms for ${rows[0].muteRoleID} in channel ${channel.id} of server ${channel.guild.id}`);
              } else if (channel.type === 'voice') {
                if (!(channel.permissionOverwrites.get(channel.guild.roles.find(r => r.id === rows[0].muteRoleID).id).deny & new Discord.Permissions('SPEAK', 'USE_VAD').bitfield)) {
                  channel.overwritePermissions(channel.guild.roles.find(r => r.id === rows[0].muteRoleID), { SPEAK: false, USE_VAD: false }, 'Updating perms for the mute role').catch(console.error);
                  console.log(`Denying perms for ${rows[0].muteRoleID} in channel ${channel.id} of server ${channel.guild.id}`);
                } else { return; }
              } else if (channel.type === 'text') {
                if (!(channel.permissionOverwrites.get(channel.guild.roles.find(r => r.id === rows[0].muteRoleID).id).deny & new Discord.Permissions('SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'ADD_REACTIONS', 'EMBED_LINKS', 'ATTACH_FILES').bitfield)) {
                  channel.overwritePermissions(channel.guild.roles.find(r => r.id === rows[0].muteRoleID), { SEND_MESSAGES: false, SEND_TTS_MESSAGES: false, ADD_REACTIONS: false, EMBED_LINKS: false, ATTACH_FILES: false }, 'Updating perms for the mute role').catch(console.error);
                  console.log(`Denying perms for ${rows[0].muteRoleID} in channel ${channel.id} of server ${channel.guild.id}`);
                } else { return; }
              }
              if (executor) {
                const cCreateE = new Discord.RichEmbed()
                .setAuthor('Channel/Category created')
                .setDescription(`By: <@${executor}>\nName: **${channel.name}**`)
                .setColor('GREEN')
                .setTimestamp();

                if (!logChannel) {
                  return;
                } else if (logChannel) { return logChannel.send(cCreateE); }
              } else if (!executor) {
                const cCreateE = new Discord.RichEmbed()
                .setAuthor('Channel/Category created')
                .setDescription(`Name: **${channel.name}**`)
                .setColor('GREEN')
                .setTimestamp();

                if (!logChannel) {
                  return;
                } else if (logChannel) { return logChannel.send(cCreateE); }
              }
          }
        } else { return; }
    }, 1500);
  }
};
module.exports.help = {
  name: ''
};
