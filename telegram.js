const TelegramBot = require('node-telegram-bot-api');
var token = process.env.TELEGRAM_TOKEN;
const receiver = process.env.TELEGRAM_CHANNEL;

var bot = new TelegramBot(token);

const sendMessage = async (message) => {
  await bot.sendMessage(receiver, message);
}

module.exports = {
  sendMessage
}