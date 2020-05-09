const Discord = require('discord.js');

module.exports = {
  name: 'help',
  description: 'lists available commands and usages or description',
  usage: 'fl.help / fl.help cmds / fl.help desc / fl.help info',
  args: false,
  async execute(bot, message, args, option, commands, prefix) {
    const dataName = [];
    const dataUsage = [];
    const dataDesc = [];
    // const { cmd } = message.client;
    const botOwner = bot.users.get('254349985963835393');
    // data.push('Current commands:\n');
    dataName.push(commands.map(command => `\`${command.name}\` >> ${command.usage}`).join('\n'));
    // dataUsage.push(commands.map(command => `${command.usage}`).join('\n'));
    dataDesc.push(commands.map(command => `\`${command.name}\` >> ${command.description}`).join('\n'));
    // const subOption = option.shift();
    // let embed = new Discord.RichEmbed()
    // .setColor('GREY')
    // .addField('Commands', dataName)
    // .addField('Usages', dataUsage)
    // .addField('Descriptions', dataDesc)
    // .addField('Bot info', `[Invite link](https://discordapp.com/oauth2/authorize?client_id=615263043001122817&scope=bot&permissions=1342205136)\n Owner: `+botOwner.tag)
    // console.log(args);
    if (args[0] === 'cmds') {
      const embed = new Discord.RichEmbed()
      .setColor('GREY')
      .setAuthor('Commands & Usages:')
      .setDescription(dataName);

      return message.channel.send(embed);
    } else if (args[0] === 'desc') {
      const embed = new Discord.RichEmbed()
      .setColor('GREY')
      .setAuthor('Descriptions:')
      .setDescription(dataDesc);

      return message.channel.send(embed);
    } else if (args[0] === 'info') {
      const embed = new Discord.RichEmbed()
      .setColor('GREY')
      .setAuthor('Bot info')
      .setDescription(`For now I'm back working on the bot 01/05/2020, should have some changes by the end of the month\nDev: ${botOwner.tag}\n[Invite link](https://discordapp.com/oauth2/authorize?client_id=615263043001122817&scope=bot&permissions=1342205136)\n[Support server link](https://discord.gg/AThmedm)\n[Github Repository](https://github.com/Kimochii-x3/FutatsuLollies)`);

      return message.channel.send(embed);
    } else if (!args[0]) {
      const embed = new Discord.RichEmbed()
      .setColor('GREY')
      .setAuthor('Hello, there are 3 options for the help command:')
      .setDescription('1. **`cmds`** which provides the commands list and full usages\n2. **`desc`** which provides description for each command explaining what it does\n3. **`info`** which provides information about the bot');

      return message.channel.send(embed);
    }
  },
};
