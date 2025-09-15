const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.signup = (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ msg: "All fields required" });

  User.findByEmail(email, async (err, results) => {
    if (err) return res.status(500).json({ msg: "DB error" });
    if (results.length > 0) return res.status(400).json({ msg: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    User.create(name, email, hashedPassword, (err) => {
      if (err) return res.status(500).json({ msg: "Error creating user" });
      res.json({ msg: "User registered successfully" });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ msg: "All fields required" });

  User.findByEmail(email, async (err, results) => {
    if (err) return res.status(500).json({ msg: "DB error" });
    if (results.length === 0) return res.status(400).json({ msg: "Invalid credentials" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ msg: "Login successful", token });
  });
};
