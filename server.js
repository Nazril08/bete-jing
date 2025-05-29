const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { Canvas, loadImage } = require('skia-canvas');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const upload = multer(); // untuk parsing form tanpa file upload

// Serve static files dan form HTML
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Tampilkan form input
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Endpoint untuk hasilkan meme
app.post('/generate', upload.none(), async (req, res) => {
  const userText = req.body.text;

  const TEMPLATE_PATH = path.join(__dirname, 'public', 'template.jpeg');

  try {
    const template = await loadImage(TEMPLATE_PATH);
    const canvas = new Canvas(template.width, template.height);
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

    const buffer = await canvas.toBuffer('jpeg');
    res.setHeader('Content-Type', 'image/jpeg');
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal membuat meme.');
  }
});

app.listen(port, () => {
  console.log(`🚀 Server jalan di http://localhost:${port}`);
});