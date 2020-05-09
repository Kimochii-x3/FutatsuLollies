const Discord = require('discord.js');

module.exports = {
  name: 'l',
  description: 'looks up a user\'s avatar by mentioning them or by their ID, using ID lets you lookup avatars of any member in other servers',
  usage: 'fl.l avatar @<someone>/ fl.l avatar <user ID> / fl.l tag @<someone> / fl.l tag <user ID>',
  args: true,
  async execute(bot, message, args, option) {
    const mAuthor = message.author.id;
    const lookup = args[0];
    const id = args[1];
    const mentionedMember = message.mentions.members.first();
    if (mAuthor !== 0) {
      if (mentionedMember) {
        switch (lookup) {
          case 'avatar': {
            const avatarurl = await bot.fetchUser(mentionedMember.id, true).then(u => u.avatarURL);
            return message.channel.send(`${avatarurl}+?size=1024`);
          }
          case 'tag': {
            const tag = await bot.fetchUser(mentionedMember.id, true).then(u => u.tag);
            return message.channel.send(tag);
          }
          default: { return; }
        }
      } else {
        switch (lookup) {
          case 'avatar': {
            const avatarurl = await bot.fetchUser(id, true).then(u => u.avatarURL);
            return message.channel.send(`${avatarurl}?size=1024`);
          }
          case 'tag': {
            const tag = await bot.fetchUser(id, true).then(u => u.tag);
            return message.channel.send(tag);
          }
          default: { return; }
        }
      }
    } else {
      return;
    }
  },
};
