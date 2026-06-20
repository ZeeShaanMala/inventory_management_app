const {
  protect
} = require("../middleware/authMiddleware");
const express = require("express");

const router = express.Router();

const {
  getParties,
  addParty,
  deleteParty
} = require("../controllers/partyController");


// ================= GET ALL PARTIES =================
router.get("/", protect, getParties);


// ================= ADD PARTY =================
router.post("/", protect, addParty);


// ================= DELETE PARTY =================
router.delete("/:id", protect, deleteParty);


module.exports = router;