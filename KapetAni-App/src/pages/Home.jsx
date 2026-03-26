import { useEffect } from "react";
import mangofrappe from '../assets/images/mangofrappe.png';
import ubefrappe from '../assets/images/ubefrappe.png';
import basket1 from '../assets/images/basket1.png';
import basket2 from '../assets/images/basket2.png';
import basket3 from '../assets/images/basket3.png';
import basket4 from '../assets/images/basket4.png';
import basket5 from '../assets/images/basket5.png';
import basket6 from '../assets/images/basket6.webp';
import basket7 from '../assets/images/basket7.webp';
import mug1 from '../assets/images/mug1.png';
import mug2 from '../assets/images/mug2.png';
import parallax from '../assets/images/parallax.png';
import '../styles/home.css';
import Navbar from '../components/layout/Navbar.jsx';
import Newsletter from "../components/layout/Newsletter.jsx"; 
import Footer from '../components/layout/Footer.jsx';


function Home() {

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
    <div className="App">
        <>
         <Navbar activePage="home"/>

          {/* HERO */}
          <section className="hero">
            <div className="hero-bg" />
            <div className="hero-overlay" />
            <div className="hero-content">
              <p className="hero-eyebrow">Est. 1996 &nbsp;·&nbsp; Filipino Heritage</p>
              <h1 className="hero-headline">
                Every cup of Kape't Pamana brews
                <br />
                <em>Filipino heritage and craftsmanship,</em>
                <br />
                served with pride.
              </h1>
              <a href="#featured" className="btn-primary">Explore Our Products</a>
            </div>
            <div className="scroll-hint">
              <div className="scroll-arrow" />
              Scroll
            </div>
          </section>

          {/* FEATURED PRODUCTS */}
          <section className="featured" id="featured">
            <div className="section-header fade-up">
              <div className="section-rule">
                <span className="section-label">Featured Products</span>
              </div>
            </div>
            <div className="featured-grid">
              <div className="product-card fade-up">
                <div className="product-img">
                  <img src={mangofrappe} alt="Coffee-5 Mango Frappe" />
                  <span className="on-sale-badge">On Sale.</span>
                </div>
                <div className="product-info">
                  <p className="product-name">Coffee-5</p>
                  <p className="product-price">
                    <s>$46.00 USD</s>
                    <span>$46.00 USD</span>
                  </p>
                </div>
              </div>
              <div className="product-card fade-up" style={{ transitionDelay: "0.1s" }}>
                <div className="product-img">
                  <img src={ubefrappe} alt="Coffee-4 Ube Frappe" />
                  <span className="on-sale-badge">On Sale.</span>
                </div>
                <div className="product-info">
                  <p className="product-name">Coffee-4</p>
                  <p className="product-price">
                    <s>$25.00 USD</s>
                    <span>$25.00 USD</span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* MORE PRODUCTS */}
          <section className="more-products">
            <div className="section-header fade-up">
              <div className="section-rule">
                <span className="section-label">More Products</span>
              </div>
            </div>
            <div className="products-grid">
              <div className="product-card fade-up">
                <div className="product-img">
                  <img src={basket1} alt="craft-12 basket" />
                  <span className="on-sale-badge">On Sale.</span>
                </div>
                <div className="product-info">
                  <p className="product-name">craft-12 basket</p>
                  <p className="product-price"><s>$99.00 USD</s><span>$99.00 USD</span></p>
                </div>
              </div>
              <div className="product-card fade-up" style={{ transitionDelay: "0.08s" }}>
                <div className="product-img">
                  <img src={basket2} alt="craft-11 basket" />
                  <span className="on-sale-badge">On Sale.</span>
                </div>
                <div className="product-info">
                  <p className="product-name">craft-11 basket</p>
                  <p className="product-price"><s>$99.00 USD</s><span>$99.00 USD</span></p>
                </div>
              </div>
              <div className="product-card fade-up" style={{ transitionDelay: "0.16s" }}>
                <div className="product-img">
                  <img src={basket3} alt="craft-10 basket" />
                  <span className="on-sale-badge">On Sale.</span>
                </div>
                <div className="product-info">
                  <p className="product-name">craft-10 basket</p>
                  <p className="product-price"><s>$99.00 USD</s><span>$99.00 USD</span></p>
                </div>
              </div>
              <div className="product-card fade-up" style={{ transitionDelay: "0.04s" }}>
                <div className="product-img">
                  <img src={basket4} alt="craft-9 basket" />
                  <span className="on-sale-badge">On Sale.</span>
                </div>
                <div className="product-info">
                  <p className="product-name">craft-9 basket Cop</p>
                  <p className="product-price"><s>$99.00 USD</s><span>$99.00 USD</span></p>
                </div>
              </div>
              <div className="product-card fade-up" style={{ transitionDelay: "0.12s" }}>
                <div className="product-img">
                  <img src={basket5} alt="craft-8 bag" />
                  <span className="on-sale-badge">On Sale.</span>
                </div>
                <div className="product-info">
                  <p className="product-name">craft-8 bag</p>
                  <p className="product-price"><s>$99.00 USD</s><span>$99.00 USD</span></p>
                </div>
              </div>
              <div className="product-card fade-up" style={{ transitionDelay: "0.2s" }}>
                <div className="product-img">
                  <img src={basket6} alt="craft-9" />
                  <span className="on-sale-badge">On Sale.</span>
                </div>
                <div className="product-info">
                  <p className="product-name">craft-9</p>
                  <p className="product-price"><s>$99.00 USD</s><span>$99.00 USD</span></p>
                </div>
              </div>
              <div className="product-card fade-up" style={{ transitionDelay: "0.06s" }}>
                <div className="product-img">
                  <img src={basket7} alt="craft-8" />
                  <span className="on-sale-badge">On Sale.</span>
                </div>
                <div className="product-info">
                  <p className="product-name">craft-8</p>
                  <p className="product-price"><s>$99.00 USD</s><span>$99.00 USD</span></p>
                </div>
              </div>
              <div className="product-card fade-up" style={{ transitionDelay: "0.14s" }}>
                <div className="product-img">
                  <img src={mug1} alt="Clay Pot mug 2" />
                  <span className="on-sale-badge">On Sale.</span>
                </div>
                <div className="product-info">
                  <p className="product-name">Clay Pot mug 2</p>
                  <p className="product-price"><s>$24.00 USD</s><span>$24.00 USD</span></p>
                </div>
              </div>
              <div className="product-card fade-up" style={{ transitionDelay: "0.22s" }}>
                <div className="product-img">
                  <img src={mug2} alt="Clay-Pot-mug" />
                  <span className="on-sale-badge">On Sale.</span>
                </div>
                <div className="product-info">
                  <p className="product-name">Clay-Pot-mug</p>
                  <p className="product-price"><s>$24.00 USD</s><span>$24.00 USD</span></p>
                </div>
              </div>
            </div>
          </section>

          {/* PRODUCT VOUCHERS */}
          <section className="vouchers">
            <div className="section-header fade-up">
              <div className="section-rule">
                <span className="section-label">Product Vouchers</span>
              </div>
            </div>
            <div className="voucher-inner">
              <div className="voucher-gallery fade-up">
                <img className="big" src="https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&q=80" alt="Voucher promo" />
                <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80" alt="Coffee cup" />
                <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80" alt="Espresso" />
              </div>
              <div className="voucher-text fade-up" style={{ transitionDelay: "0.15s" }}>
                <h2>ChoosDay Promo</h2>
                <p>
                  Tune in for the next ChoosDay Promo!
                  <br />
                  (Tuesday 8:00–9:00 pm)
                </p>
                <a href="#" className="btn-primary">Start Shopping</a>
              </div>
            </div>
          </section>

          {/* PARALLAX BANNER */}
          <div className="banner-parallax" style={{ backgroundImage: `url(${parallax})` }}>
            <div className="banner-parallax-overlay" />
          </div>

          {/* LIFESTYLE STORIES / BLOG */}
          <section className="blogs">
            <div className="section-header fade-up">
              <div className="section-rule">
                <span className="section-label">Lifestyle Stories</span>
              </div>
            </div>
            <div className="blog-grid">
              <div className="blog-card fade-up">
                <div className="blog-img">
                  <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&q=80" alt="Coffee shop interior" />
                </div>
                <p className="blog-title">Health Check: why do I get a headache when I haven't had my coffee?</p>
                <p className="blog-excerpt">It is a paradisematic country, in which roasted parts of sentences fly into your mouth.</p>
                <p className="blog-date">October 9, 2018</p>
              </div>
              <div className="blog-card fade-up" style={{ transitionDelay: "0.1s" }}>
                <div className="blog-img">
                  <img src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=700&q=80" alt="Barista at work" />
                </div>
                <p className="blog-title">How long does a cup of coffee keep you awake?</p>
                <p className="blog-excerpt">It is a paradisematic country, in which roasted parts. Vel qui et ad voluptatem.</p>
                <p className="blog-date">October 9, 2018</p>
              </div>
              <div className="blog-card fade-up" style={{ transitionDelay: "0.2s" }}>
                <div className="blog-img">
                  <img src="https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=700&q=80" alt="Coffee and pour over" />
                </div>
                <p className="blog-title">Recent research suggests that heavy coffee drinkers may reap health benefits.</p>
                <p className="blog-excerpt">It is a paradisematic country, in which roasted parts of sentences fly into your mouth.</p>
                <p className="blog-date">October 9, 2018</p>
              </div>
            </div>
          </section>

          <Newsletter style={{backgroundColor: 'white' }}/>
          <Footer/>
        </>
    </div>
  );
}

export default Home;