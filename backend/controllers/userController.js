const connectDB =
require("../database/db");


// SEARCH USERS + ROOMS
const searchUsers =
async (req, res) => {

  try {

    const { query } =
      req.query;

    const db =
      await connectDB();


    // SEARCH USERS
    const users =
      await db.all(
        `
        SELECT
          id,
          username,
          profilePic
        FROM users
        WHERE LOWER(username)
        LIKE LOWER(?)
        `,
        [`%${query}%`]
      );


    // SEARCH ROOMS
    const rooms =
      await db.all(
        `
        SELECT
          roomName,
          createdBy
        FROM rooms
        WHERE LOWER(roomName)
        LIKE LOWER(?)
        `,
        [`%${query}%`]
      );


    // RESPONSE
    res.status(200).json({

      users,

      rooms,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message:
      "Server Error",

    });

  }

};


// PROFILE UPLOAD
const uploadProfilePic =
async (req, res) => {

  try {

    const {
      username,
    } = req.body;


    // CHECK FILE
    if(!req.file){

      return res.status(400).json({

        message:
        "No file uploaded",

      });

    }


    const profilePic =
      req.file.filename;

    const db =
      await connectDB();


    // IMAGE URL
    const imageUrl =
    `http://localhost:5000/uploads/${profilePic}`;


    // UPDATE USER
    await db.run(
      `
      UPDATE users
      SET profilePic = ?
      WHERE username = ?
      `,
      [
        imageUrl,
        username,
      ]
    );


    // RESPONSE
    res.status(200).json({

      message:
      "Profile Updated",

      profilePic:
      imageUrl,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message:
      "Upload Failed",

    });

  }

};


module.exports = {

  searchUsers,

  uploadProfilePic,

};