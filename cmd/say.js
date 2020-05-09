const Discord = require('discord.js');

module.exports = {
  name: 'say',
  description: 'makes the bot send a message, it can be an embed one too',
  usage: 'fl.say <what to say> / fl.say <what to say> -e (to say it in an embed) [you need manage messages permission]',
  args: true,
  execute(bot, message, args, option) {
    const mAPC = message.member.permissions.has(['MANAGE_MESSAGES'], true);
    const bAPC = message.guild.me.permissions.has(['SEND_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS'], true);
    if (mAPC && bAPC) {
      if (!option[1]) {
        const content = args.join(' ');
        message.delete().catch(console.error);
        return message.channel.send(content);
      } else if (option[1] === 'e') {
          if (args.toString().length <= 2048) {
            message.delete().catch(console.error);
            const content = option.shift();
            const mEmbd = new Discord.RichEmbed()
            .setDescription(content)
            .setAuthor(message.author.tag, message.author.displayAvatarURL);
            return message.channel.send(mEmbd);
        } else if (args.toString().length > 2048) {
          return message.reply('character length must not exceed 2000');
        }
      }
    } else if (!mAPC) {
      return message.reply("you don't have `manage messages` permission");
    } else if (!bAPC) {
      return message.reply('I don\'t have `send messages` or `manage messages` or `embed links` permission(s)');
    }
  },
};
