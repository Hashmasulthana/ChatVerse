const Database =
require("better-sqlite3");

const path =
require("path");


// DATABASE PATH
const dbPath =
path.join(
  __dirname,
  "chatapp.db"
);


// DATABASE CONNECTION
const db =
new Database(dbPath);


// ================= USERS =================
db.prepare(`

CREATE TABLE IF NOT EXISTS users(

  id INTEGER PRIMARY KEY AUTOINCREMENT,

  username TEXT UNIQUE,

  email TEXT UNIQUE,

  password TEXT,

  profilePic TEXT DEFAULT ''

)

`).run();


// ================= ROOMS =================
db.prepare(`

CREATE TABLE IF NOT EXISTS rooms(

  id INTEGER PRIMARY KEY AUTOINCREMENT,

  roomName TEXT UNIQUE,

  createdBy TEXT,

  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP

)

`).run();


// ================= ROOM MEMBERS =================
db.prepare(`

CREATE TABLE IF NOT EXISTS room_members(

  id INTEGER PRIMARY KEY AUTOINCREMENT,

  roomName TEXT,

  username TEXT

)

`).run();


// ================= MESSAGES =================
db.prepare(`

CREATE TABLE IF NOT EXISTS messages(

  id INTEGER PRIMARY KEY AUTOINCREMENT,

  room TEXT,

  author TEXT,

  message TEXT,

  time TEXT,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP

)

`).run();


// EXPORT DATABASE
module.exports = db;