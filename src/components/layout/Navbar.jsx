import { useEffect, useState } from "react";
import logo from "../../assets/images/logo.png";
import logo1 from "../../assets/images/logo_brown_transparent.png";
import "../../styles/navbar.css";
import CartDrawer from "../layout/CartDrawer";

function Navbar({ activePage }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null); 
  const showAdminShortcut = ["admin", "superadmin"].includes((user?.role || "").toLowerCase());
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const navbar = document.getElementById("navbar");
    const handleScroll = () => {
      const scrolled = window.scrollY > 60;
      setIsScrolled(scrolled);
      if (navbar) navbar.classList.toggle("scrolled", scrolled);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav id="navbar">
        <div className="nav-inner">
          <a href="/" className="logo">
            <img src={isScrolled ? logo1 : logo} height={70} />
            <span className="logo-text">Kape't Pamana</span>
          </a>

          <ul className="nav-links">
            <li><a href="/" className={activePage === "home" ? "active" : ""}>Home</a></li>
            <li><a href="/product" className={activePage === "product" ? "active" : ""}>Our Products</a></li>
            <li><a href="/blogs" className={activePage === "blogs" ? "active" : ""}>Blogs</a></li>
            <li><a href="/contact" className={activePage === "contact" ? "active" : ""}>Contact</a></li>
            <li><a href="/about" className={activePage === "about" ? "active" : ""}>About</a></li>
          </ul>

          <div className="nav-actions gap-2">
            
            <a href={user ? "/user" : "/login"} className="nav-icon">
              <svg width={26} height={26} viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </a>
            {showAdminShortcut && (
              <a href="/admin" className="nav-admin-btn" title="Open Admin Panel">
                Admin
              </a>
            )}

            <div className="nav-cart1 d-flex align-items-center gap-1" onClick={() => setIsCartOpen(true)}>
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1={3} y1={6} x2={21} y2={6} />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              CART
              <div className="cart-badge">1</div>
            </div>
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

export default Navbar;