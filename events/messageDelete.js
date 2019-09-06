const Discord = require("discord.js");

module.exports = (bot, message) =>
{
  if (!message.guild.me.permissions.has('ADMINISTRATOR', true)) {return;}
  else if (message.guild.me.permissions.has('ADMINISTRATOR', true)) {
    // if(!message.author.bot || message.author.id != "254349985963835393")
    // {
      // let mGuild = message.guild;
      let logChannel = message.guild.channels.find(channel => channel.name === "event-horizon");
      let mContent = message.content;
      let mFiles = message.attachments.map(attachments => attachments.proxyURL);
      let mAuthor = message.author;
      let mID = message.id;
      let mCD = message.channel;
      let msgSentIn = message.guild.channels.find(c => c.id === mCD.id);
      if(mFiles.length == 0)
      {
        let mDelete = new Discord.RichEmbed()
        .setAuthor(mAuthor.tag, mAuthor.displayAvatarURL)
        .setDescription("**Message sent by **"+mAuthor+"** was deleted in **"+msgSentIn+"\n"+mContent)
        .setColor("#c4150f")
        .setTimestamp()
        .setFooter("Author: "+mAuthor.id+" & Message ID: "+mID)

        if(!logChannel) {return message.guild.owner.send(mDelete).catch(console.error);}
        else if(logChannel) {return logChannel.send(mDelete);}
      }
      else if(mFiles.length >= 1)
      {
        mFiles.forEach(function (msg, index, array)
        {
          msg = mFiles[index];
          if(msg.toString().includes('.png')||msg.toString().includes('.gif')||msg.toString().includes('.jpg')||msg.toString().includes('.jpeg')||msg.toString().includes('.tiff')||msg.toString().includes('.tif')||msg.toString().includes('.bmp'))
          {
            let mDelete = new Discord.RichEmbed()
            .setAuthor(mAuthor.tag, mAuthor.displayAvatarURL)
            .setDescription("**Message sent by **"+mAuthor+"** was deleted in **"+msgSentIn+"\n"+mContent)
            .setColor("#c4150f")
            .setTimestamp()
            .setImage(msg.toString())
            .setFooter("Author: "+mAuthor.id+" & Message ID: "+mID)

            if(!logChannel) {return message.guild.owner.send(mDelete).catch(console.error);}
            else if(logChannel) {return logChannel.send(mDelete);}
          }
          else
          {
            let mDelete = new Discord.RichEmbed()
            .setAuthor(mAuthor.tag, mAuthor.displayAvatarURL)
            .setDescription("**Message sent by **"+mAuthor+"** was deleted in **"+msgSentIn+"\n"+mContent+"\n**File format not an image: **"+msg)
            .setColor("#c4150f")
            .setTimestamp()
            .setFooter("Author: "+mAuthor.id+" & Message ID: "+mID)

            if(!logChannel) {return message.guild.owner.send(mDelete).catch(console.error);}
            else if(logChannel) {return logChannel.send(mDelete);}
          }
        });
      }

    // }
  }
}
module.exports.help = {
  name: ""
}
