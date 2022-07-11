const { MessageEmbed } = require('discord.js');

module.exports = function mkEmbed(title, description, color) {
    try {
        if (title == 'not' && color == 'not') return new MessageEmbed().setDescription(description);
        else if (title == 'not' && color != 'not') return new MessageEmbed().setDescription(description).setColor(color);
        else if (title != 'not' && color == 'not') return new MessageEmbed().setTitle(title).setDescription(description);
        else if (title != 'not' && color != 'not' && description != 'not') return new MessageEmbed().setTitle(title).setDescription(description).setColor(color);
    } catch(e) {
        console.log(e);
    }
};
