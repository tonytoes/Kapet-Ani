import logo from "../assets/images/logo.png";
import office1 from "../assets/images/office1.jpg";
import office2 from "../assets/images/office2.jpg";
import "../styles/review.css";
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import Newsletter from "../components/layout/Newsletter.jsx";
import { useEffect } from "react";

function Review() {
  useEffect(() => {
    const navbar = document.getElementById("navbar");

    const handleScroll = () => {
      if (navbar) {
        navbar.classList.toggle("scrolled", window.scrollY > 60);
      }
    };

    window.addEventListener("scroll", handleScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 },
    );

    const elements = document.querySelectorAll(".fade-up");
    elements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <>
      <Navbar activePage="reviews" />
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
              <h1 className="text-center" style={{ fontFamily: "Karla, sans-serif" }}>
                Let's Connect
              </h1>
              <p className="text-center lh-base" style={{ fontFamily: "Karla, sans-serif", fontSize: "18px" }}>
                We’d love to hear from you! Your thoughts, experiences, and
                feedback help us grow and continue delivering meaningful coffee
                and cultural products. Share your reviews, suggestions, and
                stories with us, and let us know how Kape’t Ani has become part
                of your daily rituals.
              </p>
            </div>
            <div className="review-subheadline">
              <div className="decoline"></div>
              <span className="label mx-3 ">OUR OFFICES</span>
              <div className="decoline"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="review-content">
        <div className="wrap-overlayed">
          <div className="offices-wrap d-flex flex-row justify-content-center align-items-start align-content-start gap-5">
            <div className="officeWrap text-center">
              <div className="officeImage">
                <img src={office1} className="img-fluid mb-5" />
              </div>
              <div className="officeInfo">
                <span className="label mb-2">Main Branch</span>
                <span className="officeHeadline mb-2">
                  Congressional Avenue, San Beda St., Quezon City
                </span>
                <span className="label my-3">Opening Times</span>
                <ul className="list-unstyled">
                  <li>
                    <p>Mon - Fri 08:00 to 22:00</p>
                  </li>
                  <li>
                    <p>Sat - 09:00 to 20:00</p>
                  </li>
                  <li>
                    <p>Sun - 12:00 to 18:00</p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="officeWrap text-center">
              <div className="officeImage">
                <img src={office2} className="img-fluid mb-5" />
              </div>
              <div className="officeInfo">
                <span className="label mb-2">Main Branch</span>
                <span className="officeHeadline mb-2">
                  Congressional Avenue, San Beda St., Quezon City
                </span>
                <span className="label my-3">Opening Times</span>
                <ul className="list-unstyled">
                  <li>
                    <p>Mon - Fri 08:00 to 22:00</p>
                  </li>
                  <li>
                    <p>Sat - 09:00 to 20:00</p>
                  </li>
                  <li>
                    <p>Sun - 12:00 to 18:00</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="review-content">
        <div className="wrap">
          <div className="reviewForm d-flex align-items-stretch">
            <div className="formWrap d-flex flex-column align-item-stretch">
              <span className="mb-3 label">CONTACT FORM</span>
              <span className="mb-3" style={{ fontFamily: "Karla, sans-serif" }}>
                Drop us your message and I'll get back to you as soon as
                possible.
              </span>
              <form className="d-flex flex-column">
                <label for="email" class="form-label" >
                  NAME
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="form-control px-3 py-3"
                />
                <label for="email" class="form-label">
                  EMAIL
                </label>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="form-control px-3 py-3"
                />
                <label for="email" class="form-label">
                  YOUR MESSAGE
                </label>
                <textarea
                  placeholder="Your Message"
                  className="form-control px-3 py-3 mb-5"
                ></textarea>
                <button type="submit" className="btn btn-primary">
                  Send Message
                </button>
              </form>
            </div>
            <div className="contactWrap">
              <div className="contactInfo">
                <span className="mb-3 label">CONTACT FORM</span>
                <span className="mb-5 contactHeadline">Kape't Pamana</span>
                <p>11 Sumulong Highway, Brgy. Sta. Cruz</p>
              </div>
              <div className="contactInfo">
                <span className="label">Call US</span>
                <span>+63 (917) 1234567</span>
              </div>
              <div className="contactInfo">
                <span className="label">Email Us</span>
                <a href="">kapetpamana@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
        <div className="location">
          <div className="embedLocation">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7721.649797554171!2d121.16023039427121!3d14.609048625508008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b9003bb23f0f%3A0x3b8ac521ba0a2f61!2sStarbucks%2011%20Sumulong%20Highway%20Antipolo!5e0!3m2!1sen!2sph!4v1774162957750!5m2!1sen!2sph"
              width="100%"
              height="450"
              style={{ border: "0" }}
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <Newsletter />
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Review;
