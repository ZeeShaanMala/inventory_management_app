const db = require("../config/db");


// ================= GET ALL HISTORY =================
const getAllHistory = async (req, res) => {

  try {

    const [history] = await db.query(
      `
      SELECT *
      FROM device_history
      ORDER BY created_at DESC
      `
    );

    res.status(200).json({
      success: true,
      data: history
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// ================= GET DEVICE HISTORY =================
const getDeviceHistory = async (req, res) => {

  try {

    const { imei } = req.params;

    const [history] = await db.query(
      `
      SELECT *
      FROM device_history
      WHERE device_imei = ?
      ORDER BY created_at DESC
      `,
      [imei]
    );

    res.status(200).json({
      success: true,
      data: history
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// ================= ADD HISTORY =================
const addHistory = async (req, res) => {

  try {

    const {
      device_imei,
      action,
      label,
      note,
      performed_by
    } = req.body;


    // ================= VALIDATION =================
    if (!device_imei || !action || !label) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }


    // ================= CHECK DEVICE EXISTS =================
    const [device] = await db.query(
      `
      SELECT imei
      FROM devices
      WHERE imei = ?
      `,
      [device_imei]
    );


    if (device.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Device not found"
      });
    }


    // ================= INSERT HISTORY =================
    await db.query(
      `
      INSERT INTO device_history
      (
        device_imei,
        action,
        label,
        note,
        performed_by
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        device_imei,
        action,
        label,
        note || null,
        performed_by || "Admin"
      ]
    );


    res.status(201).json({
      success: true,
      message: "History added successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


module.exports = {
  getAllHistory,
  getDeviceHistory,
  addHistory
};