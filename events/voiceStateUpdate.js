const Discord = require("discord.js");

module.exports = (bot, oldMember, newMember) =>
{
  if (!oldMember.guild.me.permissions.has('ADMINISTRATOR', true)) {return;}
  else if (oldMember.guild.me.permissions.has('ADMINISTRATOR', true)) {
    let newUserChannel = newMember.voiceChannel;
    let oldUserChannel = oldMember.voiceChannel;
    let muteRole = newMember.guild.roles.find(role => role.name === "Axe'd");
    let logChannel = newMember.guild.channels.find(c => c.name === "event-horizon");
    if (!oldUserChannel && newUserChannel)
    {
      if (newMember.roles.has(muteRole.id).catch(console.error))
      {
        if (!newMember.serverMute)
        {
          newMember.setMute(true).catch(console.error);

          let embed = new Discord.RichEmbed()
          .setDescription(`Muted ${newMember} from ${newUserChannel} due to having the ${muteRole}`)
          .setColor('RED')

          if(!logChannel) {return newMember.guild.owner.send(embed).catch(console.error);}
          else if(logChannel) {return logChannel.send(embed);}
        }
      }
      else if (!newMember.roles.has(muteRole.id))
      {
        if (newMember.serverMute)
        {
          newMember.setMute(false).catch(console.error);

          let embed = new Discord.RichEmbed()
          .setDescription(`Unmuted ${newMember} from ${newUserChannel} due to no longer having the ${muteRole}`)
          .setColor('GREEN')

          if(!logChannel) {return newMember.guild.owner.send(embed).catch(console.error);}
          else if(logChannel) {return logChannel.send(embed);}
        }
      }
      else
      {
        return;
      }
    }
    // else if (oldUserChannel && !newUserChannel)
    // {
    //   return;
    // }
    // else
    // {
    //   return;
    // }
  }
}
module.exports.help = {
  name: ""
}
