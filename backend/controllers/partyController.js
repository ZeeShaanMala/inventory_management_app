const db = require("../config/db");


// ================= GET ALL PARTIES =================
const getParties = async (req, res) => {

  try {

    const [parties] = await db.query(
      `
      SELECT *
      FROM parties
      ORDER BY created_at DESC
      `
    );

    res.status(200).json({
      success: true,
      data: parties
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// ================= ADD PARTY =================
const addParty = async (req, res) => {

  try {

    const {
      name,
      phone,
      address
    } = req.body;


    // ================= VALIDATION =================
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and Phone are required"
      });
    }


    // ================= INSERT PARTY =================
    const [result] = await db.query(
      `
      INSERT INTO parties
      (
        name,
        phone,
        address
      )
      VALUES (?, ?, ?)
      `,
      [
        name,
        phone,
        address || null
      ]
    );


    res.status(201).json({
      success: true,
      message: "Party added successfully",
      partyId: result.insertId
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// ================= DELETE PARTY =================
const deleteParty = async (req, res) => {

  try {

    const { id } = req.params;


    const [result] = await db.query(
      `
      DELETE FROM parties
      WHERE id = ?
      `,
      [id]
    );


    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Party not found"
      });
    }


    res.status(200).json({
      success: true,
      message: "Party deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


module.exports = {
  getParties,
  addParty,
  deleteParty
};