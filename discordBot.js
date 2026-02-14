require('dotenv').config();  // load .env file
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const TOKEN = process.env.DISCORD_TOKEN;
const FLASK_SERVER = process.env.FLASK_SERVER_URL;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith("!ring")) {
        try {
            const response = await axios.post(`${FLASK_SERVER}/RING`);
            console.log(response.data);
        } catch (err) {
            console.error("Error calling ring endpoint:", err.message);
        }
    }

    if (message.content.startsWith("!say ")) {
        const text = message.content.slice(5);

        try {
            const response = await axios.post(`${FLASK_SERVER}/TTS`, { text });
            console.log(response.data);
        } catch (err) {
            console.error("Error calling TTS server:", err.message);
        }
    }
});

client.login(TOKEN);
