const express = require('express');
const multer = require('multer');
const fs = require('fs');
const Jimp = require('jimp');
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
    // Load template image
    const image = await Jimp.read(TEMPLATE_PATH);
    
    // Load font
    const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
    
    // Konfigurasi posisi teks
    const textX = 310; // Posisi X lebih ke kanan (sesuaikan sesuai kebutuhan)
    const textY = 4;  // Posisi Y (sesuaikan sesuai kebutuhan)
    const textMaxWidth = 300;
    
    // Gunakan format print yang lebih sederhana
    image.print(
      font,
      textX,
      textY,
      userText
    );
    
    // Convert to buffer
    const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);
    
    // Send response
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