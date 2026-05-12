const path = require("path");

const userRoutes =
require("./routes/userRoutes");

const roomRoutes =
require("./routes/roomRoutes");
const express = require("express");
const cors = require("cors");

require("dotenv").config();

const http = require("http");

const { Server } = require("socket.io");


// ROUTES
const authRoutes =
  require("./routes/authRoutes");

const messageRoutes =
  require("./routes/messageRoutes");


// CONTROLLERS
const {
  saveMessage,
} = require(
  "./controllers/messageController"
);


// EXPRESS APP
const app = express();


// HTTP SERVER
const server =
  http.createServer(app);


// SOCKET SERVER
const io = new Server(server, {

  cors: {
    origin: "*",
  },

});


// MIDDLEWARES
app.use(cors());

app.use(express.json());


app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// API ROUTES
app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/messages",
  messageRoutes
);

app.use(
  "/api/rooms",
  roomRoutes
);

app.use(
  "/api/users",
  userRoutes
);

// ONLINE USERS ARRAY
let onlineUsers = [];


// SOCKET CONNECTION
io.on("connection", (socket) => {

  console.log(
    "User Connected:",
    socket.id
  );


  // USER JOIN
  socket.on(
    "user_join",
    (username) => {

      // REMOVE OLD USER
      onlineUsers =
        onlineUsers.filter(
          (user) =>
            user.username
              .trim()
              .toLowerCase() !==
            username
              .trim()
              .toLowerCase()
        );

      // ADD NEW USER
      const userData = {

        socketId: socket.id,

        username,

      };

      onlineUsers.push(userData);


      // SEND USERS
      io.emit(
        "online_users",
        onlineUsers
      );

      console.log(
        "Online Users:",
        onlineUsers
      );

    }
  );


  // JOIN PUBLIC ROOM
  socket.on(
    "join_room",
    (room) => {

      socket.join(room);

      console.log(
        `Joined Room: ${room}`
      );

    }
  );


  // JOIN PRIVATE CHAT
  socket.on(
    "join_private_chat",
    (roomId) => {

      socket.join(roomId);

      console.log(
        `Joined Private Room: ${roomId}`
      );

    }
  );


  // TYPING
  socket.on(
    "typing",
    (data) => {

      socket
        .to(data.room)
        .emit(
          "show_typing",
          data.username
        );

    }
  );


  // SEND MESSAGE
  socket.on(
    "send_message",
    async (data) => {

      try {

        // SAVE TO DATABASE
        await saveMessage(data);


        // SEND TO ROOM
        socket
          .to(data.room)
          .emit(
            "receive_message",
            data
          );

      } catch (error) {

        console.log(error);

      }

    }
  );


  // DISCONNECT
  socket.on(
    "disconnect",
    () => {

      onlineUsers =
        onlineUsers.filter(
          (user) =>
            user.socketId !==
            socket.id
        );


      io.emit(
        "online_users",
        onlineUsers
      );

      console.log(
        "User Disconnected"
      );

      console.log(
        "Updated Online Users:",
        onlineUsers
      );

    }
  );

});


// HOME ROUTE
app.get("/", (req, res) => {

  res.send(
    "ChatVerse Backend Running..."
  );

});


// PORT
const PORT =
  process.env.PORT || 5000;


// START SERVER
server.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});