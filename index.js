const fs = require('node:fs');
const path = require('node:path');
const { Client, Intents, Collection, MessageEmbed, Message } = require('discord.js');
const { token } = require('./config.json');
const request = require('request');
const mkEmbed = require('./module/mkEmbed');

const headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'X-Naver-Client-Id': 'client-id',
    'X-Naver-Client-Secret': 'client-secret',
};

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    console.log(`로그인 > ${client.user.id}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (e) {
        console.error(e);
        await interaction.reply({ content: 'Error', ephemeral: true });
    }
});

client.on('interactionCreate', async interaction => {
    if (interaction.isContextMenu()) {
        const message = interaction.commandName;

        if (message === '감지된 언어 - 영어') {
            const data_for_detectLang = `query=${interaction.targetMessage.content}`;
            const detect_en_options = {
                url: 'https://openapi.naver.com/v1/papago/detectLangs',
                method: 'POST',
                headers: headers,
                body: data_for_detectLang,
            };

            function callback(error, response, body) {
                if (JSON.parse(body).langCode == 'unk') {
                    return interaction.reply({ embeds: [mkEmbed('not', '언어를 감지할 수 없습니다.', 'not')], ephemeral: true });
                }
                if (JSON.parse(body).langCode == 'en') {
                    return interaction.reply({ embeds: [mkEmbed('not', 'source 언어와 target 언어가 같습니다.', 'not')], ephemeral: true });
                }

                if (!error && response.statusCode == 200) {
                    console.log(JSON.parse(body).langCode);
                    const data_for_n2mt = `source=${JSON.parse(body).langCode}&target=en&text=${interaction.targetMessage.content}`;
                    const detect_en_option = {
                        url: 'https://openapi.naver.com/v1/papago/n2mt',
                        method: 'POST',
                        headers: headers,
                        body: data_for_n2mt,
                    };

                    function call(error, response, bodyCall) {
                        if (!error && response.statusCode == 200) {
                            const embed = mkEmbed('not', `감지된 언어: ${JSON.parse(body).langCode}\n원본 메시지: ${interaction.targetMessage.content}\n번역된 메시지: ${JSON.parse(bodyCall).message.result.translatedText}`, 'not');

                            return interaction.reply({ embeds: [embed] });
                        }
                    }
                    request(detect_en_option, call);
                }
            }

            request(detect_en_options, callback);
        }
        if (message === '감지된 언어 - 한국어') {
            const data_for_detectLang = `query=${interaction.targetMessage.content}`;
            const detect_ko_options = {
                url: 'https://openapi.naver.com/v1/papago/detectLangs',
                method: 'POST',
                headers: headers,
                body: data_for_detectLang,
            };

            function callback(error, response, body) {
                if (JSON.parse(body).langCode == 'unk') {
                    return interaction.reply({ embeds: [mkEmbed('not', '언어를 감지할 수 없습니다.', 'not')], ephemeral: true });
                }
                if (JSON.parse(body).langCode == 'ko') {
                    return interaction.reply({ embeds: [mkEmbed('not', 'source 언어와 target 언어가 같습니다.', 'not')], ephemeral: true });
                }

                if (!error && response.statusCode == 200) {
                    console.log(JSON.parse(body).langCode);
                    const data_for_n2mt = `source=${JSON.parse(body).langCode}&target=ko&text=${interaction.targetMessage.content}`;
                    const detect_ko_option = {
                        url: 'https://openapi.naver.com/v1/papago/n2mt',
                        method: 'POST',
                        headers: headers,
                        body: data_for_n2mt,
                    };

                    function call(error, response, bodyCall) {
                        if (!error && response.statusCode == 200) {
                            const embed = mkEmbed('not', `감지된 언어: ${JSON.parse(body).langCode}\n원본 메시지: ${interaction.targetMessage.content}\n번역된 메시지: ${JSON.parse(bodyCall).message.result.translatedText}`, 'not');

                            return interaction.reply({ embeds: [embed] });
                        }
                    }
                    request(detect_ko_option, call);
                }
            }
            request(detect_ko_options, callback);
        }
    }
});

client.login(token);
