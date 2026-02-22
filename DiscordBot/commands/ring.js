const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');


module.exports = {
    data: new SlashCommandBuilder() //Create slash command
        .setName('ring')
        .setDescription('Ring the doorbell'),
    async execute(interaction) { 
        try {
            const response = await axios.post(`${interaction.client.flaskServer}/RING`);
            console.log(response.data);
            interaction.reply(`<@${interaction.user.id}> rang the doorbell!`)
        } catch (err) {
            console.error("Error calling ring endpoint:", err.message);
            interaction.reply("An error occurred!")
        }
    }
}