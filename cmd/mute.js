const Discord = require("discord.js");
const ms = require("ms");

module.exports = {
  name: 'mute',
  description: 'mutes a member from chat & voice channels, also if a muted user VC they\'ll be muted from it too, if the bot responds with ✅ but the user doesn\'t get muted, move the bot\'s role above any other role in the hierarchy',
  usage: 'fl.mute @<member> /30s, 5m, 1d/(any time combination should be possible as long as it doesnt exceed 24 days limit)',
  args: true,
  async execute(bot, message, args, option) {
    let botPerms = message.guild.me.permissions.has(['SEND_MESSAGES', 'MANAGE_ROLES', 'EMBED_LINKS'], true);
    if (!botPerms) {return message.reply("insufficient permissions, add 'SEND_MESSAGES + MANAGE_ROLES + EMBED_LINKS' perms to my role 'FutatsuLollies'");}
    else if (botPerms) {
      let muteRole = message.guild.roles.find(role => role.name == "Axe'd");
      let mutedUser = message.mentions.members.first();
      let muteTime = args[1];
      let mAuthor = message.author.id;
      let rqUser = message.member;
      let clr = message.member.displayHexColor;

      let userAdmin = new Discord.RichEmbed()
      .setColor(clr)
      .addField("Sigh", "That's pointless, but w/e I'll mute them.")

      let noMutedUser = new Discord.RichEmbed()
      .setColor(clr)
      .addField("Sigh", "At least mention a user to mute..")

      let permMute = new Discord.RichEmbed()
      .setColor(clr)
      .addField("Done", mutedUser + " muted permanently.")

      let unMute = new Discord.RichEmbed()
      .setColor(clr)
      .addField("Done", mutedUser + " has been unmuted.")

      let timedMute = new Discord.RichEmbed()
      .setColor(clr)
      .addField("Done", mutedUser + " muted for " + muteTime)

      if(!muteRole){
        try {
        mrt = await message.guild.createRole({name:'Axe\'d', color: 'BLACK', permissions: [], position: 9000}).then(role => message.guild.channels.forEach(async (channel, id) => {
            await channel.overwritePermissions(role, {SEND_MESSAGES: false, ADD_REACTION: false, SEND_TTS_MESSAGES: false, EMBED_LINKS: false, ATTACH_FILES: false, SPEAK: false, USE_VAD: false}, "Updating perms for the mute role")
          })).then(message.channel.send("Mute role was not found so it was created, run the mute command again to mute the person (This occurs only when the command is ran for the first time)"));
        } catch (e) {
          console.log(e);
        }
      }
      else if(muteRole) {
      if(rqUser.hasPermission('MANAGE_ROLES') || rqUser.hasPermission('ADMINISTRATOR'))
      {
        if(!mutedUser)
        {
          return message.channel.send("No member mentioned");
        }
        else
        {
          if (mutedUser.hasPermission('ADMINISTRATOR'))
          {
            if(mutedUser.roles.has(muteRole.id))
            {
              mutedUser.removeRole(muteRole.id)
              if(mutedUser.voiceChannel != null)
              {
                mutedUser.setMute(false)
                .then(() => console.log(`Unmuted ${mutedUser.displayName}`))
                .catch(console.error)
                return message.react('✅');//channel.send(unMute);
              }
              else
              {
                return message.react('✅');//channel.send(unMute);
              }
            }
            else
            {
              message.react('✅');//channel.send(userAdmin);
              if(!muteTime)
              {
                mutedUser.addRole(muteRole.id)
                if(mutedUser.voiceChannel != null)
                {
                  mutedUser.setMute(true)
                  .then(() => console.log(`Muted ${mutedUser.displayName}`))
                  .catch(console.error)
                  return; //message.channel.send(permMute)
                }
                else
                {
                  return; //message.channel.send(permMute)
                }
              }
              else
              {
                mutedUser.addRole(muteRole.id)
                if(mutedUser.voiceChannel != null)
                {
                  mutedUser.setMute(true)
                  .then(() => console.log(`Muted ${mutedUser.displayName}`))
                  .catch(console.error)
                  setTimeout(function()
                  {
                    mutedUser.removeRole(muteRole.id)
                    if(mutedUser.voiceChannel != null)
                    {
                      mutedUser.setMute(false)
                      .then(() => console.log(`Unmuted ${mutedUser.displayName}`))
                      .catch(console.error)
                    }
                    else
                    {
                      return;
                    }
                  }
                  , ms(muteTime));
                  return; //message.channel.send(timedMute)
                }
                else
                {
                  setTimeout(function()
                  {
                    mutedUser.removeRole(muteRole.id)
                    if(mutedUser.voiceChannel != null)
                    {
                      mutedUser.setMute(false)
                      .then(() => console.log(`Unmuted ${mutedUser.displayName}`))
                      .catch(console.error)
                    }
                    else
                    {
                      return;
                    }
                  }
                  , ms(muteTime));
                  return; //message.channel.send(timedMute)
                }
              }
            }
          }
          else
          {
            if(mutedUser.roles.has(muteRole.id))
            {
              mutedUser.removeRole(muteRole.id)
              if(mutedUser.voiceChannel != null)
              {
                mutedUser.setMute(false)
                .then(() => console.log(`Unmuted ${mutedUser.displayName}`))
                .catch(console.error)
                return message.react('✅');//channel.send(unMute);
              }
              else
              {
                return message.react('✅');//channel.send(unMute);
              }
            }
            else
            {
              if(!muteTime)
              {
                mutedUser.addRole(muteRole.id)
                if(mutedUser.voiceChannel != null)
                {
                  mutedUser.setMute(true)
                  .then(() => console.log(`Muted ${mutedUser.displayName}`))
                  .catch(console.error)
                  return message.react('✅');//channel.send(permMute);
                }
                else
                {
                  return message.react('✅');//channel.send(permMute);
                }
              }
              else
              {
                mutedUser.addRole(muteRole.id)
                if(mutedUser.voiceChannel != null)
                {
                  mutedUser.setMute(true)
                  .then(() => console.log(`Muted ${mutedUser.displayName}`))
                  .catch(console.error)
                  return message.react('✅');//channel.send(timedMute);
                }
                else
                {
                  setTimeout(function()
                  {
                    mutedUser.removeRole(muteRole.id)
                    if(mutedUser.voiceChannel != null)
                    {
                      mutedUser.setMute(false)
                      .then(() => console.log(`Unmuted ${mutedUser.displayName}`))
                      .catch(console.error)
                    }
                    else
                    {
                      return;
                    }
                  }
                  , ms(muteTime));
                  //console.log(muteTime);
                  return message.react('✅');//channel.send(timedMute);
                }
              }
            }
          }
        }
      }
      else
      {
        return;
      }
    }
    }
    // function muteMember() {
    //
    // }
  },
};
