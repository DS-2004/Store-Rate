
const db = require("../config/db");


exports.deleteUser = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User deleted successfully" });
  });
};

exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  db.query(
    "UPDATE users SET name = ?, email = ? WHERE id = ?",
    [name, email, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "User updated successfully" });
    }
  );
};

exports.getStats = (req, res) => {
  const stats = {};

  db.query("SELECT COUNT(*) AS totalUsers FROM users", (err, usersResult) => {
    if (err) return res.status(500).json({ error: err.message });
    stats.totalUsers = usersResult[0].totalUsers;

    db.query("SELECT COUNT(*) AS totalStores FROM stores", (err, storesResult) => {
      if (err) return res.status(500).json({ error: err.message });
      stats.totalStores = storesResult[0].totalStores;

      db.query("SELECT COUNT(*) AS totalRatings FROM ratings", (err, ratingsResult) => {
        if (err) return res.status(500).json({ error: err.message });
        stats.totalRatings = ratingsResult[0].totalRatings;

        res.json(stats);
      });
    });
  });
};



// Add new store
exports.addStore = (req, res) => {
  const { name, location } = req.body;
  if (!name || !location) {
    return res.status(400).json({ error: "Name and location are required" });
  }

  db.query(
    "INSERT INTO stores (name, location) VALUES (?, ?)",
    [name, location],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Store added successfully", storeId: result.insertId });
    }
  );
};

exports.deleteStore = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM stores WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Store deleted successfully" });
  });
};

exports.updateStore = (req, res) => {
  const { id } = req.params;
  const { name, owner_id } = req.body;
  db.query(
    "UPDATE stores SET name = ?, owner_id = ? WHERE id = ?",
    [name, owner_id, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Store updated successfully" });
    }
  );
};
