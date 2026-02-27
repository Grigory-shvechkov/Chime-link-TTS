
const { APIInteractionGuildMember, GuildMember } = require('discord.js')
const { createHash } = require('node:crypto');

module.exports = {
    hashCommands(commands) {
        return createHash('md5').update(JSON.stringify(commands)).digest('hex');
    }
}