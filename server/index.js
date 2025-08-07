const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Create or open SQLite database file
const dbPath = path.resolve(__dirname, "auth_db.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) return console.error(err.message);
  console.log("SQLite3 Connected...");
});

// ✅ Create table if not exists
db.run(
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    email TEXT UNIQUE,
    password TEXT
  )`
);

// ✅ Root route to check if backend is working
app.get("/", (req, res) => {
  res.send("✅ Backend is LIVE & working!");
});

// ✅ Signup route
app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;
  const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
  db.run(sql, [username, email, password], function (err) {
    if (err) return res.json({ success: false, error: err.message });
    res.json({ success: true, message: "User registered successfully" });
  });
});

// ✅ Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.get(sql, [email, password], (err, row) => {
    if (err) return res.json({ success: false, error: err.message });
    if (row) {
      res.json({ success: true, message: "Login successful" });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  });
});

// ✅ Final: PORT must be from Railway OR fallback to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
