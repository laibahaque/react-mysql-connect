 const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",        // ← agar tumhara password hai to yahan likho
  database: "auth_db", // ← pehle MySQL me yeh DB banana hoga
});

// ✅ Connect DB
db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

// ✅ Signup route
app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;
  const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
  db.query(sql, [username, email, password], (err, result) => {
    if (err) return res.json({ success: false, error: err });
    res.json({ success: true, message: "User registered successfully" });
  });
});

// ✅ Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.json({ success: false, error: err });
    if (results.length > 0) {
      res.json({ success: true, message: "Login successful" });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  });
});

// ✅ Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

