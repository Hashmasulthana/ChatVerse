const db =
require("../database/db");


// ================= SAVE MESSAGE =================
const saveMessage =
async (data) => {

  try {

    db.prepare(
      `
      INSERT INTO messages (
        room,
        author,
        message,
        time
      )
      VALUES (?, ?, ?, ?)
      `
    ).run(

      data.room,

      data.author,

      data.message,

      data.time

    );

  } catch (error) {

    console.log(
      "Save Message Error:",
      error
    );

  }

};



// ================= GET ROOM MESSAGES =================
const getMessages =
async (req, res) => {

  try {

    const { room } =
    req.params;


    // GET ALL MESSAGES
    const messages =
    db.prepare(
      `
      SELECT *
      FROM messages
      WHERE room = ?
      ORDER BY id ASC
      `
    ).all(room);


    // RESPONSE
    res.status(200).json(
      messages
    );

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

  saveMessage,

  getMessages,

};