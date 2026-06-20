const {
  protect
} = require("../middleware/authMiddleware");
const express = require("express");

const router = express.Router();

const {
  getAllHistory,
  getDeviceHistory,
  addHistory
} = require("../controllers/historyController");


// ================= GET ALL HISTORY =================
router.get("/", protect, getAllHistory);


// ================= GET DEVICE HISTORY =================
router.get("/:imei", protect, getDeviceHistory);


// ================= ADD HISTORY =================
router.post("/", protect, addHistory);


module.exports = router;