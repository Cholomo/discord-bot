// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
//require fs and path for command handling
const fs = require('node.fs');
const path = require('node:path')

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//commands
client.commands = new Collection();
//path for commands
const commandsPath = path.join(__dirname, 'commands');
//readdirSync returns an array of all files, we .filter through it to leave out non js files.
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('js'));


for (const file of commandFiles){
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  client.commands.set(command.data.name, command);
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Superintendent is online!');
});

//Set up to retreive and execute commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName):
  if(!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({content: 'There was an error while executing this command.', ephemeral: true});
  }

});


// Login to Discord with your client's token
client.login(token);
