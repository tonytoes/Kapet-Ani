import React from 'react';
import { motion } from 'framer-motion';
import anthonyy from '../assets/images/anthonyy.png';
import elaizaa from '../assets/images/elaizaa.jpg';
import reuel from '../assets/images/reuel.jpg';
import samuel from '../assets/images/samuel.jpg';
import jmm from '../assets/images/jmm.png';
import miura from '../assets/images/miura.png';
import aboutcoffee from '../assets/images/aboutcoffee.jpg';
import aboutcoffee1 from '../assets/images/aboutcoffee1.jpg';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';
import Newsletter from '../components/layout/Newsletter';
import '../styles/about.css';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }
};

const About = () => {
  const team = [
    { name: "Uayan", role: "Technical Lad", img: jmm, link: "" },
    { name: "Reuel", role: "Operations Manager", img: reuel, link: "" },
    { name: "Elaiza", role: "Barista", img: elaizaa, link: "" },
    { name: "Anthony", role: "CEO", img: anthonyy, link: "" },
    { name: "Samuel", role: "Designer", img: samuel, link: "https://imsauce.github.io/sauce/home.html" },
    { name: "Yu", role: "Marketing", img: miura, link: "" },
  ];

  return (
    <div className="about-page">
      <Navbar activePage="about"/>

      {/* --- HERO --- */}
      <section className="hero-section">
        <div className="hero-overlay" />
        <motion.div 
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="hero-content"
        >
          <h1>Behind the success of Kape't Ani</h1>
          <p>Passion drives success behind scenes.</p>
        </motion.div>
      </section>

      {/* --- INTRO --- */}
      <section className="intro-section">
        <motion.div {...fadeInUp} className="container">
          <h1 className="section-label">Our Story</h1>
          <p className="story-text">
            "Kape't Ani started as a small dream: to share the richness of Filipino coffee and culture while supporting local farmers and artisans."
          </p>
        </motion.div>
      </section>

      {/* --- HERITAGE SECTION (ZIGZAG) --- */}
      <section className="heritage-section">
        <div className="container">
          {/* Row 1: Image Left, Text Right */}
          <div className="heritage-row">
            <motion.div {...fadeInUp} className="heritage-image-box">
              <img src={aboutcoffee1} alt="Coffee Pouring" />
              <div className="heritage-accent" />
            </motion.div>
            
            <motion.div {...fadeInUp} className="heritage-content" transition={{ delay: 0.2 }}>
              <h3>Curating heritage, craftsmanship, and culture beyond everyday living.</h3>
              <div className="divider" />
              <p>Kape't Ani brings together the richness of Filipino tradition and the artistry of local craftsmanship to create experiences that go beyond the ordinary.</p>
              <p>Each carefully selected product reflects a deep respect for culture, quality, and community, transforming simple moments into meaningful rituals.</p>
            </motion.div>
          </div>

          {/* Row 2: Text Left, Image Right */}
          <div className="heritage-row heritage-reverse">
            <motion.div {...fadeInUp} className="heritage-content" transition={{ delay: 0.2 }}>
              <h3>Where heritage, coffee, and craft meet refined living.</h3>
              <div className="divider" />
              <p>Each cup was a tribute to farmers who rose before dawn, and each handcrafted piece reflected traditions shaped by time and patience.</p>
            </motion.div>

            <motion.div {...fadeInUp} className="heritage-image-box">
              <img src={aboutcoffee} alt="Barista working" />
              <div className="heritage-accent left" /> 
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- TEAM SECTION --- */}
      <section className="team-section">
        <div className="container">
          <h2 className="section-label">— Meet the Team —</h2>
          <div className="team-grid">
            {team.map((m, i) => {
              const card = (
                <motion.div
                  key={i}
                  {...fadeInUp}
                  transition={{ delay: i * 0.1 }}
                  className={`team-card ${m.link ? "clickable" : ""}`}
                >
                  <div className="card-image">
                    <img src={m.img} alt={m.name} />
                  </div>
                  <h5>{m.name}</h5>
                  <p className="role">{m.role}</p>
                </motion.div>
              );

              return m.link ? (
                <a
                  key={i}
                  href={m.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-link-wrapper"
                >
                  {card}
                </a>
              ) : (
                card
              );
            })}
          </div>
        </div>
      </section>

      {/* --- HISTORY TIMELINE --- */}
      <section className="timeline-section">
        <div className="container">
          <h2 className="section-label">— History Timeline —</h2>
          <div className="timeline-container">
            <motion.div {...fadeInUp} className="timeline-item">
              <span className="timeline-number">04</span>
              <p className="timeline-date">OCTOBER 2018</p>
              <h3 className="timeline-title">One cup, one craft, one story.</h3>
              <p className="timeline-desc">From a small dream to a growing e-commerce platform, Kape’t Ani expanded its product lines and partnerships.</p>
              <div className="timeline-line" />
            </motion.div>

            <motion.div {...fadeInUp} className="timeline-item">
              <span className="timeline-number">03</span>
              <p className="timeline-date">AUGUST 2018</p>
              <h3 className="timeline-title">Building deeper connections</h3>
              <p className="timeline-desc">The team reached out to community-based coffee farmers and artisans, learning their stories and understanding the care behind every bean.</p>
              <div className="timeline-line" />
            </motion.div>

            <motion.div {...fadeInUp} className="timeline-item">
              <span className="timeline-number">02</span>
              <p className="timeline-date">JUNE 2018</p>
              <h3 className="timeline-title">Small steps</h3>
              <p className="timeline-desc">Kape’t Ani started as a small dream to share the richness of Filipino coffee and culture while supporting local farmers.</p>
              <div className="timeline-line" />
            </motion.div>

            <motion.div {...fadeInUp} className="timeline-item">
              <span className="timeline-number">01</span>
              <p className="timeline-date">NOVEMBER 2017</p>
              <h3 className="timeline-title">We've started Kape't Ani.</h3>
            </motion.div>
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
};

export default About;