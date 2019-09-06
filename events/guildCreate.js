const Discord = require("discord.js");

module.exports = async (bot, guild) =>
{
  if (!guild.guild.me.permissions.has('ADMINISTRATOR', true)) {return;}
  else if (guild.guild.me.permissions.has('ADMINISTRATOR', true)) {
    let logChannel = guild.channels.find(c => c.name === "event-horizon");
    if(!logChannel)
      {
      try {
        guild.createChannel('event-horizon', {type: 'text', topic:'FutatsuLollies mod logging', permissionOverwrites:[{id: guild.id, deny:['READ_MESSAGES', 'SEND_MESSAGES']}]});
      } catch (e) {
        console.log(e);
      }
    }
    else if (logChannel) {
      return;
    }
  }
}
module.exports.help = {
  name: ""
}
