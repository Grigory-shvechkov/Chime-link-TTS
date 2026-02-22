const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder() //Create slash command
        .setName('say')
        .setDescription('Make the doorbell speak a message') 
        .addStringOption(option =>  //Create command parameter
            option.setName("message")
                .setRequired(true)
                .setDescription("The message to send")
        ),
    async execute(interaction) {
        const text = interaction.options.getString("message", true) //Get command parameter value
        try {
            const response = await axios.post(`${interaction.client.flaskServer}/TTS`, { text });
            console.log(response.data);
            interaction.reply(`<@${interaction.user.id}> says \`${text}\``);
        } catch (err) {
            console.error("Error calling TTS server:", err.message);
            interaction.reply("There was an error!");
        }
    }
}