const { SlashCommandBuilder } = require('@discordjs/builders');
const mkEmbed = require('../module/mkEmbed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('도움말')
        .setDescription('번역봇 사용시 필요한 주의사항 등을 제공합니다.'),
    async execute(interaction) {
        await interaction.reply({ embeds: [mkEmbed('----도움말----', '1. 주의사항\n - 감지된 언어와 번역할려는 언어가 같으면 번역하지 않습니다.\n - 이모티콘, 이모지, gif 등 번역 할 수 없는 메시지들은 번역하지 않습니다.', 'not')] });
    }
};