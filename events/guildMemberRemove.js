const Discord = require("discord.js");

module.exports = async (bot, member) =>
{
  bot.db.query(`SELECT serverLog FROM serverInfo WHERE serverID = '${member.guild.id}'`, async (err, rows) => {
    if (err) throw err;
    let logYN = rows[0].serverLog;
    if (logYN == 'Y') {
      let botPerms = member.guild.me.permissions.has(['SEND_MESSAGES', 'VIEW_AUDIT_LOG', 'EMBED_LINKS'], true);
      if (!botPerms) {return;}
      else if (botPerms) {
        let tempTimestamp = Date.now();
        let logChannel = member.guild.channels.find(c => c.name === "event-horizon");
        let executor = await member.guild.fetchAuditLogs({type: 'MEMBER_KICK', limit: 1}).then(aLog => aLog.entries.first()).then(aLog2 => aLog2.executor).then(user => user.id);
        let uTarget = await member.guild.fetchAuditLogs({type: 'MEMBER_KICK', limit: 1}).then(aLog => aLog.entries.first()).then(aLog2 => aLog2.target).then(user => user.tag);
        let uTarget2 = await member.guild.fetchAuditLogs({type: 'MEMBER_KICK', limit: 1}).then(aLog => aLog.entries.first()).then(aLog2 => aLog2.target).then(user => user.id);
        let aLogTimestamp = await member.guild.fetchAuditLogs({type: 'MEMBER_KICK', limit: 1}).then(aLog => aLog.entries.first()).then(aLog2 => aLog2.createdTimestamp);
        let memberLeft = await bot.fetchUser(member.id, true).then(u => u.tag);
        let userRole = member.guild.roles.find(role => role.name === 'USER-'+member.id);

        let embedLeave = new Discord.RichEmbed()
        .setAuthor('User leave')
        .setDescription(`Username: **${member.user.tag}**`)
        .setColor("#c4150f")
        .setTimestamp()

        let embedKick = new Discord.RichEmbed()
        .setAuthor('User kicked')
        .setDescription(`Moderator: <@${executor}>\n Member: **${member.user.tag}**`)
        .setColor("#c4150f")
        .setTimestamp()

        if(tempTimestamp <= aLogTimestamp+50000)
        {
          if(uTarget2 != member.id)
          {
            if(userRole){userRole.delete('Member '+memberLeft+' left the server');}
            if(!logChannel) {
              try {
                member.guild.owner.send(embedLeave);
              } catch (e) {
                return;
              }
            }
            else if(logChannel) {return logChannel.send(embedLeave);}
          }
          else(uTarget2 == member.id)
          {
            if(userRole){userRole.delete('Member '+memberLeft+' was kicked from the server');}
            if(!logChannel) {
              try {
                member.guild.owner.send(embedKick);
              } catch (e) {
                return;
              }
            }
            else if(logChannel) {return logChannel.send(embedKick);}
          }
        }
        else if(tempTimestamp >= aLogTimestamp+50000)
        {
        if(userRole){userRole.delete('Member '+memberLeft+' left the server');}
        if(!logChannel) {
          try {
            member.guild.owner.send(embedLeave);
          } catch (e) {
            return;
          }
        }
        else if(logChannel) {return logChannel.send(embedLeave);}
        }
      }
    }
    else{return;}
  });
}
module.exports.help = {
  name: ""
}
