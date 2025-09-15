const express = require("express");
const db = require("../config/db"); // your db connection

const router = express.Router();

// Get all ratings for a store
router.get("/:storeId/ratings", (req, res) => {
  const { storeId } = req.params;
  db.query(
    "SELECT u.name AS user, r.rating FROM ratings r JOIN users u ON r.user_id = u.id WHERE r.store_id = ?",
    [storeId],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Error fetching ratings" });
      res.json(results);
    }
  );
});

// Get average rating and total count
router.get("/:storeId/average", (req, res) => {
  const { storeId } = req.params;
  db.query(
    "SELECT AVG(rating) AS avgRating, COUNT(*) AS totalUsersRated FROM ratings WHERE store_id = ?",
    [storeId],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Error fetching average rating" });
      res.json(results[0]);
    }
  );
});

// Add or update rating for a store
router.post("/:storeId/ratings", (req, res) => {
  const { storeId } = req.params;
  const { userId, rating } = req.body;

  if (!userId || !rating) {
    return res.status(400).json({ error: "userId and rating are required" });
  }

  // Check if this user has already rated this store
  db.query(
    "SELECT id FROM ratings WHERE user_id = ? AND store_id = ?",
    [userId, storeId],
    (err, existing) => {
      if (err) {
        console.error("Error checking existing rating:", err);
        return res.status(500).json({ error: "Error adding/updating rating" });
      }

      if (existing.length > 0) {
        // Update existing rating
        db.query(
          "UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?",
          [rating, userId, storeId],
          (err) => {
            if (err) {
              console.error("Error updating rating:", err);
              return res.status(500).json({ error: "Error adding/updating rating" });
            }
            return res.json({ message: "Rating updated successfully" });
          }
        );
      } else {
        // Insert new rating
        db.query(
          "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)",
          [userId, storeId, rating],
          (err) => {
            if (err) {
              console.error("Error adding rating:", err);
              return res.status(500).json({ error: "Error adding/updating rating" });
            }
            return res.json({ message: "Rating added successfully" });
          }
        );
      }
    }
  );
});

module.exports = router;