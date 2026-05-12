const connectDB =
require("../database/db");


// CREATE ROOM
const createRoom =
async (req, res) => {

  try {

    const {
      roomName,
      createdBy,
    } = req.body;

    const db =
      await connectDB();

    await db.run(
      `
      INSERT INTO rooms(
        roomName,
        createdBy
      )
      VALUES(?, ?)
      `,
      [
        roomName,
        createdBy,
      ]
    );

    res.status(201).json({
      message:
        "Room Created",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Room already exists",
    });

  }

};


// GET ALL ROOMS
const getRooms =
async (req, res) => {

  try {

    const db =
      await connectDB();

    const rooms =
      await db.all(
        `
        SELECT * FROM rooms
        `
      );

    res.status(200).json(
      rooms
    );

  } catch (error) {

    console.log(error);

  }

};


// JOIN ROOM
const joinRoom =
async (req, res) => {

  try {

    const {
      roomName,
      username,
    } = req.body;

    const db =
      await connectDB();

    // CHECK MEMBER
    const existing =
      await db.get(
        `
        SELECT * FROM room_members
        WHERE roomName = ?
        AND username = ?
        `,
        [
          roomName,
          username,
        ]
      );

    if(existing){

      return res.status(400).json({
        message:
        "Already Joined",
      });

    }

    // INSERT MEMBER
    await db.run(
      `
      INSERT INTO room_members(
        roomName,
        username
      )
      VALUES(?, ?)
      `,
      [
        roomName,
        username,
      ]
    );

    res.status(200).json({
      message:
      "Joined Room",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
      "Join Failed",
    });

  }

};


// GET JOINED ROOMS
const getJoinedRooms =
async (req, res) => {

  try {

    const {
      username,
    } = req.params;

    const db =
      await connectDB();

    const rooms =
      await db.all(
        `
        SELECT roomName
        FROM room_members
        WHERE username = ?
        `,
        [username]
      );

    res.status(200).json(
      rooms
    );

  } catch (error) {

    console.log(error);

  }

};

module.exports = {

  createRoom,

  getRooms,

  joinRoom,

  getJoinedRooms,

};