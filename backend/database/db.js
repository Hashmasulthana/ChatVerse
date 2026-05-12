const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

async function connectDB() {

  const db = await open({

    filename: "./chatapp.db",

    driver: sqlite3.Database,

  });


  // USERS
  await db.exec(`

    CREATE TABLE IF NOT EXISTS users(

      id INTEGER PRIMARY KEY AUTOINCREMENT,

      username TEXT,

      email TEXT UNIQUE,

      password TEXT,

      profilePic TEXT DEFAULT ''

    )

  `);


  // ROOMS
  await db.exec(`

    CREATE TABLE IF NOT EXISTS rooms(

      id INTEGER PRIMARY KEY AUTOINCREMENT,

      roomName TEXT UNIQUE,

      createdBy TEXT,

      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP

    )

  `);


  // ROOM MEMBERS
  await db.exec(`

    CREATE TABLE IF NOT EXISTS room_members(

      id INTEGER PRIMARY KEY AUTOINCREMENT,

      roomName TEXT,

      username TEXT

    )

  `);


  // MESSAGES
  await db.exec(`

    CREATE TABLE IF NOT EXISTS messages(

      id INTEGER PRIMARY KEY AUTOINCREMENT,

      room TEXT,

      author TEXT,

      message TEXT,

      time TEXT,

      created_at DATETIME DEFAULT CURRENT_TIMESTAMP

    )

  `);

  return db;

}

module.exports = connectDB;