import "./ChatWindow.css";

import {
  useEffect,
  useRef,
} from "react";


function ChatWindow({

  currentMessage,
  setCurrentMessage,

  sendMessage,

  messages,

  user,

  room,

  typingUser,

  chatType,

  privateUser,

}) {

  const messagesEndRef =
    useRef(null);


  // AUTO SCROLL
  useEffect(() => {

    messagesEndRef.current
    ?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);


  // ENTER KEY SEND
  const handleKeyPress = (e) => {

    if (e.key === "Enter") {

      sendMessage();

    }

  };


  return (

    <div className="chat-window">

      {/* HEADER */}
      <div className="chat-header">

        <div>

          <h2>

            {
              chatType === "room"

              ? `# ${room}`

              : `💖 ${privateUser}`
            }

          </h2>

          <p>
            Realtime conversation
          </p>

        </div>

      </div>


      {/* MESSAGES */}
      <div className="messages">

        {
          messages.map((msg, index) => (

            <div
              key={index}

              className={
                msg.author === user.username

                ? "message own-message"

                : "message"
              }
            >

              <strong>
                {msg.author}
              </strong>

              <p className="message-text">
                {msg.message}
              </p>

              <span>
                {msg.time}
              </span>

            </div>

          ))
        }


        {/* AUTO SCROLL */}
        <div ref={messagesEndRef}></div>

      </div>


      {/* TYPING */}
      {
        typingUser && (

          <div className="typing-text">

            {typingUser}

          </div>

        )
      }


      {/* INPUT */}
      <div className="chat-input">

        <input
          type="text"

          placeholder="Type your message..."

          value={currentMessage}

          onChange={(e) =>
            setCurrentMessage(
              e.target.value
            )
          }

          onKeyDown={handleKeyPress}
        />


        <button onClick={sendMessage}>

          Send

        </button>

      </div>

    </div>

  );
}

export default ChatWindow;