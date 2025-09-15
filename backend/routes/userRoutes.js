// backend/routes/store.js
const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

// Get ratings for a specific store
router.get("/:storeId/ratings", (req, res) => {
  const { storeId } = req.params;

  db.query(
    `SELECT users.name as user, ratings.rating 
     FROM ratings 
     JOIN users ON ratings.user_id = users.id 
     WHERE ratings.store_id = ?`,
    [storeId],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

// Get average rating for a store
router.get("/:storeId/average", (req, res) => {
  const { storeId } = req.params;

  db.query(
    `SELECT AVG(rating) as avgRating, COUNT(*) as totalUsersRated
     FROM ratings WHERE store_id = ?`,
    [storeId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result[0]);
    }
  );
});

module.exports = router;
