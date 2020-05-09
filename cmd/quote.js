const Discord = require('discord.js');

module.exports = {
  name: 'quote',
  description: 'quotes a user, you can make fake quotes or real ones (real ones include "Jump to message")',
  usage: 'fl.quote user @<someone> <what to say> or <user ID> <what to say> / fl.quote message <message ID> / fl.quote #<channel name> <message ID> (use this if quoting outside the channel you want the quote to go in)',
  args: true,
  async execute(bot, message, args, option) {
    const botPerms = message.guild.me.permissions.has(['SEND_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS'], true);
    if (!botPerms) { return message.reply("insufficient permissions, add 'SEND_MESSAGES + MANAGE_ROLES + EMBED_LINKS' perms to my role 'FutatsuLollies'"); }
    else if (botPerms) {
      // const mAuthor = message.author.id;
      // const rqUser = message.member;
      const quoteFrom = message.mentions.members.first();
      const channelToQuoteFrom = message.mentions.channels.first();
      const mContent = message.content.split(/\s+/g); //substring(message.content.indexOf(" ")+args0.length+2, message.content.length);
      //
      const args1 = mContent[1];
      const args2 = mContent[2];
      const args3 = mContent[3];
      switch (args1) {
        case 'user': {
          if (quoteFrom) {
            const mContent2 = mContent.slice(3).join(' ');
            const clr = message.guild.member(quoteFrom).displayHexColor;
            message.delete().catch();
            const quote = new Discord.RichEmbed()
            .setAuthor(bot.users.get(quoteFrom.id).tag, bot.users.get(quoteFrom.id).displayAvatarURL)
            .setDescription(mContent2)
            .setTimestamp()
            .setColor(clr);
            return message.channel.send(quote);
          } else if (!quoteFrom) {
            const mContent2 = mContent.slice(3).join(' ');
            const clr = message.guild.member(message.guild.member(args2)).displayHexColor;
            message.delete().catch();
            const quote = new Discord.RichEmbed()
            .setAuthor(bot.users.get(args2).tag, bot.users.get(args2).displayAvatarURL)
            .setDescription(mContent2)
            .setTimestamp()
            .setColor(clr);
            return message.channel.send(quote);
          }
          break;
        }
        case 'message': {
          if (channelToQuoteFrom) {
            const mContent2 = mContent.slice(4).join(' ');
            const fetchedMsgUser = await channelToQuoteFrom.fetchMessage(args3).then(message => message.author.id).catch(console.error);
            const fetchedMsgContent = await channelToQuoteFrom.fetchMessage(args3).then(message => message.content).catch(console.error);
            let fetchedMsgFiles = await channelToQuoteFrom.fetchMessage(args3).then(message => message.attachments.map(attachments => attachments.proxyURL)).catch(console.error);
            const fetchedMsgLink = await channelToQuoteFrom.fetchMessage(args3).then(message => message.url).catch(console.error);
            const clr = message.guild.member(message.guild.member(fetchedMsgUser)).displayHexColor;
            message.delete().catch();
            if (fetchedMsgFiles.length === 0) {
              const quote = new Discord.RichEmbed()
              .setAuthor(bot.users.get(fetchedMsgUser).tag, bot.users.get(fetchedMsgUser).displayAvatarURL)
              .setDescription(`${fetchedMsgContent}\n\n[Jump to message](${fetchedMsgLink})`)
              .setTimestamp()
              .setColor(clr);
              return message.channel.send(quote);
            } else if (fetchedMsgFiles.length === 1 && (fetchedMsgFiles.toString().includes('.png') || fetchedMsgFiles.toString().includes('.gif') || fetchedMsgFiles.toString().includes('.jpg') || fetchedMsgFiles.toString().includes('.jpeg') || fetchedMsgFiles.toString().includes('.tiff') || fetchedMsgFiles.toString().includes('.tif') || fetchedMsgFiles.toString().includes('.bmp'))) {
              const quote = new Discord.RichEmbed()
              .setAuthor(bot.users.get(fetchedMsgUser).tag, bot.users.get(fetchedMsgUser).displayAvatarURL)
              .setDescription(`${fetchedMsgContent}\n\n[Jump to message](${fetchedMsgLink})`)
              .setTimestamp()
              .setImage(fetchedMsgFiles.toString())
              .setColor(clr)
              return message.channel.send(quote);
            } else if (fetchedMsgFiles.length === 1 && !(fetchedMsgFiles.toString().includes('.png') || fetchedMsgFiles.toString().includes('.gif') || fetchedMsgFiles.toString().includes('.jpg') || fetchedMsgFiles.toString().includes('.jpeg') || fetchedMsgFiles.toString().includes('.tiff') || fetchedMsgFiles.toString().includes('.tif') || fetchedMsgFiles.toString().includes('.bmp'))) {
              fetchedMsgFiles = fetchedMsgFiles.toString().replace(/,/g, '\n');
              const quote = new Discord.RichEmbed()
              .setAuthor(bot.users.get(fetchedMsgUser).tag, bot.users.get(fetchedMsgUser).displayAvatarURL)
              .setDescription(`${fetchedMsgContent}\n**File format not an image: **${fetchedMsgFiles}\n\n[Jump to message](${fetchedMsgLink})`)
              .setTimestamp()
              .setColor(clr);
              return message.channel.send(quote);
            } else if (fetchedMsgFiles.length >= 2) {
              fetchedMsgFiles = fetchedMsgFiles.toString().replace(/,/g, '\n');
              const quote = new Discord.RichEmbed()
              .setAuthor(bot.users.get(fetchedMsgUser).tag, bot.users.get(fetchedMsgUser).displayAvatarURL)
              .setDescription(`${fetchedMsgContent}\n**Multiple files: **${fetchedMsgFiles}\n\n[Jump to message](${fetchedMsgLink})`)
              .setTimestamp()
              .setColor(clr);
              return message.channel.send(quote);
            }
          } else if (!channelToQuoteFrom) {
            const mContent2 = mContent.slice(3).join(' ');
            const fetchedMsgUser = await message.channel.fetchMessage(args2).then(message => message.author.id).catch(console.error);
            const fetchedMsgContent = await message.channel.fetchMessage(args2).then(message => message.content).catch(console.error);
            let fetchedMsgFiles = await message.channel.fetchMessage(args2).then(message => message.attachments.map(attachments => attachments.proxyURL)).catch(console.error);
            const fetchedMsgLink = await message.channel.fetchMessage(args2).then(message => message.url).catch(console.error);
            const clr = message.guild.member(message.guild.member(fetchedMsgUser)).displayHexColor;
            message.delete().catch();
            if (fetchedMsgFiles.length === 0) {
              const quote = new Discord.RichEmbed()
              .setAuthor(bot.users.get(fetchedMsgUser).tag, bot.users.get(fetchedMsgUser).displayAvatarURL)
              .setDescription(`${fetchedMsgContent}\n\n[Jump to message](${fetchedMsgLink})`)
              .setTimestamp()
              .setColor(clr);
              return message.channel.send(quote);
            } else if (fetchedMsgFiles.length === 1 && (fetchedMsgFiles.toString().includes('.png') || fetchedMsgFiles.toString().includes('.gif') || fetchedMsgFiles.toString().includes('.jpg') || fetchedMsgFiles.toString().includes('.jpeg') || fetchedMsgFiles.toString().includes('.tiff') || fetchedMsgFiles.toString().includes('.tif') || fetchedMsgFiles.toString().includes('.bmp'))) {
              const quote = new Discord.RichEmbed()
              .setAuthor(bot.users.get(fetchedMsgUser).tag, bot.users.get(fetchedMsgUser).displayAvatarURL)
              .setDescription(`${fetchedMsgContent}\n\n[Jump to message](${fetchedMsgLink})`)
              .setTimestamp()
              .setImage(fetchedMsgFiles.toString())
              .setColor(clr);
              return message.channel.send(quote);
            } else if (fetchedMsgFiles.length === 1 && !(fetchedMsgFiles.toString().includes('.png') || fetchedMsgFiles.toString().includes('.gif') || fetchedMsgFiles.toString().includes('.jpg') || fetchedMsgFiles.toString().includes('.jpeg') || fetchedMsgFiles.toString().includes('.tiff') || fetchedMsgFiles.toString().includes('.tif') || fetchedMsgFiles.toString().includes('.bmp'))) {
              fetchedMsgFiles = fetchedMsgFiles.toString().replace(/,/g, '\n');
              const quote = new Discord.RichEmbed()
              .setAuthor(bot.users.get(fetchedMsgUser).tag, bot.users.get(fetchedMsgUser).displayAvatarURL)
              .setDescription(`${fetchedMsgContent}\n**File format not an image: **${fetchedMsgFiles}\n\n[Jump to message](${fetchedMsgLink})`)
              .setTimestamp()
              .setColor(clr);
              return message.channel.send(quote);
            } else if (fetchedMsgFiles.length >= 2) {
              fetchedMsgFiles = fetchedMsgFiles.toString().replace(/,/g, '\n');
              const quote = new Discord.RichEmbed()
              .setAuthor(bot.users.get(fetchedMsgUser).tag, bot.users.get(fetchedMsgUser).displayAvatarURL)
              .setDescription(`${fetchedMsgContent}\n**Multiple files: **${fetchedMsgFiles}\n\n[Jump to message](${fetchedMsgLink})`)
              .setTimestamp()
              .setColor(clr);
              return message.channel.send(quote);
            }
          }
          break;
        }
        default: { return; }
      }
    }
  },
};
