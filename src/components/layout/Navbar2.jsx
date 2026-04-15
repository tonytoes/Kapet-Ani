import { useEffect, useState } from "react";
import logo1 from "../../assets/images/logo_brown_transparent.png";
import "../../styles/navbar2.css";
import CartDrawer from "../layout/CartDrawer";
import { getCartCount, getCartItems } from "../../utils/cart";
import { LINK_PATH } from "../../admin/data/LinkPath.jsx";

function Navbar({ activePage }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [cartCount, setCartCount] = useState(() => getCartCount(getCartItems()));
  const showAdminShortcut = ["staff","admin", "superadmin"].includes((user?.role || "").toLowerCase());

  useEffect(() => {
    const syncUser = () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setUser(null);
        setAvatarUrl("");
        return;
      }
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        if (parsed?.id) {
          const avatarVersion = encodeURIComponent(parsed.image_name || parsed.updated_at || parsed.email || parsed.id);
          setAvatarUrl(`${LINK_PATH}getImage.php?id=${parsed.id}&size=48&v=${avatarVersion}`);
        } else {
          setAvatarUrl("");
        }
      } catch {
        setUser(null);
        setAvatarUrl("");
      }
    };
    syncUser();
    window.addEventListener("storage", syncUser);
    window.addEventListener("userUpdated", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("userUpdated", syncUser);
    };
  }, []);

  useEffect(() => {
    const sync = () => setCartCount(getCartCount(getCartItems()));
    window.addEventListener("cart:updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cart:updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <>
      <nav id="main-navbar">
        <div className="navbar-inner">
          <a href="/" className="logo">
            <img src={logo1} height={70} />
            <span className="logo-product">Kape't Pamana</span>
          </a>

          <ul className="nav-links">
            <li><a href="/" className={activePage === "home" ? "active" : ""}>Home</a></li>
            <li><a href="/product" className={activePage === "product" ? "active" : ""}>Our Products</a></li>
            <li><a href="/blogs" className={activePage === "blogs" ? "active" : ""}>Blogs</a></li>
            <li><a href="/contact" className={activePage === "contact" ? "active" : ""}>Contact</a></li>
            <li><a href="/about" className={activePage === "about" ? "active" : ""}>About</a></li>
          </ul>

          <div className="nav-actions">
            {showAdminShortcut && (
              <a href="/admin" className="nav-admin-btn2" title="Open Admin Panel">
                Admin
              </a>
            )}
            <a href={user ? "/user" : "/login"} className="nav-icon1 nav-avatar-link2">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="User avatar"
                  className="nav-avatar-img2"
                  width={32}
                  height={32}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  onError={() => setAvatarUrl("")}
                />
              ) : (
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </a>

            <div className="nav-cart" onClick={() => setIsCartOpen(true)}>
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1={3} y1={6} x2={21} y2={6} />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              CART
              <div className="cart-badge">{cartCount}</div>
            </div>
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

export default Navbar;