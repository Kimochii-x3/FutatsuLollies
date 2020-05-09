const Discord = require('discord.js');

module.exports = {
  name: 'color',
  description: 'creates a color role for yourself, works only with servers that have roles with the "default" color, also if the creator of the role leaves the server the role (if it exists) will be deleted',
  usage: 'fl.color #<hexcode> / fl.color @<someone>',
  args: false,
  execute(bot, message, args, option) {
    const botPerms = message.guild.me.permissions.has(['SEND_MESSAGES', 'MANAGE_ROLES', 'EMBED_LINKS', 'ADD_REACTIONS'], true);
    if (!botPerms) {
      return message.reply('insufficient permissions, add `SEND MESSAGES` + `MANAGE ROLES` + `EMBED LINKS` + `ADD REACTIONS` perms to my role `FutatsuLollies`');
    } else if (botPerms) {
        const phC = message.guild.roles.find(role => role.name === '▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇');
        if (!phC) {
          try {
            message.guild.createRole({ name: '▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇' }, 'Creating a placeholder role for the colors');
          } catch (e) {
            console.log(e);
          }
        } else if (phC) {
        // const thisGuild = message.guild;
        // const mAuthorID = message.author.id;
        // let rqUser = message.guild.member(id);
        // const clr = message.member.displayHexColor;
        const hexCode = args[0];
        const idOthers = message.mentions.members.first();
        const roleColor = message.guild.roles.find(role => role.name === `USER-${message.author.id}`);
        const placeholder = message.guild.roles.find(role => role.name === '▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇');

        const rolePreview = new Discord.RichEmbed()
        .setDescription(`**Your role will look like this:\n${placeholder}\n${placeholder}\n${placeholder}\nDo you want to change your color?**`)
        .setColor(message.member.displayHexColor);

        // const rolePreview1 = new Discord.RichEmbed()
        // .setDescription(`**Your role will look like this:**\n${placeholder}\n${placeholder}\n${placeholder}`)
        // .setColor(message.member.displayHexColor);

        if (!idOthers) {
          if (!roleColor) {
            if (!hexCode) {
              return message.channel.send('No role found.');
            } else if (!hexCode.startsWith('#')) {
              return message.channel.send('Incorrect code, example: fl.color #ff00ff');
            } else if (hexCode.startsWith('#')) {
              message.guild.createRole({ name: `USER-${message.author.id}`, color: hexCode, position: placeholder.calculatedPosition + 1 }).then(async role => {
                console.log(`Role created with name: ${role.name} & color: ${role.color}`);
                await placeholder.setColor(hexCode);
                const filter = (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
                message.channel.send(rolePreview).then(async (botMsg) => {
                  await botMsg.react('✅');
                  await botMsg.react('❌');
                  await botMsg.awaitReactions(filter, { max: 1, time: 12000, errors: ['time'] }).then(reacts => {
                    const reaction = reacts.first();
                    if (reaction.emoji.name === '✅') {
                      const latestEmbed = botMsg.embeds[0];
                      const acceptEmbed = new Discord.RichEmbed(latestEmbed)
                      .setDescription('**Role set**')
                      .setColor(message.member.displayHexColor);
                      botMsg.clearReactions().catch(() => {});
                      message.member.addRole(role.id);
                      return botMsg.edit(acceptEmbed).catch(() => {});
                    } else if (reaction.emoji.name === '❌') {
                      const latestEmbed = botMsg.embeds[0];
                      const cancelEmbed = new Discord.RichEmbed(latestEmbed)
                      .setDescription('**Canceled**')
                      .setColor(botMsg.member.displayHexColor);
                      botMsg.clearReactions().catch(() => {});
                      role.delete('User color role deleted because of cancellation').catch(console.error);
                      return botMsg.edit(cancelEmbed).catch(() => {});
                    }
                  }).catch(() => {
                    const latestEmbed = botMsg.embeds[0];
                    const noResponseEmbed = new Discord.RichEmbed(latestEmbed)
                    .setDescription('**Times up**')
                    .setColor(botMsg.member.displayHexColor);
                    botMsg.clearReactions().catch(() => {});
                    role.delete('User role deleted because time\' up').catch(console.error);
                    return botMsg.edit(noResponseEmbed).catch(() => {});
                  });
                }).catch(console.error);
              }).catch(console.error);
            }
          } else if (roleColor) {
            if (!hexCode) {
              return message.channel.send(`Your role hex code is: ${roleColor.hexColor}`);
            } else if (hexCode === 'remove') {
              roleColor.delete().catch(console.error);
              return message.channel.send(`${roleColor} was deleted.`);
            } else if (!hexCode.startsWith('#')) {
              return message.channel.send('Incorrect code, example: fl.color #ff00ff');
            } else if (hexCode.startsWith('#')) {
              placeholder.setColor(hexCode).then(roleColorChange => {
                console.log(`Changed the color of role ${roleColorChange.name} to ${roleColorChange.color}`);
                 const filter = (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
                 message.channel.send(rolePreview).then(async (botMsg) => {
                   await botMsg.react('✅');
                   await botMsg.react('❌');
                   await botMsg.awaitReactions(filter, { max: 1, time: 12000, errors: ['time'] }).then(reacts => {
                     const reaction = reacts.first();
                     if (reaction.emoji.name === '✅') {
                       const latestEmbed = botMsg.embeds[0];
                       const acceptEmbed = new Discord.RichEmbed(latestEmbed)
                       .setDescription('**Role Updated**')
                       .setColor(message.member.displayHexColor);
                       botMsg.clearReactions().catch(() => {});
                       botMsg.edit(acceptEmbed).catch(() => {});
                       return roleColor.setColor(hexCode);
                     } else if (reaction.emoji.name === '❌') {
                       const latestEmbed = botMsg.embeds[0];
                       const cancelEmbed = new Discord.RichEmbed(latestEmbed)
                       .setDescription('**Canceled**')
                       .setColor(message.member.displayHexColor);
                       botMsg.clearReactions().catch(() => {});
                       return botMsg.edit(cancelEmbed).catch(() => {});
                     }
                   }).catch(() => {
                        const latestEmbed = botMsg.embeds[0];
                        const noResponseEmbed = new Discord.RichEmbed(latestEmbed)
                        .setDescription('**Times Up**')
                        .setColor(message.member.displayHexColor);
                        botMsg.clearReactions().catch(() => {});
                        return botMsg.edit(noResponseEmbed).catch(() => {});
                      });
                 }).catch(console.error);
              }).catch(console.error);
            }
          }
        } else if (idOthers) {
          if (hexCode === `<@!${idOthers.id}>`) {
              const roleColorOthers = message.guild.roles.find(role => role.name === `USER-${idOthers.id}`);
              if (!roleColorOthers) {
                return message.channel.send(`Role hex code is: ${idOthers.displayHexColor}`);
              } else if (roleColorOthers) {
                return message.channel.send(`User role hex code is: ${roleColorOthers.hexColor}`);
              }
            }
        }
      }
    }
  },
};
