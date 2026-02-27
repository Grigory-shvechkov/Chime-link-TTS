require('dotenv').config();
const { REST, Routes } = require('discord.js');
const { writeFileSync, readdirSync, statSync, existsSync } = require('node:fs');
const { join } = require('node:path');
const { hashCommands } = require('./util.js')

//Create array of commands from files
module.exports = {
  async refreshSlashCommands() {
    const token = process.env.DISCORD_TOKEN;

    if (!token) {
      console.error("Discord token is not defined in env");
      process.exit(1)
    }

    const clientId = Buffer.from(token.split('.')[0], 'base64').toString();

    //Create array of commands from files
    const commands = []
    const addCommand = async (commandFilePath) => {
        const command = require(commandFilePath);
        commands.push(command.data.toJSON())
    }
    const commandFoldersPath = join(__dirname, "commands");
    if (!existsSync(commandFoldersPath)) return;
    const commandFolders = readdirSync(commandFoldersPath);
    for (const folder of commandFolders) {
        const commandsPath = join(commandFoldersPath, folder);
        if (statSync(commandsPath).isDirectory()) {
            const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const filePath = join(commandsPath, file);
                addCommand(filePath)
            }
        } else if (commandsPath.endsWith('.js')) {
            addCommand(commandsPath)
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
        writeFileSync(join(__dirname, "commandRegister"), hashCommands(commands));
      } catch (error) {
        console.error(error);
        //fs.writeFileSync(path.join(__dirname, "commandRegister.json"), JSON.stringify(commands.map(command => JSON.stringify(command)), null, 2));
      }
    })();
  }
}