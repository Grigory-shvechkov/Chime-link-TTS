require('dotenv').config();  // load .env file
const { readFileSync, statSync, readdirSync, existsSync } = require("fs")
const { join } = require("path")
const { Client, Collection, InteractionType } = require('discord.js');
const { refreshSlashCommands } = require('./registerSlashCommands.js');
const { hashCommands } = require('./util.js');
//const axios = require('axios');

const TOKEN = process.env.DISCORD_TOKEN;
const FLASK_SERVER = process.env.FLASK_SERVER_URL;

//Init client
const client = new Client({ intents: []});
client.flaskServer = FLASK_SERVER; //Store flask server url to client (secure)

//Create map of commands from files and store to client
client.commands = new Collection()
const commands = []
const addCommand = async (commandFilePath) => {
    const command = require(commandFilePath);
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON())
}
const commandFoldersPath = join(__dirname, "commands");
if (existsSync(commandFoldersPath)) {
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
}
//Register event files with client
const eventFoldersPath = join(__dirname, 'events');
if (existsSync(eventFoldersPath)) {
    const eventFolders = readdirSync(eventFoldersPath)
    const addEvent = async (eventFilePath) => {
        const event = require(eventFilePath);
        if (event.once) {
            client.once(event.type, (...args) => event.execute(...args));
        } else {
            client.on(event.type, (...args) => event.execute(...args));
        }
    }
    for (const folder of eventFolders) {
        const eventsPath = join(eventFoldersPath, folder)
        if (statSync(eventsPath).isDirectory()) {
            const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js'))
            for (const file of eventFiles) {
                const filePath = join(eventsPath, file);
                addEvent(filePath)
            }
        } else if (eventsPath.endsWith('.js')) {
            addEvent(eventsPath)
        } else {
            console.log(`invalid event file ${eventsPath}`)
        }
    }
}

//Register non-command interactions (button pressed, modal submitted, etc.)
client.interactions = new Collection([
    [InteractionType.MessageComponent, new Collection()],
    [InteractionType.ModalSubmit, new Collection()]
]);
const intFoldersPath = join(__dirname, 'interactions');
if (existsSync(intFoldersPath)) {
    const intFolders = readdirSync(intFoldersPath)
    const addInt = async (intFilePath) => {
        const interaction = require(intFilePath);
        client.interactions.get(interaction.data.type)?.set(interaction.data.name, interaction)
    }
    for (const folder of intFolders) {
        const intsPath = join(intFoldersPath, folder)
        if (statSync(intsPath).isDirectory()) {
            const intFiles = readdirSync(intsPath).filter(file => file.endsWith('.js'))
            for (const file of intFiles) {
                const filePath = join(intsPath, file);
                addInt(filePath)
            }
        } else if (intsPath.endsWith('.js')) {
            addInt(intsPath)
        }
    }
}


//Make sure loaded commands matches commands registered with Discord
const savedHash = existsSync(join(__dirname, "commandRegister")) ? readFileSync(join(__dirname, "commandRegister"), "utf-8").trim() : "";
const currentHash = hashCommands(commands);
if (savedHash !== currentHash) {
    console.log("Registering commands with Discord...");
    refreshSlashCommands();
}

client.login(TOKEN);
console.log("Client logging in...")