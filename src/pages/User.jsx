import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/user.css';
import Navbar2 from "../components/layout/Navbar2.jsx";
import Newsletter from "../components/layout/Newsletter";
import Footer from "../components/layout/Footer.jsx";

function User() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login"); // 👈 redirect guests away
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <>
      <Navbar2/>
      <main className="profile-container">
        <aside className="glass-card sidebar">
          <div className="profile-pic">
            <img src="userprofile.jpg" alt="Profile" />
          </div>
          <h3>Welcome Back, {user.first_name}!</h3> {/* 👈 show name */}
          <ul className="side-links">
            <li><i className="ri-edit-box-line" /> Edit Profile</li>
            <li><i className="ri-user-line" /> My Account</li>
            <li><i className="ri-shopping-cart-line" /> Order History</li>
            <li onClick={handleLogout} style={{ cursor: "pointer" }}>
              <i className="ri-logout-box-r-line" /> Logout {/* 👈 works now */}
            </li>
          </ul>
        </aside>
        <section className="glass-card profile-form">
          <h2>My Profile</h2>
          <p>Manage and protect your account</p>
          <form id="profileForm">
            <div className="input-group">
              <label>First Name</label>
              <input type="text" defaultValue={user.first_name} placeholder="First Name" />
            </div>
            <div className="input-group">
              <label>Last Name</label>
              <input type="text" defaultValue={user.last_name} placeholder="Last Name" />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input type="email" defaultValue={user.email} placeholder="Email" />
            </div>
            <button type="submit" className="save-btn">Save changes</button>
          </form>
        </section>
      </main>
      <Newsletter/>
      <Footer/>
      </>
        
  );
}

export default User;