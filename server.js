const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const DATA_FILE = path.join(__dirname, 'submissions.json');

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(UPLOAD_DIR));

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, UPLOAD_DIR); },
  filename: function (req, file, cb) {
    const t = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_\u00C0-\u024F ]/g, '_');
    cb(null, t + '-' + safeName);
  }
});
const upload = multer({ storage: storage, limits: { fileSize: 50 * 1024 * 1024 } }); // up to 50MB

app.post('/upload', upload.single('file'), (req, res) => {
  try {
    const name = req.body.name || 'Unknown';
    const note = req.body.note || '';
    const timestamp = req.body.timestamp || new Date().toISOString();
    const filename = req.file ? req.file.filename : null;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const entry = { name, note, timestamp, filename, ip };
    const arr = JSON.parse(fs.readFileSync(DATA_FILE));
    arr.push(entry);
    fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2));
    res.json({ status: 'OK', filename });
  } catch (err) {
    console.error(err);
    res.json({ status: 'ERROR', error: err.message });
  }
});

app.get('/submissions', (req, res) => {
  try {
    const arr = JSON.parse(fs.readFileSync(DATA_FILE));
    res.json(arr);
  } catch (err) { res.json([]); }
});

app.listen(PORT, () => console.log('Server listening on port', PORT));
