const Discord = require("discord.js");

module.exports = async (bot, oldChannel, newChannel) =>
{
  bot.db.query(`SELECT serverLog FROM serverInfo WHERE serverID = '${oldChannel.guild.id}'`, async (err, rows) => {
    if (err) throw err;
    let logYN = rows[0].serverLog;
    if (logYN == 'Y') {
      let botPerms = oldChannel.guild.me.permissions.has(['SEND_MESSAGES', 'VIEW_AUDIT_LOG', 'EMBED_LINKS'], true);
      if (!botPerms) {return;}
      else if (botPerms) {
        let logChannel = oldChannel.guild.channels.find(c => c.name === 'event-horizon');
        let executor = await oldChannel.guild.fetchAuditLogs({type: 'CHANNEL_UPDATE', limit: 1}).then(aLog => aLog.entries.first()).then(aLog2 => aLog2.executor).then(u => u.username);
        if(executor){
          let embedName = new Discord.RichEmbed()
          .setAuthor('Channel name changed')
          .setDescription(`By:${executor}\nFrom: **${oldChannel.name}**\n To: **${newChannel.name}**`)
          .setColor('GREEN')
          .setTimestamp()
          let embedTopic = new Discord.RichEmbed()
          .setAuthor('Channel topic changed')
          .setDescription(`By:${executor}\nFrom: **${oldChannel.topic}**\n To: **${newChannel.topic}**`)
          .setColor('GREEN')
          .setTimestamp()

          if (oldChannel.name == newChannel.name) {
            if(oldChannel.topic != newChannel.topic){
              if(!logChannel) {
                try {
                  newChannel.guild.owner.send(embedTopic);
                } catch (e) {
                  return;
                }
              }
              else if(logChannel) {return logChannel.send(embedTopic);}
            }
            else if (oldChannel.topic == newChannel.topic) {
              return;
            }
          }
          if (oldChannel.name != newChannel.name) {
            if(!logChannel) {
              try {
                newChannel.guild.owner.send(embedName);
              } catch (e) {
                return;
              }
            }
            else if(logChannel) {return logChannel.send(embedName);}
          }
        }
        else if(!executor){
          let embedName = new Discord.RichEmbed()
          .setAuthor('Channel name changed')
          .setDescription(`From: **${oldChannel.name}**\n To: **${newChannel.name}**`)
          .setColor('GREEN')
          .setTimestamp()
          let embedTopic = new Discord.RichEmbed()
          .setAuthor('Channel topic changed')
          .setDescription(`From: **${oldChannel.topic}**\n To: **${newChannel.topic}**`)
          .setColor('GREEN')
          .setTimestamp()

          if (oldChannel.name == newChannel.name) {
            if(oldChannel.topic != newChannel.topic){
              if(!logChannel) {
                try {
                  newChannel.guild.owner.send(embedTopic);
                } catch (e) {
                  return;
                }
              }
              else if(logChannel) {return logChannel.send(embedTopic);}
            }
            else if (oldChannel.topic == newChannel.topic) {
              return;
            }
          }
          if (oldChannel.name != newChannel.name) {
            if(!logChannel) {
              try {
                newChannel.guild.owner.send(embedName);
              } catch (e) {
                return;
              }
            }
            else if(logChannel) {return logChannel.send(embedName);}
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
