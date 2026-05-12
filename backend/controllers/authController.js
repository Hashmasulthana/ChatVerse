const bcrypt =
require("bcryptjs");

const jwt =
require("jsonwebtoken");

const db =
require("../database/db");


// ================= REGISTER =================
const registerUser =
async (req, res) => {

  try {

    const {
      username,
      email,
      password
    } = req.body;


    // VALIDATION
    if (
      !username ||
      !email ||
      !password
    ) {

      return res.status(400).json({

        message:
        "All fields are required",

      });

    }


    // CHECK EXISTING USER
    const existingUser =
    db.prepare(
      `
      SELECT * FROM users
      WHERE email = ?
      `
    ).get(email);


    if(existingUser){

      return res.status(400).json({

        message:
        "User already exists",

      });

    }


    // HASH PASSWORD
    const hashedPassword =
    await bcrypt.hash(
      password,
      10
    );


    // INSERT USER
    db.prepare(
      `
      INSERT INTO users
      (
        username,
        email,
        password
      )
      VALUES (?, ?, ?)
      `
    ).run(
      username,
      email,
      hashedPassword
    );


    // SUCCESS
    res.status(201).json({

      message:
      "User registered successfully",

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message:
      "Server Error",

    });

  }

};



// ================= LOGIN =================
const loginUser =
async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;


    // FIND USER
    const user =
    db.prepare(
      `
      SELECT * FROM users
      WHERE email = ?
      `
    ).get(email);


    // USER NOT FOUND
    if(!user){

      return res.status(400).json({

        message:
        "Invalid credentials",

      });

    }


    // PASSWORD CHECK
    const isMatch =
    await bcrypt.compare(
      password,
      user.password
    );


    if(!isMatch){

      return res.status(400).json({

        message:
        "Invalid credentials",

      });

    }


    // TOKEN
    const token =
    jwt.sign(

      {
        id: user.id,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }

    );


    // RESPONSE
    res.status(200).json({

      token,

      user: {

        id:
        user.id,

        username:
        user.username,

        email:
        user.email,

        profilePic:
        user.profilePic,

      },

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message:
      "Server Error",

    });

  }

};



// EXPORTS
module.exports = {

  registerUser,

  loginUser,

};