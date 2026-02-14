const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

// Your bot token (from Discord Developer Portal)
const TOKEN = "YOUR_BOT_TOKEN_HERE";

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return; // ignore bot messages

    if (message.content.startsWith("!say ")) {
        const text = message.content.slice(5); // get text after !say
        
        try {
            // Send text to your Flask TTS server
            const response = await axios.post('http://<FLASK_SERVER_IP>:5000/speak', { text });
            console.log(response.data);
        } catch (err) {
            console.error("Error calling TTS server:", err.message);
        }
    }
});

// Login the bot
client.login(TOKEN);
