const Discord = require("discord.js");

module.exports = async (bot, message) =>
{
  bot.db.query(`SELECT serverLog FROM serverInfo WHERE serverID = '${message.guild.id}'`, async (err, rows) => {
    if (err) throw err;
    let logYN = rows[0].serverLog;
    if (logYN == 'Y') {
      let botPerms = message.guild.me.permissions.has(['SEND_MESSAGES', 'EMBED_LINKS'], true);
      if (!botPerms) {return;}
      else if (botPerms) {
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

            if(!logChannel) {
              try {
                message.guild.owner.send(embed);
              } catch (e) {
                return;
              }
            }
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

                if(!logChannel) {
                  try {
                    message.guild.owner.send(embed);
                  } catch (e) {
                    return;
                  }
                }
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

                if(!logChannel) {
                  try {
                    message.guild.owner.send(embed);
                  } catch (e) {
                    return;
                  }
                }
                else if(logChannel) {return logChannel.send(mDelete);}
              }
            });
          }

        // }
      }
    }
    else{return;}
  });
}
module.exports.help = {
  name: ""
}
