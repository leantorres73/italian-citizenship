var superagent = require('superagent');
var agent = superagent.agent();
const cheerio = require('cheerio');
const { sendMessage } = require('./telegram');

const detectPassport = async () => {
  await agent.post('https://prenotami.esteri.it/Home/Login')
    .type('form')
    .send({ Email: process.env.email, Password: process.env.password });
  
  const res = await agent.get('https://prenotami.esteri.it/Services/Booking/552');
  //use cheerio to use jquery to select DOM elements
  var $ = cheerio.load(res.text);

  //select DOM elements using jquery selectors
  $('#WlNotAvailable').filter(function(){
      var data = $(this);
      value = data.val();
      if (value != 'Al momento non ci sono date disponibili per il servizio richiesto') {
        // add telegram functionality
        await sendMessage('Ciudadania disponible');
      }
  });
}

detectPassport();