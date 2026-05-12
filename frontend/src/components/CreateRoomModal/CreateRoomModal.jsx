import "./CreateRoomModal.css";

import {
  useState,
} from "react";

import API from "../../services/api";

import { toast }
from "react-toastify";


function CreateRoomModal({

  closeModal,

  fetchRooms,

  currentUser,

}) {

  const [roomName,
  setRoomName] =
  useState("");


  const createRoom =
  async () => {

    if(!roomName.trim())
      return;

    try {

      await API.post(
        "/rooms/create",
        {

          roomName,

          createdBy:
          currentUser,

        }
      );

      toast.success(
        "Room Created 💖"
      );

      fetchRooms();

      closeModal();

    } catch (error) {

      toast.error(
        "Room Exists"
      );

    }

  };


  return (

    <div className="modal-overlay">

      <div className="modal-card">

        <h2>
          Create Room
        </h2>

        <input
          type="text"

          placeholder=
          "Enter room name"

          value={roomName}

          onChange={(e)=>
            setRoomName(
              e.target.value
            )
          }
        />

        <div className="modal-buttons">

          <button
            onClick={closeModal}
            className="cancel-btn"
          >
            Cancel
          </button>

          <button
            onClick={createRoom}
          >
            Create
          </button>

        </div>

      </div>

    </div>

  );

}

export default
CreateRoomModal;