const superagent = require('superagent');
const agent = superagent.agent();
const parser = require('node-html-parser');
const { sendMessage } = require('./telegram');

const minutes = process.env.MINUTES || 3; 
const interval = minutes * 60 * 1000;

const detectPassport = async () => {
  await agent.post('https://prenotami.esteri.it/Home/Login')
    .type('form')
    .send({ Email: process.env.email, Password: process.env.password });
  
  const res = await agent.get('https://prenotami.esteri.it/Services/Booking/552');
  //use cheerio to use jquery to select DOM elements
  const root = parser.parse(res.text);

  //select DOM elements using jquery selectors
  const selector = root.querySelector('#WlNotAvailable');
  if (!selector || !selector.attrs || selector.attrs.value != 'Al momento non ci sono date disponibili per il servizio richiesto') {
    await sendMessage('Ciudadania disponible');
  }
}

detectPassport();
setInterval(async () => {
  await detectPassport();
}, interval);