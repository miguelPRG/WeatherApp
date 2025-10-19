const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const port = 8000;

const allowedOrigins = [
  "http://localhost:3000",
  "https://weather-app-ruddy-iota-13.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

// Limit per second
const perSecondLimiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 3,
  message: "Too many requests."
});

// Limit per hour
const perHourLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 25,
  message: "Too many requests."
});

// Limit per day
const perDayLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 1 day
  max: 500,
  message: "Too many requests."
});

// Applying rate limiters to the /weather endpoint
app.use('/weather', perSecondLimiter, perHourLimiter, perDayLimiter);

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

    if (!response.ok || data.code || data.error || data.message) {
      return res.status(404).json({ error: "Location not found or invalid." });
    }

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
