import '../styles/blogs.css';
import { useEffect } from "react";
import anthonyy from '../assets/images/anthonyy.png';
import elaizaa from '../assets/images/elaizaa.jpg';
import reuel from '../assets/images/reuel.jpg';
import samuel from '../assets/images/samuel.jpg';
import jmm from '../assets/images/jmm.png';
import miura from '../assets/images/miura.png';
import logo from '../assets/images/logo.png';

function Blogs() {
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
    return (<><>
       
        {/* HERO */}
        <section className="blog-hero">
            <div className="blog-hero-bg" />
            <div className="blog-hero-overlay" />
            <div className="blog-hero-content">
                <h1>
                    Discover the stories behind every brew. Read our blogs and celebrate
                    Filipino heritage with us.
                </h1>
            </div>
        </section>
        {/* INTRO */}
        <section className="blog-intro">
            <h2>Read coffee stories on our Blog</h2>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                <br />
                Suspendisse varius enim in eros elementum tristique.
            </p>
        </section>
        {/* MAIN CONTENT */}
        <main className="blog-main">
            {/* LEFT: Posts */}
            <div className="blog-content">
                {/* FEATURED POSTS */}
                <div className="section-rule-wrap fade-up">
                    <div className="section-rule">
                        <span className="section-label">Featured Posts</span>
                    </div>
                </div>
                <div className="featured-posts fade-up">
                    <div className="featured-card">
                        <div className="featured-img-wrap">
                            <img
                                src="https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800&q=80"
                                alt="Will drinking coffee prolong your life?"
                            />
                            <div className="featured-img-overlay">
                                <span>Read the Full Story</span>
                            </div>
                        </div>
                        <p className="post-title">Will drinking coffee prolong your life?</p>
                        <p className="post-excerpt">
                            Aliquid aperiam accusantium quam ipsam. Velit rerum veniam optio
                            illo dolor delectus et recusandae. Impedit aut cupiditate. Illum
                            eveniet officiis ullam ipsam sed iste eius. Nam at quae ducimus
                            dicta delectus
                        </p>
                        <p className="post-date">October 9, 2018</p>
                    </div>
                    <div className="featured-card">
                        <div className="featured-img-wrap">
                            <img
                                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80"
                                alt="Health Check"
                            />
                            <div className="featured-img-overlay">
                                <span>Read the Full Story</span>
                            </div>
                        </div>
                        <p className="post-title">
                            Health Check: why do I get a headache when I haven't had my coffee?
                        </p>
                        <p className="post-excerpt">
                            It is a paradisematic country, in which roasted parts of sentences
                            fly into your mouth.
                        </p>
                        <p className="post-date">October 9, 2018</p>
                    </div>
                </div>
                {/* LATEST POSTS */}
                <div className="latest-section fade-up">
                    <h3 className="latest-heading">Latest Posts</h3>
                    <div className="latest-divider" />
                    <div className="latest-post">
                        <div className="latest-img-wrap">
                            <img
                                src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&q=80"
                                alt="More coffee, lower death risk?"
                            />
                        </div>
                        <div className="latest-text">
                            <p className="post-title">More coffee, lower death risk?</p>
                            <p className="post-excerpt">
                                Eveniet itaque aperiam qui officia in ducimus. Voluptas culpa ut
                                eligendi in. Minima est dolores dolore aut et alias p
                            </p>
                            <p className="post-date">October 9, 2018</p>
                        </div>
                    </div>
                    <div className="latest-post">
                        <div className="latest-img-wrap">
                            <img
                                src="https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&q=80"
                                alt="Will drinking coffee prolong your life?"
                            />
                        </div>
                        <div className="latest-text">
                            <p className="post-title">
                                Will drinking coffee prolong your life?
                            </p>
                            <p className="post-excerpt">
                                Aliquid aperiam accusantium quam ipsam. Velit rerum veniam optio
                                illo dolor delectus et recusandae.
                            </p>
                            <p className="post-date">October 9, 2018</p>
                        </div>
                    </div>
                    <div className="latest-post">
                        <div className="latest-img-wrap">
                            <img
                                src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400&q=80"
                                alt="Health Check"
                            />
                        </div>
                        <div className="latest-text">
                            <p className="post-title">
                                Health Check: why do I get a headache when I haven't had my
                                coffee?
                            </p>
                            <p className="post-excerpt">
                                It is a paradisematic country, in which roasted parts of sentences
                                fly into your mouth.
                            </p>
                            <p className="post-date">October 9, 2018</p>
                        </div>
                    </div>
                    <div className="latest-post">
                        <div className="latest-img-wrap">
                            <img
                                src="https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80"
                                alt="How long does a cup of coffee keep you awake?"
                            />
                        </div>
                        <div className="latest-text">
                            <p className="post-title">
                                How long does a cup of coffee keep you awake?
                            </p>
                            <p className="post-excerpt">
                                It is a paradisematic country, in which roasted parts. Vel qui et
                                ad voluptatem.
                            </p>
                            <p className="post-date">October 9, 2018</p>
                        </div>
                    </div>
                    <div className="latest-post">
                        <div className="latest-img-wrap">
                            <img
                                src="https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80"
                                alt="Recent research"
                            />
                        </div>
                        <div className="latest-text">
                            <p className="post-title">
                                Recent research suggests that heavy coffee drinkers may reap
                                health benefits.
                            </p>
                            <p className="post-excerpt">
                                It is a paradisematic country, in which roasted parts of sentences
                                fly into your mouth.
                            </p>
                            <p className="post-date">October 9, 2018</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* RIGHT: Sidebar */}
            <aside className="blog-sidebar fade-up">
                {/* About Us */}
                <div className="sidebar-block">
                    <h4 className="sidebar-heading">About Us</h4>
                    <div className="sidebar-divider" />
                    <p className="sidebar-brand-name">CoffeeStyle.</p>
                    <p className="sidebar-about-text">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                        varius enim in eros elementum tristique.
                    </p>
                    <a href="#" className="sidebar-link">
                        Read the full Story
                    </a>
                </div>
                {/* Categories */}
                <div className="sidebar-block">
                    <h4 className="sidebar-heading">Categories</h4>
                    <div className="sidebar-divider" />
                    <ul className="sidebar-categories">
                        <li>Barista</li>
                        <li>Coffee</li>
                        <li>Lifestyle</li>
                        <li>Mugs</li>
                    </ul>
                </div>
                {/* Authors */}
                <div className="sidebar-block">
                    <h4 className="sidebar-heading">Authors</h4>
                    <div className="sidebar-divider" />
                    <ul className="sidebar-authors">
                        <li>
                            <div className="author-avatar">
                                <img
                                    src={anthonyy}
                                    alt="Anthony"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </div>
                            <span>Anthony</span>
                        </li>
                        <li>
                            <div className="author-avatar">
                                <img
                                    src={elaizaa}
                                    alt="elaiza"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </div>
                            <span>Elaiza</span>
                        </li>
                        <li>
                            <div className="author-avatar">
                                <img
                                    src={reuel}
                                    alt="reuel"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </div>
                            <span>Reuel</span>
                        </li>
                        <li>
                            <div className="author-avatar">
                                <img
                                    src={samuel}
                                    alt="samuel"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </div>
                            <span>Samuel</span>
                        </li>
                        <li>
                            <div className="author-avatar">
                                <img
                                    src={jmm}
                                    alt="jm"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </div>
                            <span>Uayan</span>
                        </li>
                        <li>
                            <div className="author-avatar">
                                <img
                                    src={miura}
                                    alt="Anthony"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </div>
                            <span>Yu</span>
                        </li>
                    </ul>
                </div>
            </aside>
        </main>
        {/* QUOTE */}
        <section className="quote-section fade-up">
            <div className="quote-box">
                <p className="quote-text">
                    "I wake up some mornings and sit and have my coffee and look out at my
                    beautiful garden, and I go, 'Remember how good this is. Because you can
                    lose it.'"
                </p>
            </div>
            <p className="quote-author">Jason Johnson · Owner of CoffeeStyle</p>
        </section>
        {/* SUBSCRIBE */}
        <section className="subscribe-section">
            <div className="subscribe-card fade-up">
                <div>
                    <p className="subscribe-eyebrow">
                        Don't miss out on our latest news, updates, tips and special offers!
                    </p>
                    <h2 className="subscribe-headline">
                        Subscribe to get
                        <br />
                        the Latest News
                    </h2>
                </div>
                <div className="subscribe-form">
                    <input
                        className="subscribe-input"
                        type="email"
                        placeholder="kapetpamana@gmail.com"
                    />
                    <button className="subscribe-btn">Subscribe</button>
                </div>
            </div>
        </section>
        {/* FOOTER */}
        <footer>
            <div className="footer-inner">
                <div className="footer-brand">
                    <a href="index.html" className="logo">
                        <img src={logo} alt="Kape't Pamana" height={70} />
                        <span className="logo-text">Kape't Pamana</span>
                    </a>
                    <p className="footer-tagline">
                        Delivering the best coffee life since 1996. From coffee geeks to the
                        real ones.
                    </p>
                </div>
                <div className="footer-col">
                    <h4>Menu</h4>
                    <ul>
                        <li>
                            <a href="index.html">Home</a>
                        </li>
                        <li>
                            <a href="#">Our Products</a>
                        </li>
                        <li>
                            <a href="#">About</a>
                        </li>
                        <li>
                            <a href="#">Contact</a>
                        </li>
                        <li>
                            <a href="#">Styleguide</a>
                        </li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>Follow Us</h4>
                    <ul>
                        <li>
                            <a href="#">Facebook</a>
                        </li>
                        <li>
                            <a href="#">Instagram</a>
                        </li>
                        <li>
                            <a href="#">Pinterest</a>
                        </li>
                        <li>
                            <a href="#">Twitter</a>
                        </li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>Contact Us</h4>
                    <p className="footer-contact-label">We're Always Happy to Help</p>
                    <p className="footer-email">kapetpamana@gmail.com</p>
                    <p className="footer-powered">Powered by Webflow</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p className="footer-copy">Kape't Pamana @ 2026</p>
            </div>
        </footer>
    </>
    </>)
}
export default Blogs;