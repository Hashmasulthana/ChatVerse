import "./Sidebar.css";

import { toast }
from "react-toastify";

import API
from "../../services/api";

import {
  FaPlus,
  FaSearch,
  FaHashtag,
  FaUserFriends,
  FaCircle,
  FaDoorOpen,
} from "react-icons/fa";

import {
  useState,
  useEffect,
} from "react";

import CreateRoomModal
from "../CreateRoomModal/CreateRoomModal";


function Sidebar({

  room,
  setRoom,

  setChatType,

  startPrivateChat,

  onlineUsers,

  currentUser,

  notifications,

  currentlyTypingUser,

  privateChats,

}) {

  // ACTIVE TAB
  const [activeTab, setActiveTab] =
    useState("public");


  // SEARCH
  const [searchText,
  setSearchText] =
    useState("");

  const [searchResults,
  setSearchResults] =
    useState({

      users: [],

      rooms: [],

    });


  // ROOMS
  const [rooms,
  setRooms] =
    useState([]);


  // JOINED ROOMS
  const [joinedRooms,
  setJoinedRooms] =
    useState([]);


  // MODAL
  const [showModal,
  setShowModal] =
    useState(false);


  // FETCH ROOMS
  const fetchRooms =
    async () => {

      try {

        const response =
          await API.get(
            "/rooms/all"
          );

        setRooms(
          response.data
        );

      } catch (error) {

        console.log(error);

      }

    };


  // FETCH JOINED ROOMS
  const fetchJoinedRooms =
    async () => {

      try {

        const response =
          await API.get(
            `/rooms/joined/${currentUser}`
          );

        const roomNames =
          response.data.map(
            (room) =>
              room.roomName
          );

        setJoinedRooms(
          roomNames
        );

      } catch (error) {

        console.log(error);

      }

    };


  // LOAD
  useEffect(() => {

    fetchRooms();

    fetchJoinedRooms();

  }, []);


  // SEARCH
  const searchUsers =
    async (value) => {

      setSearchText(value);

      if (!value.trim()) {

        setSearchResults({

          users: [],

          rooms: [],

        });

        return;

      }

      try {

        const response =
          await API.get(
            `/users/search?query=${value}`
          );

        const users =
          response.data.users || [];

        const rooms =
          response.data.rooms || [];


        const filteredUsers =
          users.filter(
            (user) =>

              user.username
                ?.trim()
                .toLowerCase() !==

              currentUser
                ?.trim()
                .toLowerCase()
          );


        setSearchResults({

          users:
          filteredUsers,

          rooms,

        });

      } catch (error) {

        console.log(
          "Search Error:",
          error
        );

      }

    };


  // SELECT ROOM
  const selectRoom =
    (roomName) => {

      const selectedRoom =
        rooms.find(
          (room) =>
            room.roomName ===
            roomName
        );

      // CREATOR
      if(
        selectedRoom?.createdBy ===
        currentUser
      ) {

        setChatType("room");

        setRoom(roomName);

        return;

      }

      // JOIN CHECK
      if(
        !joinedRooms.includes(
          roomName
        )
      ) {

        toast.error(
          "Join room first 💖"
        );

        return;

      }

      setChatType("room");

      setRoom(roomName);

    };


  // JOIN ROOM
  const joinRoom =
    async (roomName) => {

      try {

        await API.post(
          "/rooms/join",
          {

            roomName,

            username:
            currentUser,

          }
        );

        toast.success(
          `Joined ${roomName} 💖`
        );

        fetchJoinedRooms();

      } catch (error) {

        toast.error(
          error.response?.data?.message ||
          "Already Joined"
        );

      }

    };


  // PRIVATE CHAT USERS
  const filteredUsers =
    privateChats.map(
      (chatUser) => {

        const onlineUser =
          onlineUsers.find(
            (u) =>

              u.username
              .toLowerCase() ===

              chatUser
              .toLowerCase()
          );

        return {

          username:
          chatUser,

          online:
          !!onlineUser,

          profilePic:
          onlineUser?.profilePic || "",

        };

      }
    );


  // PROFILE UPLOAD
  const uploadProfile =
    async (e) => {

      const file =
        e.target.files[0];

      if(!file) return;

      const formData =
        new FormData();

      formData.append(
        "profilePic",
        file
      );

      formData.append(
        "username",
        currentUser
      );

      try {

        const response =
          await API.post(
            "/users/upload-profile",
            formData
          );

        const updatedUser = {

          ...JSON.parse(
            localStorage.getItem("user")
          ),

          profilePic:
          response.data.profilePic,

        };

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );

        toast.success(
          "Profile Updated 💖"
        );

        window.location.reload();

      } catch (error) {

        console.log(error);

      }

    };


  return (

    <div className="sidebar">


      {/* MODAL */}
      {
        showModal && (

          <CreateRoomModal

            closeModal={() =>
              setShowModal(false)
            }

            fetchRooms={
              fetchRooms
            }

            currentUser={
              currentUser
            }

          />

        )
      }


      {/* TOP */}
      <div className="sidebar-top">

        <h2>
          ChatVerse
        </h2>

        <button

          className="create-room-btn"

          onClick={() =>
            setShowModal(true)
          }
        >

          <FaPlus />

        </button>

      </div>


      {/* SEARCH */}
      <div className="search-box">

        <FaSearch />

        <input

          type="text"

          placeholder=
          "Search users..."

          value={searchText}

          onChange={(e) =>
            searchUsers(
              e.target.value
            )
          }

        />

      </div>


      {/* SEARCH RESULTS */}
      {
        (
          searchResults.users.length > 0 ||

          searchResults.rooms.length > 0
        ) && (

          <div className="search-results">


            {/* USERS */}
            {
              searchResults.users.length > 0 && (

                <>

                  <h5 className="search-heading">

                    Users

                  </h5>

                  {
                    searchResults.users.map(
                      (user, index) => (

                        <div

                          key={index}

                          className="search-user"

                          onClick={() => {

                            startPrivateChat(
                              user.username
                            );

                            setSearchText("");

                            setSearchResults({

                              users: [],

                              rooms: [],

                            });

                          }}
                        >

                          <div className="search-left">

                            {
                              user.profilePic

                              ? (

                                <img
                                  src={
                                    user.profilePic
                                  }
                                  alt=""
                                />

                              ) : (

                                <div className="search-avatar">

                                  {
                                    user.username
                                    .charAt(0)
                                    .toUpperCase()
                                  }

                                </div>

                              )
                            }

                            <span>
                              {user.username}
                            </span>

                          </div>

                        </div>

                      )
                    )
                  }

                </>

              )
            }


            {/* ROOMS */}
            {
              searchResults.rooms.length > 0 && (

                <>

                  <h5 className="search-heading">

                    Rooms

                  </h5>

                  {
                    searchResults.rooms.map(
                      (roomItem, index) => (

                        <div

                          key={index}

                          className="search-user"

                          onClick={() => {

                            selectRoom(
                              roomItem.roomName
                            );

                            setSearchText("");

                            setSearchResults({

                              users: [],

                              rooms: [],

                            });

                          }}
                        >

                          <div className="search-left">

                            <div className="search-room-icon">

                              #

                            </div>

                            <span>

                              {roomItem.roomName}

                            </span>

                          </div>

                        </div>

                      )
                    )
                  }

                </>

              )
            }

          </div>

        )
      }


      {/* TABS */}
      <div className="sidebar-tabs">


        <button

          className={
            activeTab === "public"
              ? "tab-btn active-tab"
              : "tab-btn"
          }

          onClick={() =>
            setActiveTab("public")
          }
        >

          <FaHashtag />

          Public

        </button>


        <button

          className={
            activeTab === "private"
              ? "tab-btn active-tab"
              : "tab-btn"
          }

          onClick={() =>
            setActiveTab("private")
          }
        >

          <FaUserFriends />

          Private

        </button>


        <button

          className={
            activeTab === "online"
              ? "tab-btn active-tab"
              : "tab-btn"
          }

          onClick={() =>
            setActiveTab("online")
          }
        >

          <FaCircle />

          Online

        </button>

      </div>


      {/* SCROLL */}
      <div className="sidebar-scroll">


        {/* PUBLIC */}
        {
          activeTab === "public" && (

            <div className="sidebar-section">

              <h4>
                Public Rooms
              </h4>

              <div className="rooms">

                {
                  rooms.length > 0
                    ? (

                      rooms.map(
                        (
                          item,
                          index
                        ) => (

                          <div
                            key={index}
                            className="room-card"
                          >

                            <div

                              className={
                                room ===
                                item.roomName

                                  ? "room active-room"

                                  : "room"
                              }

                              onClick={() =>
                                selectRoom(
                                  item.roomName
                                )
                              }
                            >

                              <div className="room-name-wrapper">

                                <span>
                                  # {item.roomName}
                                </span>

                                {
                                  notifications[
                                    item.roomName
                                  ]

                                  && (

                                    <div className="notification-badge">

                                      {
                                        notifications[
                                          item.roomName
                                        ]
                                      }

                                    </div>

                                  )
                                }

                              </div>

                            </div>


                            {
                              item.createdBy ===
                              currentUser

                              ? (

                                <button
                                  className="creator-btn"
                                >

                                  Created

                                </button>

                              )

                              : joinedRooms.includes(
                                  item.roomName
                                )

                                ? (

                                  <button
                                    className="joined-btn"
                                  >

                                    Joined

                                  </button>

                                )

                                : (

                                  <button

                                    className="join-btn"

                                    onClick={() =>
                                      joinRoom(
                                        item.roomName
                                      )
                                    }
                                  >

                                    <FaDoorOpen />

                                    Join

                                  </button>

                                )
                            }

                          </div>

                        )
                      )

                    ) : (

                      <p className="empty-text">

                        No Rooms

                      </p>

                    )
                }

              </div>

            </div>

          )
        }


        {/* PRIVATE */}
        {
          activeTab === "private" && (

            <div className="sidebar-section">

              <h4>
                Private Chats
              </h4>

              <div className="private-chats">

                {
                  filteredUsers.length > 0
                    ? (

                      filteredUsers.map(
                        (
                          user,
                          index
                        ) => (

                          <div

                            key={index}

                            className="private-chat"

                            onClick={() =>
                              startPrivateChat(
                                user.username
                              )
                            }
                          >

                            <div className="private-user-left">

                              {
                                user.profilePic

                                ? (

                                  <img

                                    src={
                                      user.profilePic
                                    }

                                    alt=""

                                    className=
                                    "private-user-img"
                                  />

                                ) : (

                                  <div className="private-avatar">

                                    {
                                      user.username
                                      .charAt(0)
                                      .toUpperCase()
                                    }

                                  </div>

                                )
                              }


                              <div className="private-user-info">

                                <h5>

                                  {user.username}

                                </h5>


                                {

                                  currentlyTypingUser ===
                                  user.username

                                  ? (

                                    <p className="typing-status">

                                      typing...

                                    </p>

                                  )

                                  : user.online

                                  ? (

                                    <p className="online-status">

                                      🟢 online

                                    </p>

                                  )

                                  : (

                                    <p className="offline-status">

                                      ⚫ offline

                                    </p>

                                  )
                                }

                              </div>

                            </div>


                            {
                              notifications[
                                [currentUser,
                                user.username]
                                .sort()
                                .join("_")
                              ]

                              && (

                                <div className="notification-badge">

                                  {
                                    notifications[
                                      [currentUser,
                                      user.username]
                                      .sort()
                                      .join("_")
                                    ]
                                  }

                                </div>

                              )
                            }

                          </div>

                        )
                      )

                    ) : (

                      <p className="empty-text">

                        No chats yet

                      </p>

                    )
                }

              </div>

            </div>

          )
        }


        {/* ONLINE */}
        {
          activeTab === "online" && (

            <div className="sidebar-section">

              <h4>
                Online Users
              </h4>

              <div className="online-users-list">

                {
                  onlineUsers.length > 0
                    ? (

                      onlineUsers

                      .filter(
                        (u) =>

                          u.username
                          .toLowerCase() !==

                          currentUser
                          .toLowerCase()
                      )

                      .map(
                        (
                          user,
                          index
                        ) => (

                          <div

                            key={index}

                            className=
                            "online-user-item"

                            onClick={() =>
                              startPrivateChat(
                                user.username
                              )
                            }
                          >

                            <div className="online-left">

                              {
                                user.profilePic

                                ? (

                                  <img

                                    src={
                                      user.profilePic
                                    }

                                    alt=""

                                    className=
                                    "online-profile-img"
                                  />

                                ) : (

                                  <div className="online-avatar">

                                    {
                                      user.username
                                      .charAt(0)
                                      .toUpperCase()
                                    }

                                  </div>

                                )
                              }

                              <span>

                                {user.username}

                              </span>

                            </div>

                            <div className="online-dot"></div>

                          </div>

                        )
                      )

                    ) : (

                      <p className="empty-text">

                        No users online

                      </p>

                    )
                }

              </div>

            </div>

          )
        }

      </div>


      {/* PROFILE */}
      <div className="profile-section">


        <label
          htmlFor="profileUpload"
          className="profile-upload"
        >

          {
            JSON.parse(
              localStorage.getItem("user")
            )?.profilePic

            ? (

              <img

                src={
                  JSON.parse(
                    localStorage.getItem("user")
                  )?.profilePic
                }

                alt=""

                className="profile-img"
              />

            ) : (

              <div className="profile-avatar">

                {
                  currentUser
                  .charAt(0)
                  .toUpperCase()
                }

              </div>

            )
          }

        </label>


        <input

          type="file"

          id="profileUpload"

          hidden

          onChange={uploadProfile}

        />


        <div>

          <h5>
            {currentUser}
          </h5>

          <span>
            Online
          </span>

        </div>

      </div>

    </div>

  );

}

export default Sidebar;