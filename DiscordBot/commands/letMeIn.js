const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder() //Create slash command
        .setName('let-me-in')
        .setDescription('Make the doorbell ask if you can be let in') ,
    async execute(interaction) {
        const text = `${interaction.user.displayName} is at the door and needs to be let in.`
        try {
            const response = await axios.post(`${interaction.client.flaskServer}/TTS`, { text });
            console.log(response.data);
            interaction.reply(`<@${interaction.user.id}> needs to be let in!`);
        } catch (err) {
            console.error("Error calling TTS server:", err.message);
            interaction.reply("There was an error!");
        }
    }
}