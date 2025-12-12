const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();

// Tạo thư mục uploads nếu chưa có
if (!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads");
}

// Lưu file upload vào thư mục /uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// -------- ROUTES --------

// Trang học sinh
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Trang admin
app.get("/admin", (req, res) => {
    res.sendFile(__dirname + "/public/admin.html");
});

// API upload bài
app.post("/upload", upload.single("file"), (req, res) => {
    const name = req.body.name;
    const file = req.file;

    if (!name || !file) {
        return res.json({ success: false, message: "Thiếu tên hoặc file!" });
    }

    // Lưu bài nộp vào submissions.json
    let submissions = [];
    const dbFile = "submissions.json";

    if (fs.existsSync(dbFile)) {
        submissions = JSON.parse(fs.readFileSync(dbFile, "utf8"));
    }

    submissions.push({
        name: name,
        filename: file.filename,
        time: new Date().toLocaleString()
    });

    fs.writeFileSync(dbFile, JSON.stringify(submissions, null, 2));

    res.json({
        success: true,
        message: "Upload thành công!"
    });
});

// API lấy danh sách bài nộp
app.get("/submissions", (req, res) => {
    const dbFile = "submissions.json";
    if (!fs.existsSync(dbFile)) {
        return res.json([]);
    }
    const data = JSON.parse(fs.readFileSync(dbFile, "utf8"));
    res.json(data);
});

// ---- START SERVER ----
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log("Server đang chạy tại cổng " + PORT);
});

