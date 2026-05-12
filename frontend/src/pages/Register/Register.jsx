import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import API from "../../services/api";

import { toast } from "react-toastify";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await API.post(
        "/auth/register",
        formData
      );

      toast.success(response.data.message);

      navigate("/login");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Registration Failed"
      );

    }

  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>Create Account ✨</h1>

        <p>
          Join ChatVerse and start realtime chatting.
        </p>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          <input
            type="text"
            placeholder="Enter username"
            name="username"
            onChange={handleChange}
          />

          <input
            type="email"
            placeholder="Enter email"
            name="email"
            onChange={handleChange}
          />

          <input
            type="password"
            placeholder="Enter password"
            name="password"
            onChange={handleChange}
          />

          <button type="submit">
            Register
          </button>

        </form>

        <div className="auth-bottom">

          Already have an account?

          <Link to="/login">
            Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;