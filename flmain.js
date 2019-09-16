const Discord = require("discord.js");
const ms = require("ms");
const fs = require("fs");
const snekfetch = require("snekfetch");
const mysql = require("mysql");
const { token } = require("./botconf.json");
const bot = new Discord.Client();
let commands = new Discord.Collection();
let botOwner = bot.users.get("254349985963835393");
const cmdFiles = fs.readdirSync(__dirname+'/cmd').filter(file => file.endsWith('.js'));
for (const file of cmdFiles) {
  const cmd = require(__dirname+`/cmd/${file}`);
  commands.set(cmd.name, cmd);
}
fs.readdir(__dirname+'/events', (err, files) => {
  if(err) return console.log(err);
  files.forEach(file =>{
    if(!file.endsWith('.js')) return;
    const event = require(__dirname+`/events/${file}`);
    let eventName = file.split(".")[0];
    bot.on(eventName, event.bind(null, bot));
  })
});


db.connect(err =>{
  if(err) return console.log(err);
  console.log('DB connected');
});

bot.on("ready", function(){
  var tn = new Date();
  console.log(`${bot.user.username} is online.\n[`+tn.toString()+`]`);
  bot.user.setActivity(`fl.help / ${bot.guilds.size} servers`, {type: "WATCHING"});
  let mainBotChannel = bot.channels.get("618929645173342210");
  mainBotChannel.send("Up and running\n"+tn.toString());
  let guildNames = [];
  let guildLookups = bot.guilds.map(g => `${g.name} \+ ${g.id}`);
  for (const g of guildLookups){
  guildNames.push(g);
  }
  // setInterval(() => {
  //   snekfetch.post(`https://discordbots.org/api/bots/${bot.user.id}/stats`)
  //     .set('Authorization', 'DBLtoken')
  //     .send({ server_count: bot.guilds.size })
  //     .then(() => console.log('Updated discordbots.org stats.'))
  //     .catch(err => console.error(`Whoops something went wrong: ${err.body}`));
  // }, 3600000)
  // mainBotChannel.send(guildNames);
  // console.log(guildNames);
});

bot.on("error", console.error);

bot.on("message", async message =>
{
  db.query(`SELECT prefix FROM serverInfo WHERE serverID = ${message.guild.id}`, (err, rows) => {
    if (err) throw err;
    let prefix = rows[0].prefix;
    // console.log(prefix1);
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
         cmd.execute(bot, message, args, option, commands, prefix, db);
       }
    } catch (error) {
      console.error(error);
      message.reply("Issue occured while trying to execute the command.")
    }
  });




});
// bot.on("debug", m => console.log(m));
bot.on("guildCreate", async guild => {
  // console.log(guild);
  db.query(`SELECT * FROM serverInfo WHERE serverID = '${guild.id}'`, (err, rows) => {
    if (err) return console.log(err);
    let sql;
    // let serverIDexists = `SELECT EXISTS(SELECT * FROM serverInfo WHERE serverID=${guild.id})`;
    // console.log(serverIDexists);
    if(rows.length < 1){
      sql = `INSERT INTO serverInfo (serverID) VALUES ('${guild.id}')`
    }
    // if (sql = null) {return;}
    db.query(sql, console.log);
  });
});
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
