const Discord = require("discord.js");

module.exports = async (bot, oldMember, newMember) =>
{
  let botPerms = oldMember.guild.me.permissions.has(['SEND_MESSAGES', 'VIEW_AUDIT_LOG', 'EMBED_LINKS'], true);
  if (!botPerms) {return;}
  else if (botPerms) {
    let mGuild = oldMember.guild;
    let logChannel = mGuild.channels.find(c => c.name === "event-horizon");
    let uTarget = await mGuild.fetchAuditLogs({type: 'MEMBER_ROLE_UPDATE', limit: 1}).then(aLog => aLog.entries.first()).then(aLog2 => aLog2.target).then(user => user.id);
    let oldMemberRoles = oldMember.roles.filter(r => r.id !== oldMember.guild.id && !newMember.roles.has(r.id));
    let newMemberRoles = newMember.roles.filter(r => r.id !== newMember.guild.id && !oldMember.roles.has(r.id));
    let roleDiff = oldMemberRoles.map(r => r.name) + newMemberRoles.map(r => r.name);
    let roleDiff1 = oldMember.roles.size;
    let roleDiff2 = newMember.roles.size;
    let roleDiff3 = newMember.guild.roles.find(r => r.name === roleDiff);
    let oldMemberNick = oldMember.displayName;
    let newMemberNick = newMember.displayName;

    let rChange1 = new Discord.RichEmbed()
    .setDescription(`<@${uTarget}>`+"** was removed from **"+`${roleDiff3}`)
    .setColor("#fc2b14")
    .setTimestamp()

    let rChange2 = new Discord.RichEmbed()
    .setDescription(`<@${uTarget}>`+"** was added to **"+`${roleDiff3}`)
    .setColor("#14cdfc")
    .setTimestamp()

    let nickChange = new Discord.RichEmbed()
    .setDescription(`**${oldMemberNick} changed (or removed) their nickname to ${newMemberNick}**`)
    .setColor('GREY')
    .setTimestamp()
    // if(oldMemberRoles != newMemberRoles)
    // {
    if(roleDiff1 > roleDiff2)
    {
      if(!logChannel) {
        try {
          newMember.guild.owner.send(embed);
        } catch (e) {
          return;
        }
      }
      else if(logChannel) {return logChannel.send(rChange1);}
    }
    else if(roleDiff1 < roleDiff2)
    {
      if(!logChannel) {
        try {
          newMember.guild.owner.send(embed);
        } catch (e) {
          return;
        }
      }
      else if(logChannel) {return logChannel.send(rChange2);}
    }
    if(oldMemberNick != newMemberNick)
    {
      if(!logChannel) {
        try {
          newMember.guild.owner.send(embed);
        } catch (e) {
          return;
        }
      }
      else if(logChannel) {return logChannel.send(nickChange);}
    }
  }
  // }
}
module.exports.help = {
  name: ""
}
