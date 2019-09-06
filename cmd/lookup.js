const Discord = require("discord.js");

module.exports = {
  name: 'l',
  description: 'looks up a user\'s avatar by mentioning them or by their ID',
  usage: 'fl.l avatar/tag @<member>/<member ID>',
  args: true,
  async execute (bot, message, args, option) {
    let mAuthor = message.author.id
    let lookup = args[0];
    let id = args[1];
    let mentionedMember = message.mentions.members.first();
    if(mAuthor != 0)
    {
      if(mentionedMember)
      {
        switch (lookup)
        {
          case "avatar":
            let avatarurl = await bot.fetchUser(mentionedMember.id, true).then(u => u.avatarURL);
            return message.channel.send(avatarurl);
          case "tag":
            let tag = await bot.fetchUser(mentionedMember.id, true).then(u => u.tag);
            return message.channel.send(tag);
        }
      }
      else
      {
        switch (lookup)
        {
          case "avatar":
            let avatarurl = await bot.fetchUser(id, true).then(u => u.avatarURL);
            return message.channel.send(avatarurl);
          case "tag":
            let tag = await bot.fetchUser(id, true).then(u => u.tag);
            return message.channel.send(tag);
        }
      }
    }
    else
    {
      return
    }
  },
};
