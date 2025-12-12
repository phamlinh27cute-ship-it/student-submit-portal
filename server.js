const express = require('express');
const multer  = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Tạo thư mục uploads nếu chưa có
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Cấu hình nơi lưu file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + file.originalname;
    cb(null, unique)
  }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// =======================
//    UPLOAD BÀI HỌC SINH
// =======================
app.post('/upload', upload.single('file'), (req, res) => {
  const entry = {
    filename: req.file.filename,
    time: Date.now()
  };

  let list = [];
  if (fs.existsSync("submissions.json")) {
    list = JSON.parse(fs.readFileSync("submissions.json"));
  }

  list.push(entry);
  fs.writeFileSync("submissions.json", JSON.stringify(list, null, 2));

  res.send('Upload thành công!');
});

// =======================
//      API CHO ADMIN
// =======================
app.get("/list", (req, res) => {
  if (!fs.existsSync("submissions.json")) {
    return res.json([]);
  }
  const list = JSON.parse(fs.readFileSync("submissions.json"));
  res.json(list);
});

// =======================
//        KHỞI ĐỘNG
// =======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server chạy cổng " + PORT));
