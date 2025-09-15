const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

// SIGNUP
router.post("/signup", (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ msg: "Please provide name, email, password, and role" });
  }

  // validate role
  const validRoles = ["user", "admin", "storeowner"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ msg: "Invalid role" });
  }

  // hash password
  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = "INSERT INTO usersign (name, email, password, role) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, email, hashedPassword, role], (err, result) => {
    if (err) {
      console.error("❌ MySQL Error:", err);
      return res.status(500).json({ msg: "Error creating user", error: err });
    }
    res.json({ msg: "User registered successfully", userId: result.insertId, role });
  });
});


// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM usersign WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("❌ MySQL Error:", err);
      return res.status(500).json({ msg: "Database error" });
    }
    if (results.length === 0) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    res.json({ msg: "Login successful", userId: user.id, role: user.role });

  });
});

module.exports = router;
