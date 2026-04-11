import Footer from "../components/layout/Footer.jsx";
import "../styles/login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost/backend/controllers/authController.php"; 

function Login() {
  const [activeForm, setActiveForm] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        navigate(data.user.role === "admin" ? "/admin" : "/");
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
        setError(""); // clear any leftover error
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
      <section className="login-section">
        {/* LOGIN */}
        <div className={`form-box ${activeForm === "login" ? "active" : ""}`}>
          <form onSubmit={handleLogin}>
            <h2>Welcome Back!</h2>
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

            <input
              type="password"
              placeholder="Password"
              className="input1"
              required
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />

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
            <h2>Register</h2>
            <input
              type="text"
              placeholder="First Name"
              className="input1"
              required
              value={registerData.first_name}
              onChange={(e) =>
                setRegisterData({ ...registerData, first_name: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Last Name"
              className="input1"
              required
              value={registerData.last_name}
              onChange={(e) =>
                setRegisterData({ ...registerData, last_name: e.target.value })
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

            <input
              type="password"
              placeholder="Password"
              className="input1"
              required
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
            />
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
      </section>

      <Footer />
    </>
  );
}

export default Login;
