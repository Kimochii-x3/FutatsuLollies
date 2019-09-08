const Discord = require("discord.js");

module.exports = (bot, channel) =>
{
  if (!channel.guild.me.permissions.has('SEND_MESSAGES', 'VIEW_AUDIT_LOG','EMBED_LINKS', true)) {return;}
  else if (channel.guild.me.permissions.has('SEND_MESSAGES', 'VIEW_AUDIT_LOG', 'EMBED_LINKS', true)) {
    let logChannel = channel.guild.channels.find(c => c.name === 'event-horizon');
    let cDeletorU = channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE', limit: 1}).then(aLog => aLog.entries.first()).then(aLog2 => aLog2.executor).then(u => u.id);
    let cDeleteE = new Discord.RichEmbed()
    .setDescription(`**${cDeletorU} deleted channel/category with name ${channel.name}**`)
    .setColor('GREEN')
    .setTimestamp()

    if(!logChannel) {return channel.guild.owner.send(cDeleteE).catch(console.error);}
    else if(logChannel) {return logChannel.send(cDeleteE);}
  }
}
module.exports.help = {
  name: ""
}
