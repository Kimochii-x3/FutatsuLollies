const Discord = require("discord.js");

module.exports = {
  name: 'quote',
  description: 'quotes a user, you can make fake quotes or real ones (real ones include "Jump to message")',
  usage: 'fl.quote user @\'member\'/\'USER id\' \'content\' ; fl.quote message /#\'channel name\', required only when quoting outside of the channel/ \'MESSAGE id\' ',
  args: true,
  async execute(bot, message, args, option) {
    let botPerms = message.guild.me.permissions.has(['SEND_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS'], true);
    if (!botPerms) {return message.reply("insufficient permissions, add 'SEND_MESSAGES + MANAGE_ROLES + EMBED_LINKS' perms to my role 'FutatsuLollies'");}
    else if (botPerms) {
      let mAuthor = message.author.id;
      let rqUser = message.member;
      let quoteFrom = message.mentions.members.first();
      let channelToQuoteFrom = message.mentions.channels.first();
      let mContent = message.content.split(/\s+/g) //substring(message.content.indexOf(" ")+args0.length+2, message.content.length);
      //
      let args1 = mContent[1];
      let args2 = mContent[2];
      let args3 = mContent[3];
      switch (args1)
      {
      case "user":
        if(quoteFrom)
        {
          let mContent2 = mContent.slice(3).join(" ");
          let clr = message.guild.member(quoteFrom).displayHexColor;
          message.delete().catch();
          let quote = new Discord.RichEmbed()
          .setAuthor(bot.users.get(quoteFrom.id).tag, bot.users.get(quoteFrom.id).displayAvatarURL)
          .setDescription(mContent2)
          .setTimestamp()
          .setColor(clr)
          return message.channel.send(quote)
        }
        else if(!quoteFrom)
        {
          let mContent2 = mContent.slice(3).join(" ");
          let clr = message.guild.member(message.guild.member(args2)).displayHexColor;
          message.delete().catch();
          let quote = new Discord.RichEmbed()
          .setAuthor(bot.users.get(args2).tag, bot.users.get(args2).displayAvatarURL)
          .setDescription(mContent2)
          .setTimestamp()
          .setColor(clr)
          return message.channel.send(quote)
        }
      case "message":
        if(channelToQuoteFrom)
        {
          let mContent2 = mContent.slice(4).join(" ");
          let fetchedMsgUser = await channelToQuoteFrom.fetchMessage(args3).then(message => message.author.id).catch(console.error);
          let fetchedMsgContent = await channelToQuoteFrom.fetchMessage(args3).then(message => message.content).catch(console.error);
          let fetchedMsgFiles = await channelToQuoteFrom.fetchMessage(args3).then(message => message.attachments.map(attachments => attachments.proxyURL)).catch(console.error);
          let fetchedMsgLink = await channelToQuoteFrom.fetchMessage(args3).then(message => message.url).catch(console.error);
          let clr = message.guild.member(message.guild.member(fetchedMsgUser)).displayHexColor;
          message.delete().catch();
          if(fetchedMsgFiles.length == 0)
          {
            let quote = new Discord.RichEmbed()
            .setAuthor(bot.users.get(fetchedMsgUser).tag, bot.users.get(fetchedMsgUser).displayAvatarURL)
            .setDescription(fetchedMsgContent+"\n"+"\n"+"[Jump to message]("+fetchedMsgLink+")")
            .setTimestamp()
            .setColor(clr)
            return message.channel.send(quote);
          }
          else if(fetchedMsgFiles.length == 1 && (fetchedMsgFiles.toString().includes('.png')||fetchedMsgFiles.toString().includes('.gif')||fetchedMsgFiles.toString().includes('.jpg')||fetchedMsgFiles.toString().includes('.jpeg')||fetchedMsgFiles.toString().includes('.tiff')||fetchedMsgFiles.toString().includes('.tif')||fetchedMsgFiles.toString().includes('.bmp')))
          {
            let quote = new Discord.RichEmbed()
            .setAuthor(bot.users.get(fetchedMsgUser).tag, bot.users.get(fetchedMsgUser).displayAvatarURL)
            .setDescription(fetchedMsgContent+"\n"+"\n"+"[Jump to message]("+fetchedMsgLink+")")
            .setTimestamp()
            .setImage(fetchedMsgFiles.toString())
            .setColor(clr)
            return message.channel.send(quote);
          }
          else if(fetchedMsgFiles.length == 1 && !(fetchedMsgFiles.toString().includes('.png')||fetchedMsgFiles.toString().includes('.gif')||fetchedMsgFiles.toString().includes('.jpg')||fetchedMsgFiles.toString().includes('.jpeg')||fetchedMsgFiles.toString().includes('.tiff')||fetchedMsgFiles.toString().includes('.tif')||fetchedMsgFiles.toString().includes('.bmp')))
          {
            fetchedMsgFiles = fetchedMsgFiles.toString().replace(/,/g, "\n");
            let quote = new Discord.RichEmbed()
            .setAuthor(bot.users.get(fetchedMsgUser).tag, bot.users.get(fetchedMsgUser).displayAvatarURL)
            .setDescription(fetchedMsgContent+"\n**File format not an image: **"+fetchedMsgFiles+"\n"+"\n"+"[Jump to message]("+fetchedMsgLink+")")
            .setTimestamp()
            .setColor(clr)
            return message.channel.send(quote);
          }
          else if(fetchedMsgFiles.length >= 2)
          {
            fetchedMsgFiles = fetchedMsgFiles.toString().replace(/,/g, "\n");
            let quote = new Discord.RichEmbed()
            .setAuthor(bot.users.get(fetchedMsgUser).tag, bot.users.get(fetchedMsgUser).displayAvatarURL)
            .setDescription(fetchedMsgContent+"\n**Multiple files: **"+fetchedMsgFiles+"\n"+"\n"+"[Jump to message]("+fetchedMsgLink+")")
            .setTimestamp()
            .setColor(clr)
            return message.channel.send(quote);
          }
        }
        else if(!channelToQuoteFrom)
        {
          let mContent2 = mContent.slice(3).join(" ");
          let fetchedMsgUser = await message.channel.fetchMessage(args2).then(message => message.author.id).catch(console.error);
          let fetchedMsgContent = await message.channel.fetchMessage(args2).then(message => message.content).catch(console.error);
          let fetchedMsgFiles = await message.channel.fetchMessage(args2).then(message => message.attachments.map(attachments => attachments.proxyURL)).catch(console.error);
          let fetchedMsgLink = await message.channel.fetchMessage(args2).then(message => message.url).catch(console.error);
          let clr = message.guild.member(message.guild.member(fetchedMsgUser)).displayHexColor;
          message.delete().catch();
          if(fetchedMsgFiles.length == 0)
          {
            let quote = new Discord.RichEmbed()
            .setAuthor(bot.users.get(fetchedMsgUser).tag, bot.users.get(fetchedMsgUser).displayAvatarURL)
            .setDescription(fetchedMsgContent+"\n"+"\n"+"[Jump to message]("+fetchedMsgLink+")")
            .setTimestamp()
            .setColor(clr)
            return message.channel.send(quote);
          }
          else if(fetchedMsgFiles.length == 1 && (fetchedMsgFiles.toString().includes('.png')||fetchedMsgFiles.toString().includes('.gif')||fetchedMsgFiles.toString().includes('.jpg')||fetchedMsgFiles.toString().includes('.jpeg')||fetchedMsgFiles.toString().includes('.tiff')||fetchedMsgFiles.toString().includes('.tif')||fetchedMsgFiles.toString().includes('.bmp')))
          {
            let quote = new Discord.RichEmbed()
            .setAuthor(bot.users.get(fetchedMsgUser).tag, bot.users.get(fetchedMsgUser).displayAvatarURL)
            .setDescription(fetchedMsgContent+"\n"+"\n"+"[Jump to message]("+fetchedMsgLink+")")
            .setTimestamp()
            .setImage(fetchedMsgFiles.toString())
            .setColor(clr)
            return message.channel.send(quote);
          }
          else if(fetchedMsgFiles.length == 1 && !(fetchedMsgFiles.toString().includes('.png')||fetchedMsgFiles.toString().includes('.gif')||fetchedMsgFiles.toString().includes('.jpg')||fetchedMsgFiles.toString().includes('.jpeg')||fetchedMsgFiles.toString().includes('.tiff')||fetchedMsgFiles.toString().includes('.tif')||fetchedMsgFiles.toString().includes('.bmp')))
          {
            fetchedMsgFiles = fetchedMsgFiles.toString().replace(/,/g, "\n");
            let quote = new Discord.RichEmbed()
            .setAuthor(bot.users.get(fetchedMsgUser).tag, bot.users.get(fetchedMsgUser).displayAvatarURL)
            .setDescription(fetchedMsgContent+"\n**File format not an image: **"+fetchedMsgFiles+"\n"+"\n"+"[Jump to message]("+fetchedMsgLink+")")
            .setTimestamp()
            .setColor(clr)
            return message.channel.send(quote);
          }
          else if(fetchedMsgFiles.length >= 2)
          {
            fetchedMsgFiles = fetchedMsgFiles.toString().replace(/,/g, "\n");
            let quote = new Discord.RichEmbed()
            .setAuthor(bot.users.get(fetchedMsgUser).tag, bot.users.get(fetchedMsgUser).displayAvatarURL)
            .setDescription(fetchedMsgContent+"\n**Multiple files: **"+fetchedMsgFiles+"\n"+"\n"+"[Jump to message]("+fetchedMsgLink+")")
            .setTimestamp()
            .setColor(clr)
            return message.channel.send(quote);
          }
        }
    }
    }
  },
};
