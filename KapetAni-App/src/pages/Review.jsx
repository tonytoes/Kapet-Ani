import logo from '../assets/images/logo.png';
import '../styles/review.css';
import Footer from '../components/layout/Footer.jsx';
import { useEffect } from "react";

function Review() {
    useEffect(() => {
    const navbar = document.getElementById('navbar');

    const handleScroll = () => {
      if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
      }
    };

    window.addEventListener('scroll', handleScroll);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12 });

    const elements = document.querySelectorAll('.fade-up');
    elements.forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      elements.forEach(el => observer.unobserve(el));
    };

  }, []);
  
  return (
    <>
      {/* NAV */}
      <nav id="navbar">
        <div className="nav-inner">
          <a href="#" className="logo">
            <img src={logo} alt="Kape't Pamana" height={70} />
          </a>
          <span className="logo-text">Kape't Pamana</span>
          <ul className="nav-links">
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">Our Products</a>
            </li>
            <li>
              <a href="#">Blogs</a>
            </li>
            <li>
              <a href="#">Reviews</a>
            </li>
            <li>
              <a href="#">About</a>
            </li>
          </ul>
          <div className="nav-cart">
            <svg
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1={3} y1={6} x2={21} y2={6} />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            Cart
            <div className="cart-badge">1</div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-eyebrow">
            Est. 1996 &nbsp;·&nbsp; Filipino Heritage
          </p>
          <h1 className="hero-headline">
            Every cup of Kape't Pamana brews
            <br />
            <em>Filipino heritage and craftsmanship,</em>
            <br />
            served with pride.
          </h1>
          <a href="#featured" className="btn-primary">
            Explore Our Products
          </a>
        </div>
        <div className="scroll-hint">
          <div className="scroll-arrow" />
          Scroll
        </div>
      </section>


      <div className="review-content">
        <div className="deco-block">
          <div className="wrap">
            <div className="review-headline">
              <h1 className="text-center">Let's Connect</h1>
              <p className="text-center fs-5 lh-base">We’d love to hear from you! Your thoughts, experiences, and feedback help us grow and continue delivering meaningful coffee and cultural products. Share your reviews, suggestions, and stories with us, and let us know how Kape’t Ani has become part of your daily rituals.</p>
            </div>
          </div>
        </div>
      </div>


      <Footer/>
    </>
  );
}


export default Review;