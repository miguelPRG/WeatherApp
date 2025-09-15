const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 8000;

app.use(cors());

// Compatibilidade para fetch em Node.js < 18

app.get('/weather', async (req, res) => {
  const apiKey = process.env.TOMORROW_API_KEY;
  const location = req.query.location;
  if (!location) {
    return res.status(400).json({ error: "Parâmetro 'location' é obrigatório." });
  }
  const url = `https://api.tomorrow.io/v4/weather/forecast?timesteps=1d&location=${location}&apikey=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    if (!response.ok) throw new Error(data.message || "Erro na resposta da API Tomorrow.io");
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
