const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files dan form HTML
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Tampilkan form input
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Terjadi kesalahan pada server: ' + err.message);
});

app.listen(port, () => {
  console.log(`🚀 Server jalan di http://localhost:${port}`);
});