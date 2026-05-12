const express =
require("express");

const router =
express.Router();

const {

  createRoom,

  getRooms,

  joinRoom,

  getJoinedRooms,

} = require(
  "../controllers/roomController"
);


// CREATE ROOM
router.post(
  "/create",
  createRoom
);


// GET ROOMS
router.get(
  "/all",
  getRooms
);


// JOIN ROOM
router.post(
  "/join",
  joinRoom
);


// GET JOINED ROOMS
router.get(
  "/joined/:username",
  getJoinedRooms
);

module.exports =
router;