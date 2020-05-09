const Discord = require('discord.js');

module.exports = async (bot, guild) => {
  setTimeout(() => {
      const botPerms = guild.me.permissions.has(['SEND_MESSAGES', 'MANAGE_CHANNELS'], true);
      if (!botPerms) { return; } else if (botPerms) {
        const logChannel = guild.channels.find(c => c.name === 'event-horizon');
        if (!logChannel) {
          try {
            guild.createChannel('event-horizon', {
              type: 'text',
              topic: 'FutatsuLollies mod logging',
              permissionOverwrites: [
                {
                  id: guild.id,
                  deny: ['READ_MESSAGES', 'SEND_MESSAGES']
                },
                {
                  id: guild.me.id,
                  allow: ['READ_MESSAGES', 'SEND_MESSAGES']
                }
              ]
            }).then(async channel => {
              const rows = await bot.db.query(`SELECT * FROM serverInfo WHERE serverID = '${guild.id}'`).catch(console.error);
              if (rows[0].serverClogID !== channel.id) {
                await bot.db.query(`UPDATE serverInfo SET serverClogID = '${channel.id}' WHERE serverID = '${guild.id}'`);
                channel.send(`Registered channel ${channel} with ID ${channel.id} to the database, feel free to rename the channel`);
              }
            });
          } catch (e) {
            console.log(e);
          }
        } else if (logChannel) {
          return;
        }
      }
    }, 2000);
};
module.exports.help = {
  name: ''
};
