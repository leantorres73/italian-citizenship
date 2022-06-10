const superagent = require('superagent');
const fs = require('fs');
const agent = superagent.agent();
const parser = require('node-html-parser');
const { sendMessage } = require('./telegram');

const path = '/Services/Booking/435';
const minutes = process.env.MINUTES || 3; 
const interval = minutes * 60 * 1000;

const detectPassport = async () => {
  let res = await query();
  if (res.redirects[0] == 'https://prenotami.esteri.it/Home?ReturnUrl=%2fServices%2fBooking%2f435') {
    await login();
    res = await query();
  }
  if (res.req.path == path) {
    const root = parser.parse(res.text);
    const selector = root.querySelector('#WlNotAvailable');
    if (!selector || !selector.attrs || selector.attrs.value != 'Al momento non ci sono date disponibili per il servizio richiesto') {
      await sendMessage('Ciudadania disponible');
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