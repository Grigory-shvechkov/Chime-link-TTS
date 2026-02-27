const { Events } = require('discord.js')


module.exports = {
    type: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Logged in as ${client.user.tag}`);
        client.user.setPresence({ //Set client status
            status: 'online'
        })
        client.user.setActivity({ //Set status message
            name: 'Ring Me!',
            type: 1
        })
    },
};