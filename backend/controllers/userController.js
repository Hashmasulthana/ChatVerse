const db =
require("../database/db");


// ================= SEARCH USERS + ROOMS =================
const searchUsers =
async (req, res) => {

  try {

    const { query } =
    req.query;


    // VALIDATION
    if(!query){

      return res.status(400).json({

        message:
        "Search query required",

      });

    }


    // SEARCH USERS
    const users =
    db.prepare(
      `
      SELECT
        id,
        username,
        profilePic
      FROM users
      WHERE LOWER(username)
      LIKE LOWER(?)
      `
    ).all(
      `%${query}%`
    );


    // SEARCH ROOMS
    const rooms =
    db.prepare(
      `
      SELECT
        roomName,
        createdBy
      FROM rooms
      WHERE LOWER(roomName)
      LIKE LOWER(?)
      `
    ).all(
      `%${query}%`
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



// ================= PROFILE UPLOAD =================
const uploadProfilePic =
async (req, res) => {

  try {

    const {
      username,
    } = req.body;


    // FILE CHECK
    if(!req.file){

      return res.status(400).json({

        message:
        "No file uploaded",

      });

    }


    // IMAGE FILE
    const profilePic =
    req.file.filename;


    // IMAGE URL
    const imageUrl =
    `${req.protocol}://${req.get("host")}/uploads/${profilePic}`;


    // UPDATE USER
    db.prepare(
      `
      UPDATE users
      SET profilePic = ?
      WHERE username = ?
      `
    ).run(
      imageUrl,
      username
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



// EXPORTS
module.exports = {

  searchUsers,

  uploadProfilePic,

};