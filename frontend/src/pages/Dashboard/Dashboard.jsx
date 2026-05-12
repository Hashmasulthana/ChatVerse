import "./Dashboard.css";

import Sidebar from "../../components/Sidebar/Sidebar";

import ChatWindow from "../../components/ChatWindow/ChatWindow";

import API from "../../services/api";

import { io } from "socket.io-client";

import { toast }
from "react-toastify";

import {
  useEffect,
  useState,
} from "react";


// SOCKET
const socket = io(
  "https://chatverse-q7ve.onrender.com"
);


function Dashboard() {

  // USER
  const user = JSON.parse(
    localStorage.getItem("user")
  );


  // STATES
  const [room, setRoom] =
    useState("");

  const [chatType, setChatType] =
    useState("");

  const [privateUser, setPrivateUser] =
    useState("");

  const [currentMessage, setCurrentMessage] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [onlineUsers, setOnlineUsers] =
    useState([]);

  const [privateChats,
  setPrivateChats] =
    useState([]);

  const [typingUser, setTypingUser] =
    useState("");

  const [currentlyTypingUser,
  setCurrentlyTypingUser] =
    useState("");


  // NOTIFICATIONS
  const [notifications,
  setNotifications] =
    useState({});


  // PRIVATE ROOM ID
  const createPrivateRoomId = (
    user1,
    user2
  ) => {

    return [user1, user2]
      .sort()
      .join("_");

  };


  // LOAD PRIVATE CHATS
  useEffect(() => {

    const savedChats =
      JSON.parse(
        localStorage.getItem(
          `privateChats_${user.username}`
        )
      ) || [];

    setPrivateChats(
      savedChats
    );

  }, []);


  // FETCH MESSAGES
  const fetchMessages =
    async () => {

      if(!room) return;

      try {

        const response =
          await API.get(
            `/messages/${room}`
          );

        setMessages(
          response.data
        );

      } catch (error) {

        console.log(error);

      }

    };


  // JOIN ROOM
  useEffect(() => {

    if(!room) return;

    socket.emit(
      "join_room",
      room
    );

    fetchMessages();


    // CLEAR NOTIFICATIONS
    setNotifications((prev) => {

      const updated = {
        ...prev
      };

      delete updated[room];

      return updated;

    });

  }, [room]);


  // USER JOIN
  useEffect(() => {

    if(user?.username){

      socket.emit(
        "user_join",
        user.username
      );

    }

  }, []);


  // RECEIVE MESSAGE
  useEffect(() => {

    const receiveHandler =
      (data) => {

        // LIVE MESSAGE
        if(
          data.room === room
        ){

          setMessages((prev) => [

            ...prev,
            data,

          ]);

        }


        // IGNORE SELF
        if(
          data.author ===
          user.username
        ) return;


        // NOTIFICATION
        if(
          data.room !== room
        ){

          setNotifications(
            (prev) => ({

              ...prev,

              [data.room]:

                (prev[data.room] || 0) + 1,

            })
          );

        }


        // PRIVATE CHAT SAVE
        if(
          data.room.includes("_")
        ){

          const otherUser =
            data.author;

          const updatedChats = [

            ...new Set([
              ...privateChats,
              otherUser,
            ])

          ];

          setPrivateChats(
            updatedChats
          );

          localStorage.setItem(

            `privateChats_${user.username}`,

            JSON.stringify(
              updatedChats
            )

          );

        }


        // TOAST
        toast.info(
          `${data.author}: ${data.message}`
        );

      };

    socket.on(
      "receive_message",
      receiveHandler
    );

    return () => {

      socket.off(
        "receive_message",
        receiveHandler
      );

    };

  }, [room, privateChats]);


  // ONLINE USERS
  useEffect(() => {

    socket.on(
      "online_users",
      (users) => {

        const filteredUsers =
          users.filter(
            (item, index, self) =>

              index ===
              self.findIndex(
                (u) =>
                  u.username
                    .trim()
                    .toLowerCase() ===
                  item.username
                    .trim()
                    .toLowerCase()
              )
          );

        setOnlineUsers(
          filteredUsers
        );

      }
    );

    return () => {

      socket.off(
        "online_users"
      );

    };

  }, []);


  // TYPING STATUS
  useEffect(() => {

    socket.on(
      "show_typing",
      (username) => {

        if(
          username ===
          user.username
        ) return;


        // CHAT WINDOW
        setTypingUser(
          `${username} is typing...`
        );


        // SIDEBAR
        setCurrentlyTypingUser(
          username
        );


        setTimeout(() => {

          setTypingUser("");

          setCurrentlyTypingUser("");

        }, 2000);

      }
    );

    return () => {

      socket.off(
        "show_typing"
      );

    };

  }, []);


  // START PRIVATE CHAT
  const startPrivateChat =
    (selectedUser) => {

      const privateRoomId =
        createPrivateRoomId(
          user.username,
          selectedUser
        );

      setChatType(
        "private"
      );

      setPrivateUser(
        selectedUser
      );

      setRoom(
        privateRoomId
      );

      socket.emit(
        "join_private_chat",
        privateRoomId
      );


      // SAVE CHAT
      const updatedChats = [

        ...new Set([
          ...privateChats,
          selectedUser,
        ])

      ];

      setPrivateChats(
        updatedChats
      );

      localStorage.setItem(

        `privateChats_${user.username}`,

        JSON.stringify(
          updatedChats
        )

      );

    };


  // SEND MESSAGE
  const sendMessage =
    async () => {

      if (
        currentMessage.trim() === ""
      ) return;


      const messageData = {

        room,

        author:
          user.username,

        message:
          currentMessage,

        time:
          new Date()
          .toLocaleTimeString(
            [],
            {
              hour:
                "2-digit",

              minute:
                "2-digit",
            }
          ),

      };


      // SHOW OWN
      setMessages((prev) => [

        ...prev,
        messageData,

      ]);


      // SOCKET
      socket.emit(
        "send_message",
        messageData
      );


      // CLEAR
      setCurrentMessage("");

    };


  return (

    <div className="dashboard-layout">


      {/* SIDEBAR */}
      <Sidebar

        room={room}

        setRoom={setRoom}

        setChatType={
          setChatType
        }

        startPrivateChat={
          startPrivateChat
        }

        onlineUsers={
          onlineUsers
        }

        currentUser={
          user.username
        }

        notifications={
          notifications
        }

        currentlyTypingUser={
          currentlyTypingUser
        }

        privateChats={
          privateChats
        }

      />


      {/* EMPTY SCREEN */}
      {
        !room ? (

          <div className="empty-dashboard">

            <div className="empty-dashboard-content">

              <h1>
                Welcome to ChatVerse 💖
              </h1>

              <p>

                Select chat to start messaging

              </p>

            </div>

          </div>

        ) : (

          <ChatWindow

            chatType={
              chatType
            }

            privateUser={
              privateUser
            }

            currentMessage={
              currentMessage
            }

            setCurrentMessage={
              (value) => {

                setCurrentMessage(
                  value
                );

                socket.emit(
                  "typing",
                  {

                    room,

                    username:
                    user.username,

                  }
                );

              }
            }

            sendMessage={
              sendMessage
            }

            messages={
              messages
            }

            user={user}

            room={room}

            typingUser={
              typingUser
            }

          />

        )
      }

    </div>

  );

}

export default Dashboard;