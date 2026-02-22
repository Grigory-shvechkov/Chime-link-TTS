require('dotenv').config();  // load .env file
const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")
const { Client, Collection } = require('discord.js');
//const axios = require('axios');

const TOKEN = process.env.DISCORD_TOKEN;
const FLASK_SERVER = process.env.FLASK_SERVER_URL;

//Init client
const client = new Client({ intents: []});
client.flaskServer = FLASK_SERVER; //Store flask server url to client (secure)

//Create map of commands from files and store to client
client.commands= new Collection()
const commands = []
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON())
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  
}

//Register event files with client
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

//Make sure loaded commands matches commands registered with Discord
const cmdRegister = (fs.existsSync(path.join(__dirname, "commandRegister.json"))) ? JSON.parse(fs.readFileSync(path.join(__dirname, "commandRegister.json"))) : []
if (!setEqual(new Set(commands.map(command => JSON.stringify(command))), new Set(cmdRegister))) {
    console.log("Registering commands with Discord...")
    execSync("node " + path.join(__dirname, "registerSlashCommands.js"))
}

client.login(TOKEN);

function setEqual(a, b) {
    if (a.size !== b.size) { 
        // console.log(a.size, b.size)
        return false
    }
    for (const element of a) {
        if (!b.has(element)) {
            // console.log(element)
            // console.log(a)
            // console.log(b)
            return false
        }
    }
    return true
}