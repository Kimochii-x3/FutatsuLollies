const Discord = require("discord.js");

module.exports = async (bot, member) =>
{
  bot.db.query(`SELECT serverLog FROM serverInfo WHERE serverID = '${member.guild.id}'`, async (err, rows) => {
    if (err) throw err;
    let logYN = rows[0].serverLog;
    if (logYN == 'Y') {
      let botPerms = member.guild.me.permissions.has(['SEND_MESSAGES', 'EMBED_LINKS'], true);
      if (!botPerms) {return;}
      else if (botPerms) {
        let logChannel = member.guild.channels.find(c => c.name === "event-horizon");

        let embed = new Discord.RichEmbed()
        .setAuthor('User join')
        .setDescription(`Username: **${member.user.tag}**\n ID: **${member.user.id}**`)
        .setColor("GREEN")
        .setTimestamp()

        if(!logChannel) {
          try {
            member.guild.owner.send(embed);
          } catch (e) {
            return;
          }
        }
        else if(logChannel) {return logChannel.send(embed);}

      }
    }
    else{return;}
  });
}
module.exports.help = {
  name: ""
}
