const Discord = require("discord.js");
// const mysql = require("mysql");

module.exports = async (bot, guild) =>
{
  // bot.db.query(`SELECT serverLog FROM serverInfo WHERE serverID = '${guild.id}'`, async (err, rows) => {
  //   if (err) throw err;
  //   let logYN = rows[0].serverLog;
  //   if (logYN == 'Y') {
      let botPerms = guild.me.permissions.has(['SEND_MESSAGES', 'MANAGE_CHANNELS'], true);
      if (!botPerms) {return;}
      else if (botPerms) {
        let logChannel = guild.channels.find(c => c.name === "event-horizon");
        if(!logChannel)
          {
          try {
            guild.createChannel('event-horizon', {type: 'text', topic:'FutatsuLollies mod logging', permissionOverwrites:[
              {
                id: guild.id,
                deny:['READ_MESSAGES', 'SEND_MESSAGES']
              },
              {
                id: guild.me.id,
                allow: ['READ_MESSAGES', 'SEND_MESSAGES']
              }
            ]});
          } catch (e) {
            console.log(e);
          }
        }
        else if (logChannel) {
          return;
        }
      }
  //   }
  //   else{return;}
  // });
}
module.exports.help = {
  name: ""
}
