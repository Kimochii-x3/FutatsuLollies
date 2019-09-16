const Discord = require("discord.js");

module.exports = async (bot, channel) =>
{
  let botPerms = channel.guild.me.permissions.has(['SEND_MESSAGES', 'VIEW_AUDIT_LOG', 'EMBED_LINKS'], true);
  if (!botPerms) {return;}
  else if (botPerms) {
    // console.log(channel);
    let logChannel = channel.guild.channels.find(c => c.name === 'event-horizon');
    let cDeletorU = await channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE', limit: 1}).then(aLog => aLog.entries.first()).then(aLog2 => aLog2.executor).then(u => u.username);
    let cDeleteE = new Discord.RichEmbed()
    .setDescription(`**${cDeletorU} deleted channel/category with name ${channel.name}**`)
    .setColor('GREEN')
    .setTimestamp()

    if(!logChannel) {
      try {
        channel.guild.owner.send(embed);
      } catch (e) {
        return;
      }
    }
    else if(logChannel) {return logChannel.send(cDeleteE);}
  }
}
module.exports.help = {
  name: ""
}
