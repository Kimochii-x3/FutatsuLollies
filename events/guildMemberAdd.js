const Discord = require("discord.js");

module.exports = async (bot, member) =>
{
  if (!member.guild.me.permissions.has('SEND_MESSAGES', 'EMBED_LINKS', true)) {return;}
  else if (member.guild.me.permissions.has('SEND_MESSAGES', 'EMBED_LINKS', true)) {
    let logChannel = member.guild.channels.find(c => c.name === "event-horizon");

    let memberJoin = new Discord.RichEmbed()
    .setDescription(`${member.user.tag} joined the server\n ID: ${member.user.id}`)
    .setColor("GREEN")
    .setTimestamp()

    if(!logChannel) {return member.guild.owner.send(memberJoin).catch(console.error);}
    else if(logChannel) {return logChannel.send(memberJoin);}

  }
}
module.exports.help = {
  name: ""
}
