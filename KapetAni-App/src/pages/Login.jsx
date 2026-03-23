import Footer from "../components/layout/Footer.jsx";
import '../styles/login.css'
import { useState } from "react";

function Login() {
  const [activeForm, setActiveForm] = useState("login");
  return (
    <>
      <section className="login-section">
        {/* LOGIN */}
        <div className={`form-box ${activeForm === "login" ? "active" : ""}`}>
          <form>
            <h2>Welcome Back!</h2>
            <p>Please login to your account</p>

            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />

            <button type="submit">Login</button>

            <p>
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
          <form>
            <h2>Register</h2>

            <input type="text" placeholder="First Name" required />
            <input type="text" placeholder="Last Name" required />
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />

            <select required>
              <option value="">--Select Role--</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <button type="submit">Register</button>

            <p>
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
