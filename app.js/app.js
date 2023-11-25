const express = require('express');
const multer = require('multer');
const fs = require('fs');
const Tesseract = require('tesseract.js');
const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static(__dirname + '/public'));

// Middleware for parsing URL-encoded and JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define multer storage for file uploads
const Storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, __dirname + '/images');
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

// Create a multer instance for handling file uploads
const upload = multer({
  storage: Storage,
}).single('image');

// Define routes
app.get('/', (req, res) => {
  res.render('pages/index');
});

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.send('Something went wrong');
    }

    const image = fs.readFileSync(__dirname + '/images/' + req.file.originalname, {
      encoding: null,
    });

    Tesseract.recognize(image)
      .progress(function (p) {
        console.log('progress', p);
      })
      .then(function (result) {
        res.send(result.html);
      });
  });
});

app.get('/ttslearning', (req, res) => {
  res.render('pages/ttslearning');
});

app.get('/Brailleedit', (req, res) => { 
  res.render('pages/Brailleedit'); 
});

app.get('/braille', (req, res) => { 
  res.render('pages/braille'); 
});

app.get('/optical', (req, res) => {
  res.render('pages/optical');
});

app.get('/lang', (req, res) => {
  res.render('pages/lang');
});

app.get('/showdata', (req, res) => {
  // Handle your 'showdata' route logic here
});

// Initiate the server on port 80
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});