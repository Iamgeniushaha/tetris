const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

// 정적 파일 미들웨어 (CSS, JS 등 접근 가능)
app.use(express.static(path.join(__dirname, "public")));

// index.html 경로
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// next.html 경로
app.get("/next", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "next.html"));
});

app.listen(PORT, () => {
    console.log(`서버 실행 중 👉 http://localhost:${PORT}`);
});
