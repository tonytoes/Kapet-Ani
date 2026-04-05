import '../styles/login.css'
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Login() {
  const [activeForm, setActiveForm] = useState("login");
  const [error, setError]           = useState("");
  const navigate                    = useNavigate();
  const location                    = useLocation();

  const from = location.state?.from || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('login', true);

    const res  = await fetch("http://localhost/backend/controllers/auth.php", {
      method: "POST",
      body: formData,
      credentials: "include"
    });
    const data = await res.json();

    if (data.success) {
      localStorage.setItem("user", JSON.stringify(data.user));

      // redirect based on role
      if (data.user.role === 'admin' || data.user.role === 'superadmin') {
        navigate("/admin");
      } else {
        navigate(from); 
      }
    } else {
      setError(data.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('register', true);

    const res  = await fetch("http://localhost/backend/controllers/auth.php", {
      method: "POST",
      body: formData,
      credentials: "include"
    });
    const data = await res.json();

    if (data.success) {
      setError("");
      setActiveForm("login");
    } else {
      setError(data.message);
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

            {error && <p className="error">{error}</p>}

            <input type="email"    name="email"    placeholder="Email"    required />
            <input type="password" name="password" placeholder="Password" required />

            <button type="submit">Login</button>
            <p>
              Don't have an account?{" "}
              <a href="#" onClick={() => { setActiveForm("register"); setError(""); }}>
                Register
              </a>
            </p>
          </form>
        </div>

        {/* REGISTER */}
        <div className={`form-box ${activeForm === "register" ? "active" : ""}`}>
          <form onSubmit={handleRegister}>
            <h2>Register</h2>

            {error && <p className="error">{error}</p>}

            <input type="text"     name="first_name" placeholder="First Name" required />
            <input type="text"     name="last_name"  placeholder="Last Name"  required />
            <input type="email"    name="email"       placeholder="Email"      required />
            <input type="password" name="password"    placeholder="Password"   required />

            <button type="submit">Register</button>
            <p>
              Already have an account?{" "}
              <a href="#" onClick={() => { setActiveForm("login"); setError(""); }}>
                Login
              </a>
            </p>
          </form>
        </div>
      </section>
    </>
  );
}

export default Login;