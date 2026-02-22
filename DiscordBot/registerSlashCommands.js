require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const token = process.env.DISCORD_TOKEN;
const clientId = Buffer.from(token.split('.')[0], 'base64').toString();

//Create array of commands from files
const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  
}

const rest = new REST({ version: '10' }).setToken(token);

//Register command list to Discord
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);
    if (process.env.DISCORD_DEV_GUILD) {
      try {
        rest.put(
          Routes.applicationGuildCommands(clientId, process.env.DISCORD_DEV_GUILD), // guild-specific
          { body: commands }
        );
      } catch (err) {
        console.log(err)
      }
    }

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    fs.writeFileSync(path.join(__dirname, "commandRegister.json"), JSON.stringify(commands.map(command => JSON.stringify(command)), null, 2));
	} catch (error) {
		console.error(error);
    //fs.writeFileSync(path.join(__dirname, "commandRegister.json"), JSON.stringify(commands.map(command => JSON.stringify(command)), null, 2));
	}
})();