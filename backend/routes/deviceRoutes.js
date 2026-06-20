const {
  protect
} = require("../middleware/authMiddleware");

const express = require("express");

const router = express.Router();

const {
  getDevices,
  addDevice,
  updateDevice,
  deleteDevice,
  assignDevice,
  activateDevice,
  returnDevice,
  sellDevice
} = require("../controllers/deviceController");


// ================= GET ALL DEVICES =================
router.get("/", protect, getDevices);


// ================= ADD DEVICE =================
router.post("/", protect, addDevice);


// ================= UPDATE DEVICE =================
router.put("/:imei", protect, updateDevice);


// ================= DELETE DEVICE =================
router.delete("/:imei", protect, deleteDevice);


// ================= ASSIGN DEVICE =================
router.put("/assign/:imei", protect, assignDevice);


// ================= ACTIVATE DEVICE =================
router.put("/activate/:imei", protect, activateDevice);


// ================= RETURN DEVICE =================
router.put("/return/:imei", protect, returnDevice);


// ================= SELL DEVICE =================
router.put("/sell/:imei", protect, sellDevice);

module.exports = router;