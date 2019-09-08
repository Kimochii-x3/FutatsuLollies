const Discord = require("discord.js");

module.exports = (bot, oldChannel, newChannel) =>
{
  if (!oldChannel.guild.me.permissions.has('SEND_MESSAGES', 'VIEW_AUDIT_LOG','EMBED_LINKS', true)) {return;}
  else if (oldChannel.guild.me.permissions.has('SEND_MESSAGES', 'VIEW_AUDIT_LOG', 'EMBED_LINKS', true)) {
    let logChannel = oldChannel.guild.channels.find(c => c.name === 'event-horizon');
    let cUpdatorU = oldChannel.guild.fetchAuditLogs({type: 'CHANNEL_UPDATE', limit: 1}).then(aLog => aLog.entries.first()).then(aLog2 => aLog2.executor.id);
    let cUpdateE = new Discord.RichEmbed()
    .setDescription(`**${cUpdatorU} renamed channel/category with name ${oldChannel.name} to ${newChannel.name}**`)
    .setColor('GREEN')
    .setTimestamp()

    console.log(cUpdatorU);
    if(!logChannel) {return channel.guild.owner.send(cUpdateE).catch(console.error);}
    else if(logChannel) {return logChannel.send(cUpdateE);}
  }
}
module.exports.help = {
  name: ""
}
