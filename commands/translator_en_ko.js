const { ContextMenuCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('감지된 언어 - 한국어')
        .setType(3),
    async execute(interaction) {}
};