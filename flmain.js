const Discord = require('discord.js'); // library used to write the bot code
const ms = require('ms'); // used for time
const fs = require('fs'); // used to read the command & event files
const snekfetch = require('snekfetch'); // using snekfetch to update bot stats on top.gg
const mysql = require('promise-mysql'); // using promise-mysql for database
const { token, pls_fuck, me_hard, daddy, hydrabolt, uwu } = require('./botconf.json'); // requiring bot token & database credentials
const bot = new Discord.Client({ messageCacheMaxSize: 400, messageCacheLifetime: 5400, messageSweepInterval: 900 }); // creating the bot with non-default message settings
const commands = new Discord.Collection(); // creating command collection
const cmdFiles = fs.readdirSync(__dirname + '/cmd').filter(file => file.endsWith('.js')); // reading command files
// setting the commands by name to the discord collection of commands above
for (const file of cmdFiles) {
	const cmd = require(__dirname + `/cmd/${file}`);
	commands.set(cmd.name, cmd);
}
// reading the event files and binding them
fs.readdir(__dirname + '/events', (err, files) => {
	if (err) return console.log(err);
	files.forEach(file => {
		if (!file.endsWith('.js')) return;
		const event = require(__dirname + `/events/${file}`);
		let eventName = file.split('.')[0];
		bot.on(eventName, event.bind(null, bot));
	});
});
// connecting to database, has to be this way because of promise-mysql
(async () => {
  bot.owner = await bot.users.get('254349985963835393');
  console.log(bot.owner);
  bot.db = await mysql.createConnection({
    host: pls_fuck,
    user: me_hard,
    password: daddy,
    port: hydrabolt,
    database: uwu,
  });
  console.log('DB Conected');
})();
// once the bot's ready this code will be executed
bot.on('ready', async () => {
  // creates new date, logs it into the console
	const tn = new Date();
	console.log(`${bot.user.username} is online.\n${tn.getDate()}/${tn.getMonth() + 1}/${tn.getFullYear()} --- ${tn.getHours()}:${tn.getMinutes()}:${tn.getSeconds()}`);
  // fetches the MOTD from the database and sets it as the bot's status
	const status = await bot.db.query('SELECT * FROM botStats').catch(console.error);
	if (status[0].motd.length > 1) {
		await bot.user.setActivity(`${bot.guilds.size} servers // fl.help / MOTD: ${status[0].motd}`, { type: 'WATCHING' }).catch(console.error);
  }
  // maps the guild by their ID, then checks if they exist in the database
  const gIDs = bot.guilds.map(g => g.id);
  for (const g of gIDs) {
    const gInDB = await bot.db.query(`SELECT * FROM serverInfo WHERE serverID = ${g}`).catch(console.error);
    if (gInDB[0].serverID.length < 1) {
       await bot.db.query(`INSERT INTO serverInfo (serverID) VALUES ('${g}')`);
       console.log(`Added ${g} to database as it was not in it`);
    }
  }
  ///CODE FOR CHECK MUTEROLE THEN CHECK CHANNEL AND FIX PERMS///
  /* for (const [id, guild] of bot.guilds) {
    const row = await bot.db.query(`SELECT * FROM serverInfo WHERE serverID = ${guild.id}`);
    if (row[0].muteRoleID !== null) {
      const mtr = guild.roles.find(r => r.id === row[0].muteRoleID);
      if (guild.me.permissions.has(['MANAGE_ROLES', 'VIEW_AUDIT_LOG'], true)) {
        for (const [id2, channel] of guild.channels) {
          if (channel.type === 'category') {
            const prmToCheck = ['SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'ADD_REACTIONS', 'EMBED_LINKS', 'ATTACH_FILES', 'SPEAK', 'USE_VAD'];
            for (const prm of prmToCheck) {
              let prmSingle = Discord.Permissions.FLAGS[prm];
              if (!(channel.permissionOverwrites.get(mtr.id).deny & prmSingle)) {
                await channel.overwritePermissions(mtr, { [prm]: false }, `Updating perms for ${channel.type} named ${channel.name}`).catch(console.error);
                console.log(`Updated perm: ${prm} for mute role: ${mtr.name} in channel: ${channel.name} of type: ${channel.type} for server: ${channel.guild.name}`);
              } else if (channel.permissionOverwrites.get(mtr.id).deny & prmSingle) {
                  console.log(`Channel ${channel.name} already has ${prm} denied for role ${mtr.id}`);
              }
            }
          } else if (channel.type === 'voice') {
            const nullPrm = ['SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'ADD_REACTIONS', 'EMBED_LINKS', 'ATTACH_FILES'];
            const denyPrm = ['SPEAK', 'USE_VAD'];
            for (const prm of nullPrm) {
              let prmSingle1 = Discord.Permissions.FLAGS[prm];
              if ((channel.permissionOverwrites.get(mtr.id).deny & prmSingle1) || (channel.permissionOverwrites.get(mtr.id).allow & prmSingle1)) {
                await channel.overwritePermissions(mtr, { [prm]: null }, `Updating perms for ${channel.type} named ${channel.name}`).catch(console.error);
                console.log(`Updated perm: ${prm} for mute role: ${mtr.name} in channel: ${channel.name} of type: ${channel.type} for server:  ${channel.guild.name}`);
              } else if (!(channel.permissionOverwrites.get(mtr.id).deny & prmSingle1) && !(channel.permissionOverwrites.get(mtr.id).allow & prmSingle1)) {
                  console.log(`Channel ${channel.name} already has ${prm} nullified for role ${mtr.id}`);
              }
            }
            for (const prm of denyPrm) {
              let prmSingle2 = Discord.Permissions.FLAGS[prm];
              if (!(channel.permissionOverwrites.get(mtr.id).deny & prmSingle2)) {
                await channel.overwritePermissions(mtr, { [prm]: false }, `Updating perms for ${channel.type} named ${channel.name}`).catch(console.error);
                console.log(`Updated perm: ${prm} for mute role: ${mtr.name} in channel: ${channel.name} of type: ${channel.type} for server:  ${channel.guild.name}`);
              } else if ((channel.permissionOverwrites.get(mtr.id).deny & prmSingle2)) {
                  console.log(`Channel ${channel.name} already has ${prm} denied for role ${mtr.id}`);
              }
            }
          } else if (channel.type === 'text') {
            const nullPrm = ['SPEAK', 'USE_VAD'];
            const denyPrm = ['SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'ADD_REACTIONS', 'EMBED_LINKS', 'ATTACH_FILES'];
            for (const prm of nullPrm) {
              let prmSingle3 = Discord.Permissions.FLAGS[prm];
              if ((channel.permissionOverwrites.get(mtr.id).deny & prmSingle3) || (channel.permissionOverwrites.get(mtr.id).allow & prmSingle3)) {
                await channel.overwritePermissions(mtr, { [prm]: null }, `Updating perms for ${channel.type} named ${channel.name}`).catch(console.error);
                console.log(`Updated perm: ${prm} for mute role: ${mtr.name} in channel: ${channel.name} of type: ${channel.type} for server:  ${channel.guild.name}`);
              } else if (!(channel.permissionOverwrites.get(mtr.id).deny & prmSingle3) && !(channel.permissionOverwrites.get(mtr.id).allow & prmSingle3)) {
                  console.log(`Channel ${channel.name} already has ${prm} nullified for role ${mtr.id}`);
              }
            }
            for (const prm of denyPrm) {
              let prmSingle4 = Discord.Permissions.FLAGS[prm];
              if (!(channel.permissionOverwrites.get(mtr.id).deny & prmSingle4)) {
                await channel.overwritePermissions(mtr, { [prm]: false }, `Updating perms for ${channel.type} named ${channel.name}`).catch(console.error);
                console.log(`Updated perm: ${prm} for mute role: ${mtr.name} in channel: ${channel.name} of type: ${channel.type} for server:  ${channel.guild.name}`);
              } else if (channel.permissionOverwrites.get(mtr.id).deny & prmSingle4) {
                  console.log(`Channel ${channel.name} already has ${prm} denied for role ${mtr.id}`);
              }
            }
          }
        }
      }
    }
  } */
  // gets the support server's event logging channel and logs that its online
  const mainBotChannel = bot.channels.get('622467121175199745');
  const botRunning = new Discord.RichEmbed()
  .setTitle(`${tn.getDate()}/${tn.getMonth() + 1}/${tn.getFullYear()} --- ${tn.getHours()}:${tn.getMinutes()}:${tn.getSeconds()}`)
  .setColor('#63ff48')
  .setDescription('Started and running');
  mainBotChannel.send(botRunning);
});
// logs errors, used for debugging
bot.on('error', console.error);
// executes on messages
bot.on('message', async message => {
  // checks if the message includes 'prefix?', then checks if the bot is the first mentioned member in the server and it returns the bot's prefix for the server the message is sent in
  if (message.content.toLowerCase().includes('prefix?')) {
    const botmen = message.mentions.members.first();
    if (botmen && botmen.user.id === '615263043001122817') {
      const rows = await bot.db.query(`SELECT * FROM serverInfo WHERE serverID = ${message.guild.id}`).catch(console.error);
      return message.channel.send(`my prefix for this server is: \`${rows[0].prefix}\``);
    } // checks if message was sent in DM's or the author of the message is a bot
  } else if (message.author.bot || message.channel.type === 'dm') return;
  else {
    // gets the prefix from the database for the server, gets the args and options after which checks if the message starts with command name (and if args are required or not) and executes it, on error logs the error in console and it replies that an erro has occured
    const rows = await bot.db.query(`SELECT * FROM serverInfo WHERE serverID = ${message.guild.id}`).catch(console.error);
    const prefix = rows[0].prefix;
    if (!message.content.toLowerCase().startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const cmdName = args.shift().toLowerCase();
    const option = message.content.slice(prefix.length + cmdName.length).split(/-+/);
    if (!commands.has(cmdName)) return;
    const cmd = commands.get(cmdName);
    try {
       if (cmd.args && !args.length) {
         message.channel.send('No args provided');
       } else {
         cmd.execute(bot, message, args, option, commands, prefix);
       }
    } catch (error) {
      console.error(error);
      message.reply('Issue occured while trying to execute the command.');
    }
  }
});
// debugging information
bot.on('debug', m => {
  if (m.includes('Heartbeat') || m.includes('heartbeat')) { return; } else if (!(m.includes('Heartbeat') || m.includes('heartbeat'))) { return console.log(m); }
});
// when the bot joins a guild for the first time it adds it to the database, if it doesnt it'll crash when it tries to fetch information
bot.on('guildCreate', async guild => {
  const rows = await bot.db.query(`SELECT * FROM serverInfo WHERE serverID = '${guild.id}'`).catch(console.error);
  if (rows[0].serverID.length < 1) {
     await bot.db.query(`INSERT INTO serverInfo (serverID) VALUES ('${guild.id}')`);
     console.log(`Added ${guild.id} to database as it was not in it`);
  }
});
// other events which are extended in the event listeners
bot.on('emojiCreate', async emoji => {});
bot.on('emojiUpdate', async (oldEmoji, newEmoji) => {});
bot.on('emojiDelete', async emoji => {});
bot.on('guildMemberRemove', async member => {});
bot.on('guildMemberUpdate', async (oldMember, newMember) => {});
bot.on('messageDelete', async message => {});
bot.on('voiceStateUpdate', async (oldMember, newMember) => {});
bot.on('channelCreate', async channel => {});
bot.on('channelDelete', async channel => {});
bot.on('channelUpdate', async (oldChannel, newChannel) => {});
// login for the bot with the token
bot.login(token);
