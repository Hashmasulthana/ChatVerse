import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        Chat<span>Verse</span>
      </div>

      <div className="nav-links">

        <Link to="/login">
          <button className="nav-login">
            Login
          </button>
        </Link>

        <Link to="/register">
          <button className="nav-register">
            Register
          </button>
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;