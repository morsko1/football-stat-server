const TelegramBot = require('node-telegram-bot-api');

const botData = require('./botData');
const {token, myTelegramId} = botData;

const updateDB = require('../util/updateDB.js');

const bot = new TelegramBot(token, {
    polling: true
});

bot.onText(/\/start/i, (msg, match) => {
    if (msg.chat.id !== myTelegramId) {
        return;
    }
    const opts = {
        reply_markup: JSON.stringify({
            keyboard: [
                ['update']
            ],
            resize_keyboard: true
        })
    };
    bot.sendMessage(
        msg.chat.id,
        'Привет! Этот бот обновляет БД Football Stat',
        opts
    );
});

bot.onText(/update/i, (msg, match) => {
    console.log('id: ', msg.chat.id);
    const chatId = msg.chat.id;
    if (msg.chat.id !== myTelegramId) {
        return;
    }
    updateDB().then((data) => {
        bot.sendMessage(chatId, 'DB updated!');
    });
});
