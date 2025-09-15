const express = require("express");
const router = express.Router();
const db = require("../config/db.js");


router.post("/", async (req, res) => {
  try {
    const { storeId, userId, rating, comment } = req.body;

    if (!storeId || !userId || !rating) {
      return res
        .status(400)
        .json({ message: "storeId, userId and rating are required" });
    }

    await db.query(
      "INSERT INTO ratings (store_id, user_id, rating, comment, created_at) VALUES (?, ?, ?, ?, NOW())",
      [storeId, userId, rating, comment || ""]
    );

    res.json({ message: "Rating submitted successfully" });
  } catch (err) {
    console.error("Error inserting rating:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM ratings");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching ratings:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
