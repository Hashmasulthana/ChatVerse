import "./Landing.css";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

function Landing() {
  return (
    <div className="landing">

      <Navbar />

      <div className="overlay"></div>

      <div className="landing-content">

        <h1>
          Modern Realtime <span>Chat Platform</span>
        </h1>

        <p>
          Connect instantly with rooms, private chats,
          live typing indicators and realtime messaging.
        </p>

        <div className="landing-buttons">

          <Link to="/login">
            <button className="login-btn">
              Start Chatting
            </button>
          </Link>

          <Link to="/register">
            <button className="register-btn">
              Create Account
            </button>
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Landing;