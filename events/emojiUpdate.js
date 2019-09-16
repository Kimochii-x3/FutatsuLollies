const Discord = require("discord.js");

module.exports = async (bot, oldEmoji, newEmoji) =>
{
  bot.db.query(`SELECT serverLog FROM serverInfo WHERE serverID = '${oldEmoji.guild.id}'`, async (err, rows) => {
    if (err) throw err;
    let logYN = rows[0].serverLog;
    if (logYN == 'Y') {
      let botPerms = newEmoji.guild.me.permissions.has(['SEND_MESSAGES', 'VIEW_AUDIT_LOG', 'EMBED_LINKS'], true);
      if (!botPerms) {return;}
      else if (botPerms) {
        let executor = await newEmoji.guild.fetchAuditLogs({type: 'EMOJI_UPDATE', limit: 1}).then(aLog => aLog.entries.first()).then(aLog2 => aLog2.executor).then(user => user.id);
        let logChannel = newEmoji.guild.channels.find(channel => channel.name === "event-horizon");
        if(executor){
          let embed = new Discord.RichEmbed()
          .setAuthor('Emoji renamed')
          .setDescription(`By: <@${executor}> \nFrom: **${oldEmoji.name}**\n To: **${newEmoji.name}**`)
          .setColor("#2381ee")
          .setTimestamp()

          if(!logChannel) {
            try {
              newEmoji.guild.owner.send(embed);
            } catch (e) {
              return;
            }
          }
          else if (logChannel) {
              return logChannel.send(embed);
          }
        }
        else if(!executor){
          let embed = new Discord.RichEmbed()
          .setAuthor('Emoji renamed')
          .setDescription(`From: **${oldEmoji.name}**\n To: **${newEmoji.name}`)
          .setColor("#2381ee")
          .setTimestamp()

          if(!logChannel) {
            try {
              newEmoji.guild.owner.send(embed);
            } catch (e) {
              return;
            }
          }
          else if (logChannel) {
              return logChannel.send(embed);
          }
        }
      }
    }
    else{return;}
  });
}
module.exports.help = {
  name: ""
}
