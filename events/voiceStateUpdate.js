const Discord = require('discord.js');

module.exports = async (bot, oldMember, newMember) => {
  const rows = await bot.db.query(`SELECT * FROM serverInfo WHERE serverID = '${oldMember.guild.id}'`);
  const logYN = rows[0].serverLog;
  if (logYN === 'Y') {
    const botPerms = oldMember.guild.me.permissions.has(['SEND_MESSAGES', 'EMBED_LINKS'], true);
    if (!botPerms) { return; } else if (botPerms) {
      const logChannel = oldMember.guild.channels.find(c => c.id === rows[0].serverClogID);
      const newUserChannel = newMember.voiceChannel;
      const oldUserChannel = oldMember.voiceChannel;
      const muteRole = newMember.guild.roles.find(r => r.id === rows[0].muteRoleID);

      if (muteRole) {
        if (!oldUserChannel && newUserChannel) {
          if (newMember.roles.has(muteRole.id)) {
            if (!newMember.serverMute) {
              newMember.setMute(true).catch(console.error);

              const embed = new Discord.RichEmbed()
              .setDescription(`Muted ${newMember} from ${newUserChannel} due to having the ${muteRole}`)
              .setColor('RED');

              if (!logChannel) { return; } else if (logChannel) { return logChannel.send(embed); }
            }
          } else if (!newMember.roles.has(muteRole.id)) {
            if (newMember.serverMute) {
              newMember.setMute(false).catch(console.error);

              const embed = new Discord.RichEmbed()
              .setDescription(`Unmuted ${newMember} from ${newUserChannel} due to no longer having the ${muteRole}`)
              .setColor('GREEN');

              if (!logChannel) { return; } else if (logChannel) { return logChannel.send(embed); }
            }
          } else { return; }
        } else if (!newUserChannel && oldUserChannel) { return; } else if (newUserChannel && oldUserChannel) { return; }
      } else if (!muteRole) { return; }
    }
  } else { return; }
};
module.exports.help = {
  name: ''
};
