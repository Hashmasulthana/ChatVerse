import "./Login.css";

import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";

import API from "../../services/api";

import { toast } from "react-toastify";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
        "/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      toast.success("Login Successful 💖");

      navigate("/dashboard");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Login Failed"
      );

    }

  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>Welcome Back 💖</h1>

        <p>
          Login to continue chatting.
        </p>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

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
            Login
          </button>

        </form>

        <div className="auth-bottom">

          Don't have an account?

          <Link to="/register">
            Register
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;