const Discord = require("discord.js");

module.exports = {
  name: 'color',
  description: 'creates a color role for yourself, works only with servers that have roles with the "default" color, also if the creator of the role leaves the server the role (if it exists) will be deleted',
  usage: 'fl.color #<hexcode> /provide no hexcode to see your color hexcode or mention someone to see their role hexcode/',
  args: false,
  execute(bot, message, args, option) {
    let botPerms = message.guild.me.permissions.has(['SEND_MESSAGES', 'MANAGE_ROLES', 'EMBED_LINKS', 'ADD_REACTIONS'], true);
    if (!botPerms) {return message.reply("insufficient permissions, add 'SEND_MESSAGES + MANAGE_ROLES + EMBED_LINKS + ADD_REACTIONS' perms to my role 'FutatsuLollies'");}
    else if (botPerms) {
      let phC = message.guild.roles.find(role => role.name == "▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇");
      if(!phC){
        try {
          message.guild.createRole({name:'▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇'}, "Creating a placeholder role for the colors");
        } catch (e) {
          console.log(e);
        }
      }
      else if (phC) {
      let thisGuild = message.guild;
      let mAuthorID = message.author.id;
      // let rqUser = message.guild.member(id);
      let clr = message.member.displayHexColor;
      let hexCode = args[0];
      let idOthers = message.mentions.members.first();
      let roleColor = message.guild.roles.find(role => role.name === "USER-"+mAuthorID);
      let placeholder = message.guild.roles.find(role => role.name == "▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇");

      let rolePreview = new Discord.RichEmbed()
      .setDescription("**Your role will look like this:**\n"+placeholder+"\n"+placeholder+"\n"+placeholder+"\n**Do you want to change your color?**")
      .setColor(clr)

      let rolePreview1 = new Discord.RichEmbed()
      .setDescription("**Your role will look like this:**\n"+placeholder+"\n"+placeholder+"\n"+placeholder)
      .setColor(clr)

      let reply1 = new Discord.RichEmbed()
      .setDescription("**Role Created**")
      .setColor(clr)

      let reply2 = new Discord.RichEmbed()
      .setDescription("**Role Updated**")
      .setColor(clr)


      if(!idOthers)
      {
        if(!roleColor)
        {
          if(!hexCode)
          {
            return message.channel.send("No role found.");
          }
          else if(!hexCode.startsWith("#"))
          {
            return message.channel.send("Incorrect code, example: fl.color #ff00ff");
          }
          else if(hexCode.startsWith("#"))
          {
            thisGuild.createRole({name: "USER-"+mAuthorID, color: hexCode, position: placeholder.calculatedPosition+1}).then(role =>
              {console.log(`Role created with name: ${role.name} & color: ${role.color}`);
              message.channel.send(rolePreview1);
              return rqUser.addRole(role.id)
            }).catch(console.error);
          }
        }
        else if(roleColor)
        {
          if(!hexCode)
          {
            return message.channel.send("Your role hex code is: "+roleColor.hexColor);
          }
          else if(hexCode === "remove")
          {
            roleColor.delete().catch(console.error);
            return message.channel.send(roleColor+" was deleted.");
          }
          else if(!hexCode.startsWith("#"))
          {
            return message.channel.send("Incorrect code, example: fl.color #ff00ff");
          }
          else if(hexCode.startsWith("#"))
          {
            placeholder.setColor(hexCode).then(roleColorChange => {
              console.log(`Changed the color of role ${roleColorChange.name} to ${roleColorChange.color}`);
              //placeholder.setColor(hexCode);
               const filter = (reaction, user) =>
               {
                 return ['✅', '❌'].includes(reaction.emoji.name) && user.id === mAuthorID;
               };
               message.channel.send(rolePreview).then(async (message) =>
               {
                 await message.react('✅');
                 await message.react('❌');
                 await message.awaitReactions(filter, {max: 1, time: 8000, errors: ['time'] }).then(reacts => {
                   const reaction = reacts.first();
                   if(reaction.emoji.name === '✅')
                   {
                     const latestEmbed = message.embeds[0];
                     const acceptEmbed = new Discord.RichEmbed(latestEmbed)
                     .setDescription("**Role Updated**")
                     .setColor(clr);
                     message.edit(acceptEmbed).catch(o_O => {})
                     message.clearReactions().catch(o_O => {})
                     return roleColor.setColor(hexCode);
                   }
                   else if(reaction.emoji.name === '❌')
                   {
                     const latestEmbed = message.embeds[0];
                     const cancelEmbed = new Discord.RichEmbed(latestEmbed)
                     .setDescription("**Canceled**")
                     .setColor(clr);
                     message.clearReactions().catch(o_O => {})
                     return message.edit(cancelEmbed).catch(o_O => {});
                   }
                   // else if(reacts.size === 0)
                   // {

                   // }
                 }).catch(error => {
                      const latestEmbed = message.embeds[0];
                      const noResponseEmbed = new Discord.RichEmbed(latestEmbed)
                      .setDescription("**Times Up**")
                      .setColor(clr);
                      message.clearReactions().catch(o_O => {})
                      return message.edit(noResponseEmbed).catch(o_O => {});
                    });
               }).catch(console.error);
            }).catch(console.error);
          }
        }
      }
      else if(idOthers)
      {
        if(hexCode === "<@!"+idOthers.id+">")
          {
            let roleColorOthers = message.guild.roles.find(role => role.name === "USER-"+idOthers.id);
            if(!roleColorOthers){
              return message.channel.send("Role hex code is: "+idOthers.displayHexColor);
            }
            else if (roleColorOthers) {
              return message.channel.send("Role hex code is: "+roleColorOthers.hexColor);
            }
          }
      }
    }
    }
  },
};
