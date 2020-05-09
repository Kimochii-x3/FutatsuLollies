const Discord = require('discord.js');

module.exports = async (bot, message) => {
  const rows = await bot.db.query(`SELECT * FROM serverInfo WHERE serverID = '${message.guild.id}'`).catch(console.error);
  const logYN = rows[0].serverLog;
  if (logYN === 'Y') {
    const botPerms = message.guild.me.permissions.has(['SEND_MESSAGES', 'EMBED_LINKS'], true);
    if (!botPerms) { return; } else if (botPerms) {
      const logChannel = message.guild.channels.find(c => c.id === rows[0].serverClogID);
      const mFiles = await message.attachments.map(a => a.proxyURL);
      if (mFiles.length === 0) {
        const mDelete = new Discord.RichEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL)
        .setDescription(`**Message sent by **${message.author}** was deleted in **${message.channel}\n${message.content}`)
        .setColor('#c4150f')
        .setTimestamp()
        .setFooter(`Author ID: ${message.author.id} & Message ID: ${message.id}`);

        if (!logChannel) { return; } else if (logChannel) { return logChannel.send(mDelete); }
      } else if (mFiles.length >= 1) {
        mFiles.forEach(async (a, index, array) => {
          a = mFiles[index];
          // for (const a of mFiles) {
            if (a.toString().includes('.png') || a.toString().includes('.gif') || a.toString().includes('.jpg') || a.toString().includes('.jpeg') || a.toString().includes('.tiff') || a.toString().includes('.tif') || a.toString().includes('.bmp')) {
              const mDelete = new Discord.RichEmbed()
              .setAuthor(message.author.tag, message.author.displayAvatarURL)
              .setDescription(`**Message sent by **${message.author}** was deleted in **${message.channel}\n${message.content}`)
              .setColor('#c4150f')
              .setTimestamp()
              .setImage(a.toString())
              .setFooter(`Author ID: ${message.author.id} & Message ID: ${message.id}`);

              if (!logChannel) { return; } else if (logChannel) { return setTimeout(() => { logChannel.send(mDelete); }, 1250); }
            } else {
              const mDelete = new Discord.RichEmbed()
              .setAuthor(message.author.tag, message.author.displayAvatarURL)
              .setDescription(`**Message sent by **${message.author}** was deleted in **${message.channel}\n${message.content}\n**File format not an image: **${a}`)
              .setColor('#c4150f')
              .setTimestamp()
              .setFooter(`Author ID: ${message.author.id} & Message ID: ${message.id}`);

              if (!logChannel) { return; } else if (logChannel) { return logChannel.send(mDelete); }
            }
          // }
        });
      } /* else if (mFiles.length >= 2) {
        mFiles = mFiles.toString().replace(/,/g, '\n');
        const mDelete = new Discord.RichEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL)
        .setDescription(`**Message sent by **${message.author}** was deleted in **${message.channel}\n${message.content}**Multiple files: **${mFiles}`)
        .setColor('#c4150f')
        .setTimestamp()
        .setImage()
        .setFooter(`Author ID: ${message.author.id} & Message ID: ${message.id}`);

        if (!logChannel) { return; } else if (logChannel) { return logChannel.send(mDelete); }
      } */
    }
  } else { return; }
};
module.exports.help = {
  name: ''
};
