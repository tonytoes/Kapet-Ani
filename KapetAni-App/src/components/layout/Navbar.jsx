import { useEffect } from "react";
import logo from '../../assets/images/logo.png';
import '../../styles/navbar.css';

function Navbar({ activePage }) {
  useEffect(() => {
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
      if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav id="navbar">
      <div className="nav-inner">
        <a href="/" className="logo">
          <img src={logo} alt="Kape't Pamana" height={70} />
          <span className="logo-text">Kape't Pamana</span>
        </a>
        <ul className="nav-links">
          <li><a href="/" className={activePage === 'home' ? 'active' : ''}>Home</a></li>
          <li><a href="/products" className={activePage === 'products' ? 'active' : ''}>Our Products</a></li>
          <li><a href="/blogs" className={activePage === 'blogs' ? 'active' : ''}>Blogs</a></li>
          <li><a href="/reviews" className={activePage === 'reviews' ? 'active' : ''}>Reviews</a></li>
          <li><a href="/about" className={activePage === 'about' ? 'active' : ''}>About</a></li>
        </ul>
        <div className="nav-cart">
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1={3} y1={6} x2={21} y2={6} />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          Cart
          <div className="cart-badge">1</div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;