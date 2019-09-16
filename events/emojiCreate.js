const Discord = require("discord.js");

module.exports = async (bot, emoji) =>
{
  bot.db.query(`SELECT serverLog FROM serverInfo WHERE serverID = '${emoji.guild.id}'`, async (err, rows) => {
    if (err) throw err;
    let logYN = rows[0].serverLog;
    if (logYN == 'Y') {
      let botPerms = emoji.guild.me.permissions.has(['SEND_MESSAGES', 'VIEW_AUDIT_LOG', 'EMBED_LINKS'], true);
      if (!botPerms) {return;}
      else if (botPerms) {
        let executor = await emoji.fetchAuthor().then(user => user.id).catch(console.log);
        let logChannel = emoji.guild.channels.find(channel => channel.name === "event-horizon");
        let embed = new Discord.RichEmbed()
        .setAuthor('Emoji created')
        .setDescription(`By: <@${executor}> \nName: **${emoji.name}**\n ID: **${emoji.id}**`)
        .setColor("#42f456")
        .setTimestamp()

        if(!logChannel) {
          try {
            emoji.guild.owner.send(embed);
          } catch (e) {
            return;
          }
        }
        else if (logChannel) {
            return logChannel.send(embed);
        }
      }
    }
    else{return;}
  });
}
module.exports.help = {
  name: ""
}
