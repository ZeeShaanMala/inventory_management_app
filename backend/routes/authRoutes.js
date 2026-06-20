const express = require("express");

const router = express.Router();

const {
  register,
  login,
  changePassword,
  updateProfile
} = require("../controllers/authController");


// ================= REGISTER =================
router.post("/register", register);


// ================= LOGIN =================
router.post("/login", login);

// ================= CHANGE PASSWORD =================
router.post("/change-password", changePassword);

// ================= UPDATE PROFILE =================
router.put(
  "/update-profile",
  updateProfile
);


module.exports = router;