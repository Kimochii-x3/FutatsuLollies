const Discord = require("discord.js");

module.exports = async (bot, member) =>
{
  let botPerms = member.guild.me.permissions.has(['SEND_MESSAGES', 'VIEW_AUDIT_LOG', 'EMBED_LINKS'], true);
  if (!botPerms) {return;}
  else if (botPerms) {
    let tempTimestamp = Date.now();
    let logChannel = member.guild.channels.find(c => c.name === "event-horizon");
    let uExecutor = await member.guild.fetchAuditLogs({type: 'MEMBER_KICK', limit: 1}).then(aLog => aLog.entries.first()).then(aLog2 => aLog2.executor).then(user => user.tag);
    let uTarget = await member.guild.fetchAuditLogs({type: 'MEMBER_KICK', limit: 1}).then(aLog => aLog.entries.first()).then(aLog2 => aLog2.target).then(user => user.tag);
    let uTarget2 = await member.guild.fetchAuditLogs({type: 'MEMBER_KICK', limit: 1}).then(aLog => aLog.entries.first()).then(aLog2 => aLog2.target).then(user => user.id);
    let aLogTimestamp = await member.guild.fetchAuditLogs({type: 'MEMBER_KICK', limit: 1}).then(aLog => aLog.entries.first()).then(aLog2 => aLog2.createdTimestamp);
    let memberLeft = await bot.fetchUser(member.id, true).then(u => u.tag);
    let userRole = member.guild.roles.find(role => role.name === 'USER-'+member.id);

    let memberLeave = new Discord.RichEmbed()
    .setDescription("**"+member.user.tag+" left the server**")
    .setColor("#c4150f")
    .setTimestamp()

    let memberKick = new Discord.RichEmbed()
    .setDescription("**"+uExecutor+" kicked "+uTarget+" from the server**")
    .setColor("#c4150f")
    .setTimestamp()

    if(tempTimestamp <= aLogTimestamp+50000)
    {
      if(uTarget2 != member.id)
      {
        if(userRole){userRole.delete('Member '+memberLeft+' left the server');}
        if(!logChannel) {
          try {
            member.guild.owner.send(embed);
          } catch (e) {
            return;
          }
        }
        else if(logChannel) {return logChannel.send(memberLeave);}
      }
      else(uTarget2 == member.id)
      {
        if(userRole){userRole.delete('Member '+memberLeft+' was kicked from the server');}
        if(!logChannel) {
          try {
            member.guild.owner.send(embed);
          } catch (e) {
            return;
          }
        }
        else if(logChannel) {return logChannel.send(memberKick);}
      }
    }
    else if(tempTimestamp >= aLogTimestamp+50000)
    {
    if(userRole){userRole.delete('Member '+memberLeft+' left the server');}
    if(!logChannel) {
      try {
        member.guild.owner.send(embed);
      } catch (e) {
        return;
      }
    }
    else if(logChannel) {return logChannel.send(memberLeave);}
  }
  }
}
module.exports.help = {
  name: ""
}
