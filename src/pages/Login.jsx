import "../styles/login.css";
import logo from "../assets/images/logo.png";
import lady from "../assets/images/lady.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LINK_PATH } from "../admin/data/LinkPath.jsx";

const API = `${LINK_PATH}authController.php`;

function EyeIcon({ open }) {
  return open ? (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2 12C3.8 8.2 7.5 6 12 6C16.5 6 20.2 8.2 22 12C20.2 15.8 16.5 18 12 18C7.5 18 3.8 15.8 2 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ) : (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 3L21 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10.6 6.2C11.1 6.07 11.55 6 12 6C16.5 6 20.2 8.2 22 12C21.15 13.79 19.85 15.28 18.23 16.37"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.1 7.9C4.39 8.99 3.01 10.43 2 12C3.8 15.8 7.5 18 12 18C13.81 18 15.48 17.64 16.94 16.99"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.9 9.9C9.36 10.44 9 11.18 9 12C9 13.66 10.34 15 12 15C12.82 15 13.56 14.64 14.1 14.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Login() {
  const [activeForm, setActiveForm] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

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
    setError("");
    setLoading(true);

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", ...loginData }),
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Non-JSON response:", text);
        setError("Server error. Please try again.");
        return;
      }

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (registerData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register", ...registerData }),
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Non-JSON response:", text);
        setError("Server error. Please try again.");
        return;
      }

      if (data.success) {
        setActiveForm("login");
        setError("");
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Register error:", err);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-page">
        <div className="login-left">
          <div className="login-bg">
            <div className="login-overlay d-flex flex-column justify-content-center">
              <div className="position-absolute top-0 start-0 p-4 px-5 py-4">
                <a href="/">
                  <img src={logo} height={70} />
                  <span className="logo-text">Kape't Pamana</span>
                </a>
              </div>
              <div className="d-flex align-items-center justify-content-center">
                <div className="accent-line"></div>
                <h1
                  className="fw-bold lh-sm px-5"
                  style={{ fontSize: "72px", color: "#F5EFE6" }}
                >
                  Discover.
                  <br />
                  Culture &<br />
                  <span className="accent-text">Tradition.</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
        {/* LOGIN */}

        <div className="login-right">
          <div className="login-wrapper">
            <div className="login-tabs">
              <button
                className={`login-tab ${activeForm === "register" ? "active" : ""}`}
                onClick={() => {
                  setActiveForm("register");
                  setError("");
                }}
              >
                Register
              </button>
              <button
                className={`login-tab ${activeForm === "login" ? "active" : ""}`}
                onClick={() => {
                  setActiveForm("login");
                  setError("");
                }}
              >
                Sign in
              </button>
            </div>
            <div
              className={`form-box ${activeForm === "login" ? "active" : ""}`}
            >
              <form onSubmit={handleLogin}>
                <h2 className="text-center fw-bold mb-4 text-caramel">Welcome Back!</h2>
                <p className="text-center">Please login to your account</p>
                {error && <p className="error-message">{error}</p>}

                <input
                  type="email"
                  placeholder="Email"
                  className="input1"
                  required
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                />

                <div className="password-input-wrap">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Password"
                    className="input1 password-input"
                    required
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                    aria-label={showLoginPassword ? "Hide password" : "Show password"}
                    title={showLoginPassword ? "Hide password" : "Show password"}
                  >
                    <EyeIcon open={showLoginPassword} />
                  </button>
                </div>

                <button type="submit" className="button1" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>

                <p className="p">
                  Don't have an account?{" "}
                  <a
                    href="#"
                    onClick={() => {
                      setActiveForm("register");
                      setError("");
                    }}
                  >
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
                <h2 className="text-center fw-bold mb-4 text-caramel">Register</h2>
                <input
                  type="text"
                  placeholder="First Name"
                  className="input1"
                  required
                  value={registerData.first_name}
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
                  value={registerData.last_name}
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
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                />

                <div className="password-input-wrap">
                  <input
                    type={showRegisterPassword ? "text" : "password"}
                    placeholder="Password"
                    className="input1 password-input"
                    required
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowRegisterPassword((prev) => !prev)}
                    aria-label={showRegisterPassword ? "Hide password" : "Show password"}
                    title={showRegisterPassword ? "Hide password" : "Show password"}
                  >
                    <EyeIcon open={showRegisterPassword} />
                  </button>
                </div>
                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="button1" disabled={loading}>
                  {loading ? "Registering..." : "Register"}
                </button>

                <p className="p">
                  Already have an account?{" "}
                  <a
                    href="#"
                    onClick={() => {
                      setActiveForm("login");
                      setError("");
                    }}
                  >
                    Login
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
