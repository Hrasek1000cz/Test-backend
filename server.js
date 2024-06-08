require('dotenv').config();

const axios = require('axios');
const fs = require('fs');
const express = require('express');
const app = express();

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;
const CACHE_FILE = 'cache.json';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minut v milisekundách

// Middleware pro CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:5000"); // Nastavte správnou adresu vaší webové stránky
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

async function fetchAndCacheData() {
  try {
    const response = await axios.get(API_URL, { params: { app_id: API_KEY } });
    const data = response.data;

    fs.writeFileSync(CACHE_FILE, JSON.stringify(data));

    console.log('Data updated:', data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

setInterval(fetchAndCacheData, CACHE_DURATION);
fetchAndCacheData();

app.get('/data', (req, res) => {
  fs.readFile(CACHE_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading cache file:', err);
      return res.status(500).send('Internal Server Error');
    }

    res.send(JSON.parse(data));
  });
});

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});