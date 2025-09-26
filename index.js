const superagent = require('superagent');
const agent = superagent.agent();
const parser = require('node-html-parser');
const { sendMessage } = require('./telegram');

const path = '/Services/Booking/4685';
const minutes = process.env.MINUTES || 3; 
const interval = minutes * 60 * 1000;

const detectPassport = async () => {
  let res = await query();
  if (res.redirects[0] == 'https://prenotami.esteri.it/Home?ReturnUrl=%2fServices%2fBooking%2f4685') {
    await login();
    res = await query();
  }
  if (res.req.path == path) {
    const root = parser.parse(res.text);
    const selector = root.querySelector('#WlNotAvailable');
    if (!selector || !selector.attrs || selector.attrs.value != `Stante l'elevata richiesta i posti disponibili per il servizio scelto sono esauriti.`) {
      await sendMessage('Pasaporte disponible');
    }
  }
}

const query = async () => {
  return await agent.get('https://prenotami.esteri.it' + path);  
}

const login = async () => {
  await agent.post('https://prenotami.esteri.it/Home/Login')
    .type('form')
    .send({ Email: process.env.email, Password: process.env.password });
}

detectPassport();
setInterval(async () => {
  await detectPassport();
}, interval);