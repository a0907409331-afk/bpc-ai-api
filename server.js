const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
app.use(express.json());
app.use(cors());

// ===== 資料庫 =====
const db = new Database("db.sqlite");

// 建表
db.prepare(`
CREATE TABLE IF NOT EXISTS users (
  serial TEXT PRIMARY KEY,
  name TEXT
)
`).run();

// 預設帳號（避免空資料）
db.prepare(`
INSERT OR IGNORE INTO users (serial, name)
VALUES ('ABC123456789XYZ', 'VIP用戶')
`).run();

// ===== 登入驗證 =====
app.post("/validate", (req, res) => {
  const { serial } = req.body;

  if (!serial) {
    return res.json({ ok: false, msg: "請輸入序號" });
  }

  const user = db
    .prepare("SELECT * FROM users WHERE serial=?")
    .get(serial);

  if (!user) {
    return res.json({ ok: false, msg: "序號錯誤" });
  }

  return res.json({
    ok: true,
    token: Date.now(),
    user: user.name
  });
});

// ===== 預測功能（示範版） =====
app.post("/predict", (req, res) => {
  const result = Math.random() > 0.5 ? "莊" : "閒";

  res.json({
    ok: true,
    result
  });
});

// ===== 測試用首頁 =====
app.get("/", (req, res) => {
  res.send("AI Backend is running 🚀");
});

// ===== Railway 必備 PORT =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});