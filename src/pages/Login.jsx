import Footer from "../components/layout/Footer.jsx";
import "../styles/login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [activeForm, setActiveForm] = useState("login");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch(
      "http://localhost/backend/controllers/authController.php", // Update with domain name http://localhost/backend/controllers/authController.php
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "login",
          ...loginData,
        }),
      },
    );

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      alert(data.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch(
      "http://localhost/backend/controllers/authController.php", // Update with domain name http://localhost/backend/controllers/authController.php
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "register",
          ...registerData,
        }),
      },
    );

    const data = await res.json();

    if (data.success) {
      alert("Registered successfully!");
      setActiveForm("login");
    } else {
      alert(data.message);
    }
  };

  return (
    <>
      <section className="login-section">
        {/* LOGIN */}
        <div className={`form-box ${activeForm === "login" ? "active" : ""}`}>
          <form onSubmit={handleLogin}>
            <h2>Welcome Back!</h2>
            <p>Please login to your account</p>

            <input
              type="email"
              placeholder="Email"
                    className="input1"
              required
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
                    className="input1"
              required
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />

            <button type="submit" className="button1">Login</button>

            <p className="p">
              Don't have an account?{" "}
              <a href="#" onClick={() => setActiveForm("register")}>
                Register
              </a>
            </p>
          </form>
        </div>

        {/* REGISTER */}
        <div
          className={`form-box ${activeForm === "register" ? "active" : ""}`}
        >
          <form onSubmit={handleRegister}>
            <h2>Register</h2>

            <input
              type="text"
              placeholder="First Name"
                    className="input1"
              required
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  first_name: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Last Name"
                    className="input1"
              required
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  last_name: e.target.value,
                })
              }
            />

            <input
              type="email"
              placeholder="Email"
              className="input1"
              required
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  email: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="input1"
              required
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  password: e.target.value,
                })
              }
            />

            <button type="submit" className="button1">Register</button>

            <p className="p">
              Already have an account?{" "}
              <a href="#" onClick={() => setActiveForm("login")}>
                Login
              </a>
            </p>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Login;
