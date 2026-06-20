const db = require("../config/db");

const bcrypt = require("bcrypt");

const {
  generateToken
} = require("../services/tokenService");


// ================= REGISTER =================
const register = async (req, res) => {

  try {

    const {
      name,
      email,
      password
    } = req.body;


    // ================= VALIDATION =================
    if (!name || !email || !password) {

      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });

    }


    // ================= CHECK EXISTING USER =================
    const [existing] = await db.query(
      `
      SELECT id
      FROM users
      WHERE email = ?
      `,
      [email]
    );


    if (existing.length > 0) {

      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });

    }


    // ================= HASH PASSWORD =================
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );


    // ================= INSERT USER =================
    const [result] = await db.query(
      `
      INSERT INTO users
      (
        name,
        email,
        password
      )
      VALUES (?, ?, ?)
      `,
      [
        name,
        email,
        hashedPassword
      ]
    );


    // ================= GENERATE TOKEN =================
    const token = generateToken({
      id: result.insertId,
      email
    });


    res.status(201).json({
      success: true,
      message: "Registration successful",
      token
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// ================= LOGIN =================
const login = async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;


    // ================= VALIDATION =================
    if (!email || !password) {

      return res.status(400).json({
        success: false,
        message: "Email and Password required"
      });

    }




    // ================= FIND USER =================
    const [users] = await db.query(
      `
      SELECT *
      FROM users
      WHERE email = ?
      `,
      [email]
    );


    if (users.length === 0) {

      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });

    }


    const user = users[0];


    // ================= CHECK PASSWORD =================
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );


    if (!isMatch) {

      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });

    }


    // ================= GENERATE TOKEN =================
    const token = generateToken(user);


    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// ================= CHANGE PASSWORD =================
const changePassword = async (req, res) => {

  try {

    const {
      email,
      currentPassword,
      newPassword
    } = req.body;

    // ================= FIND USER =================
    const [users] = await db.query(
      `
      SELECT *
      FROM users
      WHERE email = ?
      `,
      [email]
    );

    if (users.length === 0) {

      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }

    const user = users[0];

    // ================= VERIFY CURRENT PASSWORD =================
    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {

      return res.status(401).json({
        success: false,
        message: "Current password incorrect"
      });

    }

    // ================= HASH NEW PASSWORD =================
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    // ================= UPDATE PASSWORD =================
    await db.query(
      `
      UPDATE users
      SET password = ?
      WHERE email = ?
      `,
      [
        hashedPassword,
        email
      ]
    );

    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};
// ================= UPDATE PROFILE =================
const updateProfile = async (req, res) => {

  try {

    const {
      id,
      name,
      email,
      avatar
    } = req.body;

    // ================= VALIDATION =================
    if (!id || !name || !email) {

      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });

    }

    // ================= CHECK EMAIL DUPLICATE =================
    const [existing] = await db.query(
      `
      SELECT id
      FROM users
      WHERE email = ?
        AND id != ?
      `,
      [email, id]
    );

    if (existing.length > 0) {

      return res.status(409).json({
        success: false,
        message: "Email already in use"
      });

    }

    // ================= UPDATE USER =================
    await db.query(
      `
      UPDATE users
      SET
        name = ?,
        email = ?,
        avatar = ?
      WHERE id = ?
      `,
      [
        name,
        email,
        avatar || null,
        id
      ]
    );

    // ================= RETURN UPDATED USER =================
    const [users] = await db.query(
      `
      SELECT
        id,
        name,
        email,
        avatar
      FROM users
      WHERE id = ?
      `,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: users[0]
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


module.exports = {
  register,
  login,
  changePassword,
  updateProfile
};