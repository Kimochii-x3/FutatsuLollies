const Discord = require("discord.js");

module.exports = async (bot, channel) =>
{
  let botPerms = channel.guild.me.permissions.has(['SEND_MESSAGES', 'VIEW_AUDIT_LOG', 'EMBED_LINKS'], true);
  if (!botPerms) {return;}
  else if (botPerms) {
    let logChannel = channel.guild.channels.find(c => c.name === 'event-horizon');
    let cCreatorU = await channel.guild.fetchAuditLogs({type: 'CHANNEL_CREATE', limit: 1}).then(aLog => aLog.entries.first()).then(aLog2 => aLog2.executor).then(u => u.username);
    let cCreateE = new Discord.RichEmbed()
    .setDescription(`**${cCreatorU} created channel/category with name ${channel.name}**`)
    .setColor('GREEN')
    .setTimestamp()

    if(!logChannel) {
      try {
        channel.guild.owner.send(embed);
      } catch (e) {
        return;
      }
    }
    else if(logChannel) {return logChannel.send(cCreateE);}
  }
}
module.exports.help = {
  name: ""
}
