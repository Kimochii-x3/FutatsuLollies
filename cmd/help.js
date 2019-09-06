const Discord = require("discord.js");
const { prefix } = require("../botconf.json");

module.exports = {
  name: 'help',
  description: 'lists available commands',
  usage: 'fl.help',
  args: false,
  async execute(bot, message, args, option, commands) {
    const data = [];
    // const { cmd } = message.client;
    let botOwner = bot.users.get("254349985963835393");
    // data.push('Current commands:\n');
    data.push('Current commands:\n' + commands.map(command => "**"+command.name+"**"+" **->** "+command.description+" **usage:** "+command.usage).join('\n'));
    return message.channel.send(data+'\n'+'**Invite link:** https://discordapp.com/oauth2/authorize?client_id=615263043001122817&scope=bot&permissions=8\n**Bot maker: **'+botOwner.tag);






    // let clr = message.member.displayHexColor;
    // let help = new Discord.RichEmbed()
    // .setDescription(" ")
    // .setColor(clr)
    // .addField
    // ("God's commands:",
    //
    // )
    // .addField
    // ("Pleb's commmands:",
    //
    // )
    // .addField
    // ("Memeish/pointless commands:",
    // "**p.piano** - Contains Piano's copypasta about himself made by Unpaid.\n"+
    // "**p.biano** - Contains Piano's desires and achievements.\n"+
    // "**p.dr** - Provides the definition of a retard.\n"+
    // "**p.egirl** - Ever need one?\n"+
    // "\n"
    // )
    // return message.channel.send(help);
  },
};
