const Discord = require("discord.js");

module.exports = async (bot, oldChannel, newChannel) =>
{
  let botPerms = oldChannel.guild.me.permissions.has(['SEND_MESSAGES', 'VIEW_AUDIT_LOG', 'EMBED_LINKS'], true);
  if (!botPerms) {return;}
  else if (botPerms) {
    let logChannel = oldChannel.guild.channels.find(c => c.name === 'event-horizon');
    let cUpdatorU = await oldChannel.guild.fetchAuditLogs({type: 'CHANNEL_UPDATE', limit: 1}).then(aLog => aLog.entries.first()).then(aLog2 => aLog2.executor).then(u => u.username);
    let cUpdateNameE = new Discord.RichEmbed()
    .setDescription(`**${cUpdatorU} renamed channel/category with name ${oldChannel.name} to ${newChannel.name}**`)
    .setColor('GREEN')
    .setTimestamp()
    let cUpdateTopicE = new Discord.RichEmbed()
    .setDescription(`**${cUpdatorU} changed channel topic from ${oldChannel.topic} to ${newChannel.topic}**`)
    .setColor('GREEN')
    .setTimestamp()

    // console.log(cUpdatorU);
    if (oldChannel.name == newChannel.name) {
      if(oldChannel.topic != newChannel.topic){
        if(!logChannel) {
          try {
            newChannel.guild.owner.send(embed);
          } catch (e) {
            return;
          }
        }
        else if(logChannel) {return logChannel.send(cUpdateTopicE);}
      }
      else if (oldChannel.topic == newChannel.topic) {
        return;
      }
    }
    if (oldChannel.name != newChannel.name) {
      if(!logChannel) {
        try {
          newChannel.guild.owner.send(embed);
        } catch (e) {
          return;
        }
      }
      else if(logChannel) {return logChannel.send(cUpdateNameE);}
    }
  }
}
module.exports.help = {
  name: ""
}
