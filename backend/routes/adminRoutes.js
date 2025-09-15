// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admincontroller");
router.post("/stores", adminController.addStore);

// ===== Stats =====
router.get("/stats", adminController.getStats);

// ===== Users =====
router.get("/users", adminController.getUsers);           // Get all users
router.put("/users/:id", adminController.updateUser);     // Edit user
router.delete("/users/:id", adminController.deleteUser);  // Delete user

// ===== Stores =====
router.get("/stores", adminController.getStores);          // Get all stores
router.put("/stores/:id", adminController.updateStore);    // Edit store
router.delete("/stores/:id", adminController.deleteStore); // Delete store

module.exports = router;
