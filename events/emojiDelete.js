const Discord = require("discord.js");

module.exports = async (bot, emoji) =>
{
  if (!emoji.guild.me.permissions.has('SEND_MESSAGES', 'VIEW_AUDIT_LOG', 'EMBED_LINKS', true)) {return;}
  else if (emoji.guild.me.permissions.has('SEND_MESSAGES', 'VIEW_AUDIT_LOG', 'EMBED_LINKS', true)) {
    let eServ = emoji.guild;
    let eDeleter = await eServ.fetchAuditLogs({type: 'EMOJI_DELETE', limit: 1}).then(aLog => aLog.entries.first()).then(aLog2 => aLog2.executor).then(user => user.id);
    let eName = emoji.name;
    let eID = emoji.id;
    let logChannel = eServ.channels.find(channel => channel.name === "event-horizon");
    let eDeleted = new Discord.RichEmbed()
    .setDescription(`<@${eDeleter}>`+"  **deleted emoji with:**\n**Name:** "+eName+"\n**ID:** "+eID)
    .setColor("#ff3a28")
    .setTimestamp()

    if(!logChannel) {eServ.owner.send(eDeleted).catch(console.error)}
    else if (logChannel) {
        return logChannel.send(eDeleted);
    }
  }
}
module.exports.help = {
  name: ""
}
