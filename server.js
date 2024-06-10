require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const express = require('express');
const app = express();
const apiUrl = process.env.apiUrl;
const apiKey = process.env.apiKey;
const adresa = 'localhost'; //Toto je jen pro testování, potom se tam zadá adresa 
const adresaPort = 5010; //Lze změnit, nebo i odstranit
const adresaEnding = '/savedData'; //Lze také upravit
const cacheFile = 'cache.json';
const restartTime = 3600000; 
async function fetchAndWriteData() {
  try {
    const response = await axios.get(apiUrl, { params: { app_id: apiKey} });
    let data = response.data;
    delete data["disclaimer"];delete data["license"];delete data["timestamp"];
    fs.writeFileSync(cacheFile, JSON.stringify(data));
    console.log('Úspešně se podařilo načíst');
  } catch (error) {
    console.error('Nezdařilo se, chyba --->:', error);
  }
}
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); 
  next();
});
setInterval(fetchAndWriteData, restartTime);
fetchAndWriteData();
app.get(adresaEnding, (req, res) => {
  fs.readFile(cacheFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Chyba', err);
      return res.status(500).send('Chyba serveru');
    }
    res.send(JSON.parse(data));
  });
});
app.listen(adresaPort, adresa,() => {
  console.log(`Server nalezneš na http://${adresa}:${adresaPort}${adresaEnding}`);
});