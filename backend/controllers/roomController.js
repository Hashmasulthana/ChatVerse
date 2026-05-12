const db =
require("../database/db");


// ================= CREATE ROOM =================
const createRoom =
async (req, res) => {

  try {

    const {
      roomName,
      createdBy,
    } = req.body;


    // VALIDATION
    if(
      !roomName ||
      !createdBy
    ){

      return res.status(400).json({

        message:
        "All fields required",

      });

    }


    // CHECK EXISTING ROOM
    const existingRoom =
    db.prepare(
      `
      SELECT * FROM rooms
      WHERE roomName = ?
      `
    ).get(roomName);


    if(existingRoom){

      return res.status(400).json({

        message:
        "Room already exists",

      });

    }


    // INSERT ROOM
    db.prepare(
      `
      INSERT INTO rooms(
        roomName,
        createdBy
      )
      VALUES(?, ?)
      `
    ).run(
      roomName,
      createdBy
    );


    // AUTO JOIN CREATOR
    db.prepare(
      `
      INSERT INTO room_members(
        roomName,
        username
      )
      VALUES(?, ?)
      `
    ).run(
      roomName,
      createdBy
    );


    res.status(201).json({

      message:
      "Room Created",

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message:
      "Server Error",

    });

  }

};



// ================= GET ALL ROOMS =================
const getRooms =
async (req, res) => {

  try {

    const rooms =
    db.prepare(
      `
      SELECT *
      FROM rooms
      ORDER BY id DESC
      `
    ).all();


    res.status(200).json(
      rooms
    );

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message:
      "Server Error",

    });

  }

};



// ================= JOIN ROOM =================
const joinRoom =
async (req, res) => {

  try {

    const {
      roomName,
      username,
    } = req.body;


    // CHECK MEMBER
    const existing =
    db.prepare(
      `
      SELECT *
      FROM room_members
      WHERE roomName = ?
      AND username = ?
      `
    ).get(
      roomName,
      username
    );


    if(existing){

      return res.status(400).json({

        message:
        "Already Joined",

      });

    }


    // INSERT MEMBER
    db.prepare(
      `
      INSERT INTO room_members(
        roomName,
        username
      )
      VALUES(?, ?)
      `
    ).run(
      roomName,
      username
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



// ================= GET JOINED ROOMS =================
const getJoinedRooms =
async (req, res) => {

  try {

    const {
      username,
    } = req.params;


    const rooms =
    db.prepare(
      `
      SELECT roomName
      FROM room_members
      WHERE username = ?
      `
    ).all(username);


    res.status(200).json(
      rooms
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

  createRoom,

  getRooms,

  joinRoom,

  getJoinedRooms,

};