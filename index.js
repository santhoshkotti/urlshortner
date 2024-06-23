require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const shortUrl = require("node-url-shortener");
const validateUrl = require('is-url');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let urlDatabase = {};
let shortUrlCounter = 1;

app.post('/api/shorturl', function(req, res) {
  const url = req.body.url;

  if (!validateUrl(url)) {
    return res.json({ error: 'invalid url' });
  }

  const short_url = shortUrlCounter++;
  urlDatabase[short_url] = url;

  res.json({ original_url: url, short_url });
});

app.get('/api/shorturl/:short_url', function(req, res) {
  const short_url = parseInt(req.params.short_url);

  if (urlDatabase[short_url]) {
    return res.redirect(urlDatabase[short_url]);
  } else {
    return res.json({ error: 'No short URL found for the given input' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
