const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

console.log('Starting server setup...');

const app = express();
const port = process.env.PORT || 3000;

const upload = multer(); // untuk parsing form tanpa file upload

// Serve static files dan form HTML
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

console.log('Middleware setup complete');

// Tampilkan form input
app.get('/', (req, res) => {
  console.log('Received request for homepage');
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Endpoint untuk hasilkan meme
app.post('/generate', upload.none(), async (req, res) => {
  console.log('Received generate request with text:', req.body.text);
  const userText = req.body.text;

  const TEMPLATE_PATH = path.join(__dirname, 'public', 'template.jpeg');
  console.log('Template path:', TEMPLATE_PATH);

  try {
    const template = await loadImage(TEMPLATE_PATH);
    const canvas = createCanvas(template.width, template.height);
    const ctx = canvas.getContext('2d');

    // Konfigurasi posisi teks
    const textX = 369;
    const textY = 60;
    const textMaxWidth = 250;

    ctx.drawImage(template, 0, 0);

    ctx.font = 'bold 54px Arial';
    ctx.textAlign = 'center';

    ctx.lineWidth = 4;
    ctx.strokeStyle = 'white';
    ctx.strokeText(userText, textX, textY, textMaxWidth);

    ctx.fillStyle = 'black';
    ctx.fillText(userText, textX, textY, textMaxWidth);

    res.setHeader('Content-Type', 'image/jpeg');
    canvas.createJPEGStream().pipe(res);
    console.log('Meme generated successfully');
  } catch (err) {
    console.error('Error generating meme:', err);
    res.status(500).send('Gagal membuat meme.');
  }
});

try {
  app.listen(port, () => {
    console.log(`🚀 Server jalan di http://localhost:${port}`);
  });
  console.log('Server started successfully');
} catch (error) {
  console.error('Failed to start server:', error);
}