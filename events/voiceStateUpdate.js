const Discord = require("discord.js");

module.exports = async (bot, oldMember, newMember) =>
{
  bot.db.query(`SELECT serverLog FROM serverInfo WHERE serverID = '${oldMember.guild.id}'`, async (err, rows) => {
    if (err) throw err;
    let logYN = rows[0].serverLog;
    if (logYN == 'Y') {
      let botPerms = oldMember.guild.me.permissions.has(['SEND_MESSAGES', 'EMBED_LINKS'], true);
      if (!botPerms) {return;}
      else if (botPerms) {
        let newUserChannel = newMember.voiceChannel;
        let oldUserChannel = oldMember.voiceChannel;
        let muteRole = newMember.guild.roles.find(role => role.name === "Axe'd");
        let logChannel = newMember.guild.channels.find(c => c.name === "event-horizon");

        if(muteRole){
          if (!oldUserChannel && newUserChannel)
          {
            if (newMember.roles.has(muteRole.id))
            {
              if (!newMember.serverMute)
              {
                newMember.setMute(true).catch(console.error);

                let embed = new Discord.RichEmbed()
                .setDescription(`Muted ${newMember} from ${newUserChannel} due to having the ${muteRole}`)
                .setColor('RED')

                if(!logChannel) {return newMember.guild.owner.send(embed).catch(error => {throw error;});}
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

                if(!logChannel) {
                  try {
                    newMember.guild.owner.send(embed);
                  } catch (e) {
                    return;
                  }
                }
                else if(logChannel) {return logChannel.send(embed);}
              }
            }
            else
            {
              return;
            }
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
    else{return;}
  });
}
module.exports.help = {
  name: ""
}
