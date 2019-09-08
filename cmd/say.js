const Discord = require("discord.js");

module.exports = {
  name: 'say',
  description: 'makes the bot send a message',
  usage: 'fl.say <content> /optional to make it an embed add \'-e\' at the end/',
  args: true,
  execute(bot, message, args, option) {
    let mAPC = message.member.permissions.has('MANAGE_MESSAGES', true);
    let bAPC = message.guild.me.permissions.has('SEND_MESSAGES','MANAGE_MESSAGES', 'EMBED_LINKS', true);
    if(mAPC && bAPC){
      if(!option[1]){
        // console.log(option[1]);
        let content = args.join(" ");
        message.delete().catch(console.error);
        return message.channel.send(content);
      }
      else if (option[1] == "e") {
          if(args.toString().length <= 2048){
            message.delete().catch(console.error);
            // console.log(args);
            // console.log(option);
            // let content = args.join(" ").slice(option[1]);
            let content = option.shift();
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
    else if (!mAPC || !bAPC) {
      return message.reply("insufficient permissions");
    }
  },
};
