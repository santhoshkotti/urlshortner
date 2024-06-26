// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const dns = require('dns');
// const mongoose = require('mongoose');
// const app = express();

// // Initialize Mongoose and connect to the MongoDB database
// mongoose.connect(process.env.DB_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log("Connected to the database");
// });

// // Define a schema and a model for the URL
// const urlSchema = new mongoose.Schema({
//   url: String,
//   short_url: Number
// });

// const Url = mongoose.model('Url', urlSchema);

// // Basic Configuration
// const port = process.env.PORT || 3000;

// app.use(cors());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());


// app.use('/public', express.static(`${process.cwd()}/public`));

// app.get('/', function(req, res) {
//   res.sendFile(process.cwd() + '/views/index.html');
// });

// // Your first API endpoint
// app.get('/api/hello', function(req, res) {
//   res.json({ greeting: 'hello API' });
// });

// app.post('/api/shorturl', function(req, res) {


//   let url = req.body.url;
//   console.log(url);
//   // Check if URL starts with http:// or https://
//   const urlPattern = /^https?:\/\//i;
//   if (!urlPattern.test(url)) {
//     return res.json({ error: 'invalid url' });
//   }
  
//   // Remove the protocol (http://, https://) from the URL to get the hostname
//   const hostname = url.replace(urlPattern, '').split('/')[0];

//   dns.lookup(hostname, async (err) => {
//     if (err) {
//       return res.json({ error: 'invalid url' });
//     } else {
//       try {
//         const urlCount = await Url.countDocuments({});
//         const urlDoc = new Url({
//           url: req.body.url,
//           short_url: urlCount
//         });

//         await urlDoc.save();
//         res.json({ original_url: url, short_url: urlCount });
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//       }
//     }
//   });
// });

// app.get('/api/shorturl/:short_url', async function(req, res) {

//   console.log("1234567891234567")
//   console.log(req.params.short_url);
//   console.log(typeof(req.params.short_url))
//   console.log("asdfghjasdfghjk")
//   const short_url = parseInt(req.params.short_url);

//   console.log(short_url);
  
//   if (isNaN(short_url)) {
//     return res.json({ error: 'Invalid short URL' });
//   }

//   try {
//     const urlDoc = await Url.findOne({ short_url });
//     if (urlDoc) {
//       return res.redirect(urlDoc.url);
//     } else {
//       return res.json({ error: 'No short URL found for the given input' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.listen(port, function() {
//   console.log(`Listening on port ${port}`);
// });


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const app = express();

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
  let url = req.body.url;
  
  console.log(url);
  
  // Check if URL starts with http:// or https://
  if (/^https?:\/\//i.test(url)) {
    // Valid URL: Remove the protocol (http://, https://) from the URL to get the hostname
    const hostname = url.replace(/^https?:\/\//, '').split('/')[0];
  
    const short_url = shortUrlCounter++;
        urlDatabase[short_url] = url;
        res.json({ original_url: url, short_url });

    // dns.lookup(hostname, (err) => {
    //   if (err) {
    //     return res.json({ error: 'invalid url in dns  ' });
    //   } else {
    //     const short_url = shortUrlCounter++;
    //     urlDatabase[short_url] = url;
    //     res.json({ original_url: url, short_url });
    //   }
    // });
  } else {
    // Invalid URL
    res.json({ error: 'invalid url' });
  }
});

// New route to handle the query parameter from the URL
app.get('/api/decode', function(req, res) {
  const queryParam = req.query.v;
  
  // Check if query parameter exists
  if (queryParam) {
    res.json({ decodedValue: queryParam });
  } else {
    res.json({ error: 'No query parameter provided' });
  }
});

app.get('/api/shorturl/:short_url', function(req, res) {
  const short_url = parseInt(req.params.short_url, 10);

  console.log(short_url);
  if (urlDatabase[short_url]) {
    return res.redirect(urlDatabase[short_url]);
  } else {
    return res.json({ error: 'No short URL found for the given input' });
  }
});

// Handle decoding query parameter directly at root path
app.get('/', function(req, res) {
  const queryParam = req.query.v;
  if (queryParam) {
    res.json({ decodedValue: queryParam });
  } else {
    res.sendFile(process.cwd() + '/views/index.html');
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
