const Discord = require("discord.js");

module.exports = {
  name: 'say',
  description: 'makes the bot send a message',
  usage: 'fl.say <content>',
  args: true,
  execute(bot, message, args, option) {
    let mAPC = message.member.permissions.has("MANAGE_MESSAGES", true);
    if(mAPC){
      if(!option[1]){
        // console.log(option[1]);
        let content = args.join(" ");
        message.delete().catch(console.error);
        return message.channel.send(content);
      }
      else if (option[1] == "e") {
          if(args.toString().length <= 2048){
            message.delete().catch(console.error);
            let content = args.join(" ").slice(option[1]);
            let mEmbd = new Discord.RichEmbed()
            .setDescription(content)
            .setAuthor(message.author.tag, message.author.displayAvatarURL)
            return message.channel.send(mEmbd);
        }
        else if (args.toString().length > 2048) {
          return message.reply("character length must not exceed 2000");
        }
      }
    }
    else if (!mAPC) {
      return message.reply("insufficient permissions");
    }
  },
};
