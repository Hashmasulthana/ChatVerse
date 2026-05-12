const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectDB = require("../database/db");


// REGISTER
const registerUser = async (req, res) => {

  try {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const db = await connectDB();

    const existingUser = await db.get(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.run(
      `
      INSERT INTO users(username, email, password)
      VALUES(?, ?, ?)
      `,
      [username, email, hashedPassword]
    );

    res.status(201).json({
      message: "User registered successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};


// LOGIN
const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    const db = await connectDB();

    const user = await db.get(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};

module.exports = {
  registerUser,
  loginUser,
};