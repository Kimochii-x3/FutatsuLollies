const Discord = require("discord.js");

module.exports = async (bot, channel) =>
{
  bot.db.query(`SELECT serverLog FROM serverInfo WHERE serverID = '${channel.guild.id}'`, async (err, rows) => {
    if (err) throw err;
    let logYN = rows[0].serverLog;
    if (logYN == 'Y') {
      let botPerms = channel.guild.me.permissions.has(['SEND_MESSAGES', 'VIEW_AUDIT_LOG', 'EMBED_LINKS'], true);
      if (!botPerms) {return;}
      else if (botPerms) {
        // console.log(channel);
        let logChannel = channel.guild.channels.find(c => c.name === 'event-horizon');
        let executor = await channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE', limit: 1}).then(aLog => aLog.entries.first()).then(aLog2 => aLog2.executor).then(u => u.username);
        if(executor){
          let embed = new Discord.RichEmbed()
          .setAuthor('Channel/Category deleted')
          .setDescription(`By:${executor}\nName: **${channel.name}**`)
          .setColor('GREEN')
          .setTimestamp()

          if(!logChannel) {
            try {
              channel.guild.owner.send(embed);
            } catch (e) {
              return;
            }
          }
          else if(logChannel) {return logChannel.send(embed);}
        }
        else if(!executor){
          let embed = new Discord.RichEmbed()
          .setAuthor('Channel/Category deleted')
          .setDescription(`Name: **${channel.name}**`)
          .setColor('GREEN')
          .setTimestamp()

          if(!logChannel) {
            try {
              channel.guild.owner.send(embed);
            } catch (e) {
              return;
            }
          }
          else if(logChannel) {return logChannel.send(embed);}
        }
      }
    }
    else{return;}
  });
}
module.exports.help = {
  name: ""
}
