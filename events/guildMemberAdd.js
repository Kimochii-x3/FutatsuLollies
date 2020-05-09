const Discord = require('discord.js');

module.exports = async (bot, member) => {
  const rows = await bot.db.query(`SELECT * FROM serverInfo WHERE serverID = '${member.guild.id}'`).catch(console.error);
  const logYN = rows[0].serverLog;
  if (logYN === 'Y') {
    const botPerms = member.guild.me.permissions.has(['SEND_MESSAGES', 'EMBED_LINKS'], true);
    if (!botPerms) { return; } else if (botPerms) {
      const logChannel = member.guild.channels.find(channel => channel.id === rows[0].serverClogID);
      const embed = new Discord.RichEmbed()
      .setAuthor('User join')
      .setDescription(`Username: **${member.user.tag}**\n ID: **${member.user.id}**`)
      .setColor('GREEN')
      .setTimestamp();

      if (!logChannel) { return; } else if (logChannel) { return logChannel.send(embed); }
    }
  } else { return; }
};
module.exports.help = {
  name: ''
};
