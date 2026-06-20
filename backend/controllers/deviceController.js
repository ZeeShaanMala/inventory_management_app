const db = require("../config/db");


// ================= GET ALL DEVICES =================
const getDevices = async (req, res) => {

  try {

    const [devices] = await db.query(`
      SELECT *
      FROM devices
      ORDER BY created_at DESC
    `);

    res.status(200).json({
      success: true,
      data: devices
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// ================= ADD DEVICE =================
const addDevice = async (req, res) => {

  try {

    const {
      imei,
      model,
      alias,
      sim_number,
      notes
    } = req.body;


    // ================= VALIDATION =================
    if (!imei || !model) {
      return res.status(400).json({
        success: false,
        message: "IMEI and Model are required"
      });
    }


    // ================= CHECK DUPLICATE =================
    const [existing] = await db.query(
  `
  SELECT imei
  FROM devices
  WHERE imei = ?
     OR sim_number = ?
  `,
  [
    imei,
    sim_number || null
  ]
);

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "IMEI or SIM number already exists"
      });
    }


    // ================= INSERT DEVICE =================
    await db.query(
      `
      INSERT INTO devices
(
  imei,
  model,
  alias,
  sim_number,
  notes
)
VALUES (?, ?, ?, ?, ?)
      `,
      [
        imei,
        model,
        alias || null,
        sim_number || null,
        notes || null
      ]
    );


    res.status(201).json({
      success: true,
      message: "Device added successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// ================= UPDATE DEVICE =================
const updateDevice = async (req, res) => {

  try {

    const { imei } = req.params;

    const {
      model,
      alias,
      sim_number,
      notes
    } = req.body;
    const [existingDevice] = await db.query(
  `
  SELECT imei
  FROM devices
  WHERE (imei = ? OR sim_number = ?)
    AND imei != ?
  `,
  [
    imei,
    sim_number || null,
    imei
  ]
);

if (existingDevice.length > 0) {

  return res.status(409).json({
    success: false,
    message: "IMEI or SIM number already exists"
  });

}


    const [result] = await db.query(
      `
      UPDATE devices
SET
  imei = ?,
  model = ?,
  alias = ?,
  sim_number = ?,
  notes = ?
WHERE imei = ?
      `,
      [
  req.body.imei,
  model,
  alias || null,
  sim_number || null,
  notes || null,
  req.params.imei
]
    );


    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Device not found"
      });
    }


    res.status(200).json({
      success: true,
      message: "Device updated successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// ================= DELETE DEVICE =================
const deleteDevice = async (req, res) => {

  try {

    const { imei } = req.params;


    const [result] = await db.query(
      `
      DELETE FROM devices
      WHERE imei = ?
      `,
      [imei]
    );


    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Device not found"
      });
    }


    res.status(200).json({
      success: true,
      message: "Device deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// ================= ASSIGN DEVICE =================
const assignDevice = async (req, res) => {

  const connection = await db.getConnection();

  try {

    await connection.beginTransaction();

    const { imei } = req.params;

    const { partyId } = req.body;


    // ================= VALIDATION =================
    if (!partyId) {
      return res.status(400).json({
        success: false,
        message: "Party ID is required"
      });
    }


    // ================= CHECK DEVICE =================
    const [devices] = await connection.query(
      `
      SELECT *
      FROM devices
      WHERE imei = ?
      `,
      [imei]
    );


    if (devices.length === 0) {

      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Device not found"
      });

    }


    const device = devices[0];


    // ================= STATUS VALIDATION =================
    if (device.status !== "IN_STOCK") {

      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Only IN_STOCK devices can be assigned"
      });

    }


    // ================= CHECK PARTY =================
    const [parties] = await connection.query(
      `
      SELECT *
      FROM parties
      WHERE id = ?
      `,
      [partyId]
    );


    if (parties.length === 0) {

      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Party not found"
      });

    }


    const party = parties[0];


    // ================= UPDATE DEVICE =================
    await connection.query(
      `
      UPDATE devices
      SET
        status = 'ASSIGNED',
        assigned_to = ?
      WHERE imei = ?
      `,
      [
        partyId,
        imei
      ]
    );


    // ================= INSERT HISTORY =================
    await connection.query(
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
        imei,
        "assigned",
        "Device Assigned",
        `Assigned to ${party.name}`,
        "Admin"
      ]
    );


    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Device assigned successfully"
    });

  } catch (error) {

    await connection.rollback();

    res.status(500).json({
      success: false,
      message: error.message
    });

  } finally {

    connection.release();

  }

};

// ================= ACTIVATE DEVICE =================
const activateDevice = async (req, res) => {

  const connection = await db.getConnection();

  try {

    await connection.beginTransaction();

    const { imei } = req.params;

    const {
      vehicleNumber,
      customerName,
      notes
    } = req.body;


    // ================= CHECK DEVICE =================
    const [devices] = await connection.query(
      `
      SELECT *
      FROM devices
      WHERE imei = ?
      `,
      [imei]
    );


    if (devices.length === 0) {

      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Device not found"
      });

    }


    const device = devices[0];


    // ================= STATUS VALIDATION =================
    if (device.status !== "ASSIGNED") {

      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Only ASSIGNED devices can be activated"
      });

    }


    // ================= UPDATE DEVICE =================
    await connection.query(
      `
      UPDATE devices
      SET
        status = 'ACTIVATED',
        vehicle_number = ?,
        customer_name = ?,
        notes = ?,
        activated_at = CURRENT_TIMESTAMP
      WHERE imei = ?
      `,
      [
        vehicleNumber || null,
        customerName || null,
        notes || null,
        imei
      ]
    );


    // ================= INSERT HISTORY =================
    await connection.query(
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
        imei,
        "activated",
        "Device Activated",
        notes || "Device activated successfully",
        "Admin"
      ]
    );


    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Device activated successfully"
    });

  } catch (error) {

    await connection.rollback();

    res.status(500).json({
      success: false,
      message: error.message
    });

  } finally {

    connection.release();

  }

};

// ================= RETURN DEVICE =================
const returnDevice = async (req, res) => {

  const connection = await db.getConnection();

  try {

    await connection.beginTransaction();

    const { imei } = req.params;


    // ================= CHECK DEVICE =================
    const [devices] = await connection.query(
      `
      SELECT *
      FROM devices
      WHERE imei = ?
      `,
      [imei]
    );


    if (devices.length === 0) {

      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Device not found"
      });

    }


    const device = devices[0];


    // ================= STATUS VALIDATION =================
    if (
      device.status !== "ASSIGNED" &&
      device.status !== "ACTIVATED"
    ) {

      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Only ASSIGNED or ACTIVATED devices can be returned"
      });

    }


    // ================= UPDATE DEVICE =================
    await connection.query(
      `
      UPDATE devices
      SET
        status = 'IN_STOCK',
        assigned_to = NULL,
        vehicle_number = NULL,
        customer_name = NULL,
        notes = NULL,
        activated_at = NULL
      WHERE imei = ?
      `,
      [imei]
    );


    // ================= INSERT HISTORY =================
    await connection.query(
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
        imei,
        "returned",
        "Device Returned",
        "Device returned to inventory",
        "Admin"
      ]
    );


    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Device returned successfully"
    });

  } catch (error) {

    await connection.rollback();

    res.status(500).json({
      success: false,
      message: error.message
    });

  } finally {

    connection.release();

  }

};

// ================= SELL DEVICE =================
const sellDevice = async (req, res) => {

  const connection = await db.getConnection();

  try {

    await connection.beginTransaction();

    const { imei } = req.params;

    const {
      sellingPrice,
      costPrice,
      notes
    } = req.body;


    // ================= CHECK DEVICE =================
    const [devices] = await connection.query(
      `
      SELECT *
      FROM devices
      WHERE imei = ?
      `,
      [imei]
    );


    if (devices.length === 0) {

      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Device not found"
      });

    }


    const device = devices[0];


    // ================= STATUS VALIDATION =================
    if (device.status !== "ACTIVATED") {

      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Only ACTIVATED devices can be sold"
      });

    }


    // ================= UPDATE DEVICE =================
    await connection.query(
      `
      UPDATE devices
      SET
        status = 'SOLD',
        sold_at = CURRENT_TIMESTAMP,
        selling_price = ?,
        cost_price = ?,
        notes = ?
      WHERE imei = ?
      `,
      [
  sellingPrice || 0,
  costPrice || 0,
  notes || null,
  imei
]
    );


    // ================= INSERT HISTORY =================
    await connection.query(
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
        imei,
        "sold",
        "Device Sold",
        notes || `Device sold for ₹${sellingPrice || 0}`,
        "Admin"
      ]
    );


    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Device sold successfully"
    });

  } catch (error) {

    await connection.rollback();

    res.status(500).json({
      success: false,
      message: error.message
    });

  } finally {

    connection.release();

  }

};

module.exports = {
  getDevices,
  addDevice,
  updateDevice,
  deleteDevice,
  assignDevice,
  activateDevice,
  returnDevice,
  sellDevice
};