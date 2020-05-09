const Discord = require('discord.js');
const ms = require('ms');

module.exports = {
  name: 'mute',
  description: 'mutes a member from chat & voice channels, also if a muted user joins VC they\'ll be muted from it too, if the bot responds with ✅ but the user doesn\'t get muted, move the bot\'s role above any other role in the hierarchy [you need administator or manage roles permission]',
  usage: 'fl.mute @<someone> / fl.mute @<someone> 5m (time is optional, max is 24 days)',
  args: true,
  async execute(bot, message, args, option) {
    if (option[0] && option[1]) {
      const tmpOption = await message.mentions.roles.first();
      if (tmpOption && option[1].trim() === 'set') {
        await bot.db.query(`UPDATE serverInfo SET muteRoleID = '${tmpOption.id}' WHERE serverID = ${message.guild.id}`).catch(console.error);
        if (message.guild.me.permissions.has(['MANAGE_ROLES', 'VIEW_AUDIT_LOG'], true)) {
          for (const [id, channel] of message.guild.channels) {
            if (channel.type === 'category') {
              const prmToCheck = ['SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'ADD_REACTIONS', 'EMBED_LINKS', 'ATTACH_FILES', 'SPEAK', 'USE_VAD'];
              for (const prm of prmToCheck) {
                let prmSingle = Discord.Permissions.FLAGS[prm];
                if (!(channel.permissionOverwrites.get(tmpOption.id).deny & prmSingle)) {
                  await channel.overwritePermissions(tmpOption, { [prm]: false }, `Updating perms of mute role: ${tmpOption.name} for ${channel.name} of type ${channel.type}`).catch(console.error);
                } else if (channel.permissionOverwrites.get(tmpOption.id).deny & prmSingle) {
                    return;
                }
              }
            } else if (channel.type === 'voice') {
              const prmToCheck = ['SPEAK', 'USE_VAD'];
              for (const prm of prmToCheck) {
                let prmSingle = Discord.Permissions.FLAGS[prm];
                if (!(channel.permissionOverwrites.get(tmpOption.id).deny & prmSingle)) {
                  await channel.overwritePermissions(tmpOption, { [prm]: false }, `Updating perms of mute role: ${tmpOption.name} for ${channel.name} of type ${channel.type}`).catch(console.error);
                } else if (channel.permissionOverwrites.get(tmpOption.id).deny & prmSingle) {
                    return;
                }
              }
            } else if (channel.type === 'text') {
              const prmToCheck = ['SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'ADD_REACTIONS', 'EMBED_LINKS', 'ATTACH_FILES'];
              for (const prm of prmToCheck) {
                let prmSingle = Discord.Permissions.FLAGS[prm];
                if (!(channel.permissionOverwrites.get(tmpOption.id).deny & prmSingle)) {
                  await channel.overwritePermissions(tmpOption, { [prm]: false }, `Updating perms of mute role: ${tmpOption.name} for ${channel.name} of type ${channel.type}`).catch(console.error);
                } else if (channel.permissionOverwrites.get(tmpOption.id).deny & prmSingle) {
                    return;
                }
              }
            }
          }
          message.channel.send(`Successfully changed the mute role's ID to ${tmpOption} & checked/updated all channels for the necessary permissions`);
        } else {
          message.channel.send(`Successfully changed the mute role's ID to ${tmpOption}, but did not check/update all channels for permissions as I was missing \`manage roles\``);
        }
      } else {
        return message.channel.send('Sorry, you didn\'t mention a role (but a user or a channel) and/or didn\'t use "-set" option to set the mute role');
      }
    } else if (option[0] && !option[1]) {
      const botPerms = message.guild.me.permissions.has(['SEND_MESSAGES', 'MANAGE_ROLES', 'EMBED_LINKS'], true);
      if (!botPerms) {
        return message.reply('insufficient permissions, add `send messages` + `manage roles` + `embed links` permissions to my role `FutatsuLollies`');
      } else if (botPerms) {
        const rows = await bot.db.query(`SELECT * FROM serverInfo WHERE serverID = ${message.guild.id}`).catch(console.error);
        const muteRole = message.guild.roles.find(role => role.id === rows[0].muteRoleID);
        const mutedUser = message.mentions.members.first();
        const muteTime = args[1];
        const rqUser = message.member;
        if (!muteRole) {
          try {
            const botrole = await message.guild.roles.find(role => role.name === 'FutatsuLollies');
            await message.guild.createRole({ name: 'Axe\'d', color: 'BLACK', permissions: [], position: botrole.position - 1 }).then(async role => {
                for (const [id, channel] of message.guild.channnels) {
                  if (channel.type === 'category') {
                    await channel.overwritePermissions(role, { SEND_MESSAGES: false, SEND_TTS_MESSAGES: false, ADD_REACTIONS: false, EMBED_LINKS: false, ATTACH_FILES: false, SPEAK: false, USE_VAD: false }, 'Updating perms for the mute role').catch(console.error);
                  } else if (channel.type === 'voice') {
                    await channel.overwritePermissions(role, { SPEAK: false, USE_VAD: false }, 'Updating perms for the mute role').catch(console.error);
                  } else if (channel.type === 'text') {
                    await channel.overwritePermissions(role, { SEND_MESSAGES: false, SEND_TTS_MESSAGES: false, ADD_REACTIONS: false, EMBED_LINKS: false, ATTACH_FILES: false }, 'Updating perms for the mute role').catch(console.error);
                  }
                }
              }).then(message.channel.send('Mute role was not found so it was created, run the mute command again to mute the person (This occurs only when the command is ran for the first time)'));
            const mtr = await message.guild.roles.find(role => role.name === 'Axe\'d');
            await bot.db.query(`UPDATE serverInfo SET muteRoleID = '${mtr.id}' WHERE serverID = ${mtr.guild.id}`);
            console.log(`Added mute role id: ${mtr.id} to database for server ${mtr.guild.id}`);
          } catch (e) {
            console.log(e);
          }
        } else if (muteRole) {
        if (rqUser.hasPermission('MANAGE_ROLES') || rqUser.hasPermission('ADMINISTRATOR')) {
          if (!mutedUser) {
            message.channel.send('No member mentioned');
          } else if (mutedUser) {
            if (mutedUser.hasPermission('ADMINISTRATOR')) {
              if (mutedUser.roles.has(muteRole.id)) {
                mutedUser.removeRole(muteRole.id);
                if (mutedUser.voiceChannel != null) {
                  mutedUser.setMute(false)
                  .then(() => console.log(`Unmuted ${mutedUser.displayName}`))
                  .catch(console.error);
                  message.react('✅');
                } else {
                  message.react('✅');
                }
              } else {
                message.react('✅');
                if (!muteTime) {
                  mutedUser.addRole(muteRole.id);
                  if (mutedUser.voiceChannel != null) {
                    mutedUser.setMute(true)
                    .then(() => console.log(`Muted ${mutedUser.displayName}`))
                    .catch(console.error);
                    return;
                  }
                } else {
                  mutedUser.addRole(muteRole.id);
                  if (mutedUser.voiceChannel != null) {
                    mutedUser.setMute(true)
                    .then(() => console.log(`Muted ${mutedUser.displayName}`))
                    .catch(console.error);
                    setTimeout(() => {
                      mutedUser.removeRole(muteRole.id);
                      if (mutedUser.voiceChannel != null) {
                        mutedUser.setMute(false)
                        .then(() => console.log(`Unmuted ${mutedUser.displayName}`))
                        .catch(console.error);
                        return;
                      }
                    }, ms(muteTime));
                  } else {
                    setTimeout(() => {
                      mutedUser.removeRole(muteRole.id);
                      if (mutedUser.voiceChannel != null) {
                        mutedUser.setMute(false)
                        .then(() => console.log(`Unmuted ${mutedUser.displayName}`))
                        .catch(console.error);
                        return;
                      }
                    }, ms(muteTime));
                  }
                }
              }
            } else if (!mutedUser.hasPermission('ADMINISTRATOR')) {
              if (mutedUser.roles.has(muteRole.id)) {
                mutedUser.removeRole(muteRole.id);
                if (mutedUser.voiceChannel != null) {
                  mutedUser.setMute(false)
                  .then(() => console.log(`Unmuted ${mutedUser.displayName}`))
                  .catch(console.error);
                  message.react('✅');
                } else {
                  message.react('✅');
                }
              } else if (!mutedUser.roles.has(muteRole.id)) {
                if (!muteTime) {
                  mutedUser.addRole(muteRole.id);
                  if (mutedUser.voiceChannel != null) {
                    mutedUser.setMute(true)
                    .then(() => console.log(`Muted ${mutedUser.displayName}`))
                    .catch(console.error);
                    message.react('✅');
                  } else {
                    message.react('✅');
                  }
                } else if (muteTime) {
                  mutedUser.addRole(muteRole.id);
                  if (mutedUser.voiceChannel != null) {
                    mutedUser.setMute(true)
                    .then(() => console.log(`Muted ${mutedUser.displayName}`))
                    .catch(console.error);
                    message.react('✅');
                  } else {
                    setTimeout(() => {
                      mutedUser.removeRole(muteRole.id);
                      if (mutedUser.voiceChannel != null) {
                        mutedUser.setMute(false)
                        .then(() => console.log(`Unmuted ${mutedUser.displayName}`))
                        .catch(console.error);
                        return;
                      }
                    }, ms(muteTime));
                    return message.react('✅');
                  }
                }
              }
            }
          }
        } else {
          return message.react('🤔');
        }
      }
    }
  }
  }
};
