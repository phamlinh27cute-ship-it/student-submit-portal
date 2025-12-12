const express = require('express');
const multer  = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();

// Tạo thư mục uploads nếu chưa có
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Cấu hình Multer lưu file
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + file.originalname;
    cb(null, unique);
  }
});

const upload = multer({ storage });

// Cho phép đọc file tĩnh
app.use(express.static('public'));
app.use("/uploads", express.static("uploads"));
app.use(express.json());

// ========================
// ROUTE: Học sinh upload
// ========================
app.post('/upload', upload.single('file'), (req, res) => {

  if (!req.file) {
    return res.json({ status: "ERROR", message: "Không nhận được file" });
  }

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

  // Trả JSON để frontend không bị lỗi
  res.json({
    status: "OK",
    message: "Upload thành công",
    filename: req.file.filename,
    time: entry.time
  });
});

// ========================
// ROUTE: Admin lấy danh sách
// ========================
app.get("/list", (req, res) => {
  if (!fs.existsSync("submissions.json")) {
    return res.json([]);
  }

  const list = JSON.parse(fs.readFileSync("submissions.json"));
  res.json(list);
});

// ========================
// Khởi động server
// ========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server chạy cổng " + PORT));

