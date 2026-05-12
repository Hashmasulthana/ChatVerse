const connectDB = require("../database/db");


// SAVE MESSAGE
const saveMessage = async (data) => {

  const db = await connectDB();

  await db.run(`
  INSERT INTO messages (
    room,
    author,
    message,
    time
  )
  VALUES (?, ?, ?, ?)
`, [
  data.room,   // private room id bhi yahi store hoga
  data.author,
  data.message,
  data.time
]);

};


// GET ROOM MESSAGES
const getMessages = async (req, res) => {

  try {

    const { room } = req.params;

    const db = await connectDB();

    const messages = await db.all(
      `
      SELECT * FROM messages
      WHERE room = ?
      ORDER BY id ASC
      `,
      [room]
    );

    res.status(200).json(messages);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};

module.exports = {
  saveMessage,
  getMessages,
};