const Discord = require("discord.js");
const ms = require("ms");
const fs = require("fs");
const snekfetch = require("snekfetch");
const { prefix, token } = require("./botconf.json");
const bot = new Discord.Client();
let commands = new Discord.Collection();
let botOwner = bot.users.get("254349985963835393");
const cmdFiles = fs.readdirSync(__dirname+'/cmd').filter(file => file.endsWith('.js'));
for (const file of cmdFiles) {
  const cmd = require(__dirname+`/cmd/${file}`);
  commands.set(cmd.name, cmd);
  // console.log(cmd.execute);
}
fs.readdir(__dirname+'/events', (err, files) => {
  if(err) return console.log(err);
  files.forEach(file =>{
    if(!file.endsWith('.js')) return;
    const event = require(__dirname+`/events/${file}`);
    let eventName = file.split(".")[0];
    bot.on(eventName, event.bind(null, bot));
  })
  // console.log("All events loaded & all commands should be loaded");
});
bot.on("ready", function(){
  var tn = new Date();
  console.log(`${bot.user.username} is online.\n[`+tn.toString()+`]`);
  bot.user.setActivity("fl.help 4 cmds", {type: "PLAYING"});
  bot.channels.get("618929645173342210").send("Up and running\n"+tn.toString());
  let guildNames = [];
  let guildLookups = bot.guilds.map(g => `${g.name} \+ ${g.id}`);
  for (const g of guildLookups){
  guildNames.push(g);}
  // console.log(guildNames);
});
bot.on("error", console.error);

bot.on("message", async message =>
{
  if(message.author.bot) return;
  if(!message.content.startsWith(prefix)) return;
  if(message.channel.type === 'dm') return;
  let args = message.content.slice(prefix.length).split(/ +/);
  let cmdName = args.shift().toLowerCase();
  let option = message.content.slice(prefix.length+cmdName.length).split(/-+/);
  if(!commands.has(cmdName)) return;
  let cmd = commands.get(cmdName);
  try {
     if(cmd.args && !args.length){
       return message.channel.send('No args provided');
     }
     else {
       cmd.execute(bot, message, args, option, commands);
     }
  } catch (error) {
    console.error(error);
    message.reply("Issue occured while trying to execute the command.")
  }




});
bot.on("guildCreate", async guild => {});
bot.on("emojiCreate", async emoji => {});
bot.on("emojiUpdate", async (oldEmoji, newEmoji) => {});
bot.on("emojiDelete", async emoji => {});
bot.on("guildMemberRemove", async member => {});
bot.on("guildMemberUpdate", async (oldMember, newMember) => {});
bot.on("messageDelete", async message => {});
bot.on("voiceStateUpdate", async (oldMember, newMember) => {});
bot.on("channelCreate", async channel => {});
bot.on("channelDelete", async channel => {});
bot.on("channelUpdate", async (oldChannel, newChannel) => {});








bot.login(token);
