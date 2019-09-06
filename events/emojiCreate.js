const Discord = require("discord.js");

module.exports = async (bot, emoji) =>
{
  if (!emoji.guild.me.permissions.has('ADMINISTRATOR', true)) {return;}
  else if (emoji.guild.me.permissions.has('ADMINISTRATOR', true)) {
    let eAuthor = await emoji.fetchAuthor().then(user => user.id).catch(console.log);
    let eName = emoji.name;
    let eID = emoji.id;
    let eServ = emoji.guild;
    let logChannel = eServ.channels.find(channel => channel.name === "event-horizon");
    let eCreated = new Discord.RichEmbed()
    .setDescription(`<@${eAuthor}>`+"  **created emoji with:**\n**Name:** "+eName+"\n**ID:** "+eID)
    .setColor("#42f456")
    .setTimestamp()

    console.log(eServ.owner.displayName);
    if(!logChannel) {eServ.owner.send(eCreated).catch(console.error)}
    else if (logChannel) {
        return logChannel.send(eCreated);
    }
  }
}
module.exports.help = {
  name: ""
}
