// backend/routes/admin.js
const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

// Get total stats
router.get("/stats", (req, res) => {
  const stats = {};

  db.query("SELECT COUNT(*) as totalUsers FROM users", (err, result) => {
    if (err) return res.status(500).json(err);
    stats.totalUsers = result[0].totalUsers;

    db.query("SELECT COUNT(*) as totalStores FROM stores", (err2, result2) => {
      if (err2) return res.status(500).json(err2);
      stats.totalStores = result2[0].totalStores;

      db.query("SELECT COUNT(*) as totalRatings FROM ratings", (err3, result3) => {
        if (err3) return res.status(500).json(err3);
        stats.totalRatings = result3[0].totalRatings;

        res.json(stats);
      });
    });
  });
});

// Get all users
router.get("/users", (req, res) => {
  db.query("SELECT id, name, email FROM users", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Get all stores
router.get("/stores", (req, res) => {
  db.query(
    "SELECT stores.id, stores.name, users.name as owner FROM stores JOIN users ON stores.owner_id = users.id",
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

module.exports = router;

