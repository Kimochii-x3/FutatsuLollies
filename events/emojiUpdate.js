const Discord = require("discord.js");

module.exports = async (bot, oldEmoji, newEmoji) =>
{
  let botPerms = newEmoji.guild.me.permissions.has(['SEND_MESSAGES', 'VIEW_AUDIT_LOG', 'EMBED_LINKS'], true);
  if (!botPerms) {return;}
  else if (botPerms) {
    let eServ = newEmoji.guild;
    let eUpdater = await eServ.fetchAuditLogs({type: 'EMOJI_UPDATE', limit: 1}).then(aLog => aLog.entries.first()).then(aLog2 => aLog2.executor).then(user => user.id);
    let eNameOld = oldEmoji.name;
    let eNameNew = newEmoji.name;
    let eID = newEmoji.id;
    let logChannel = eServ.channels.find(channel => channel.name === "event-horizon");
    let eUpdated = new Discord.RichEmbed()
    .setDescription(`<@${eUpdater}>`+" **renamed emoji from:** "+eNameOld+"\n**To:** "+eNameNew)
    .setColor("#2381ee")
    .setTimestamp()

    if(!logChannel) {
      try {
        eServ.guild.owner.send(embed);
      } catch (e) {
        return;
      }
    }
    else if (logChannel) {
        return logChannel.send(eUpdated);
    }
  }
}
module.exports.help = {
  name: ""
}
