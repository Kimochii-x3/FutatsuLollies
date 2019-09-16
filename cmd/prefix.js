const Discord = require("discord.js");

module.exports = {
  name: 'prefix',
  description: 'showcases the prefix or changes the prefix',
  usage: 'fl.prefix (to view the prefix) or fl.prefix >new prefix< -set (to set the new prefix)',
  args: false,
  execute(bot, message, args, option, commands, prefix, db) {
    // console.log(option);
    if (!args[0]){
      return message.channel.send("The prefix for this server is: `" + prefix + "`, default prefix is: `fl.`");
    }
    else if (args[0]) {
      if (option[1] === 'set'){
        if (message.member.permissions.has(['ADMINISTRATOR'], true)){
          if(args[0].length > 3) {message.reply('maximum allowed characters for prefix is 3');}
          else {
            let sql = `UPDATE serverInfo SET prefix = '${args[0]}' WHERE serverID = ${message.guild.id}`
            // console.log(sql);
            db.query(sql);
            message.channel.send(`Successfully changed the prefix to \`${args[0]}\``)
          }
        }
        else {
          return message.reply('you do not have administrator permission');
        }
      }
    }
  },
};
