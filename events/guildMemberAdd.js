const Discord = require("discord.js");

module.exports = async (bot, member) =>
{
  let botPerms = member.guild.me.permissions.has(['SEND_MESSAGES', 'EMBED_LINKS'], true);
  if (!botPerms) {return;}
  else if (botPerms) {
    let logChannel = member.guild.channels.find(c => c.name === "event-horizon");

    let memberJoin = new Discord.RichEmbed()
    .setDescription(`${member.user.tag} joined the server\n ID: ${member.user.id}`)
    .setColor("GREEN")
    .setTimestamp()

    if(!logChannel) {
      try {
        member.guild.owner.send(embed);
      } catch (e) {
        return;
      }
    }
    else if(logChannel) {return logChannel.send(memberJoin);}

  }
}
module.exports.help = {
  name: ""
}
