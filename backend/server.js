require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Test database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Database connected successfully");
    connection.release();
  }
});

// ====== API ENDPOINTS ======

// Stores
app.post("/stores", (req, res) => {
  const { name, location } = req.body;
  if (!name || !location) {
    return res.status(400).json({ error: "Name and location are required" });
  }

  db.query(
    "INSERT INTO stores (name, location) VALUES (?, ?)",
    [name, location],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Store added", storeId: result.insertId });
    }
  );
});

app.get("/stores", (req, res) => {
  db.query("SELECT * FROM stores", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Ratings
app.post("/ratings", (req, res) => {
  const { store_id, user_id, rating, comment } = req.body;
  if (!store_id || !user_id || !rating) {
    return res.status(400).json({ error: "store_id, user_id, and rating are required" });
  }

  db.query(
    "INSERT INTO ratings (store_id, user_id, rating, comment) VALUES (?, ?, ?, ?)",
    [store_id, user_id, rating, comment || null],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Rating added", ratingId: result.insertId });
    }
  );
});

app.get("/ratings/:store_id", (req, res) => {
  const { store_id } = req.params;
  db.query(
    "SELECT * FROM ratings WHERE store_id = ?",
    [store_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// Auth routes (Signup/Login)
app.use("/api/auth", authRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

const storeRoutes = require("./routes/storeRoutes.js");
app.use("/api/stores", storeRoutes);

const adminRoutes = require("./controllers/ratingcontroller.js");
app.use("/api/admin", adminRoutes);

const ratingRoutes = require("./routes/ratingRoutes");
app.use("/api/ratings", ratingRoutes);
