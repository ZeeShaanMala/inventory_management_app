require("dotenv").config();

const deviceRoutes = require("./routes/deviceRoutes");
const historyRoutes = require("./routes/historyRoutes");
const partyRoutes = require("./routes/partyRoutes");
const authRoutes = require("./routes/authRoutes");
const express = require("express");
const cors = require("cors");

const db = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/devices", deviceRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/parties", partyRoutes);
app.use("/api/auth", authRoutes);

// ================= TEST DATABASE CONNECTION =================
db.getConnection()
  .then(() => {
    console.log("MySQL Connected");
  })
  .catch((err) => {
    console.log("DB Connection Failed:", err.message);
  });


// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "GPS Inventory Backend Running"
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});