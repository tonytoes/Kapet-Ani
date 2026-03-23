import React from 'react';
import { motion } from 'framer-motion';
import anthonyy from '../assets/images/anthonyy.png';
import elaizaa from '../assets/images/elaizaa.jpg';
import reuel from '../assets/images/reuel.jpg';
import samuel from '../assets/images/samuel.jpg';
import jmm from '../assets/images/jmm.png';
import miura from '../assets/images/miura.png';
import logo from '../assets/images/logo.png';
import Footer from '../components/layout/Footer';
import '../styles/about.css';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }
};

const About = () => {
  const team = [
    { name: "Yu", role: "Technical Lad", img: jmm },
    { name: "Reuel", role: "Operations Manager", img: reuel },
    { name: "Elaiza", role: "Barista", img: elaizaa },
    { name: "Anthony", role: "CEO", img: anthonyy },
    { name: "Samuel", role: "Designer", img: samuel },
    { name: "Uayan", role: "Marketing", img: miura },
  ];

  return (
    <div className="about-page">
      
      {/* --- NAVIGATION --- */}
      <nav className="main-nav">
        <div className="nav-logo">
          <img src={logo} alt="Logo" />
          <span>Kape't Pamana</span>
        </div>

        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/products">Our Products</a>
          <a href="/blogs">Blogs</a>
          <a href="/about" className="active">About</a>
        </div>

        <div className="nav-cart">
          <span>Cart</span>
          <span className="cart-badge">0</span>
        </div>
      </nav>

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
          <h2 className="section-label">— Our Story —</h2>
          <p className="story-text">
            "Kape't Ani started as a small dream: to share the richness of Filipino coffee and culture while supporting local farmers and artisans."
          </p>
        </motion.div>
      </section>

      {/* --- IMAGE + TEXT GRID --- */}
      <section className="grid-section">
        <div className="container grid-2">
          <motion.div {...fadeInUp} className="grid-image-wrapper">
            <img src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=800" alt="Process" />
            <div className="image-accent" />
          </motion.div>
          
          <motion.div {...fadeInUp} className="grid-text" transition={{ delay: 0.2 }}>
            <h3>Curating heritage, craftsmanship, and culture.</h3>
            <div className="divider" />
            <p>Each carefully selected product reflects a deep respect for culture, quality, and community, transforming simple moments into meaningful rituals.</p>
            <p className="italic">Where every harvest whispers stories of home.</p>
          </motion.div>
        </div>
      </section>

      {/* --- TEAM SECTION --- */}
      <section className="team-section">
        <div className="container">
          <h2 className="section-label">— Meet the Team —</h2>
          <div className="team-grid">
            {team.map((m, i) => (
              <motion.div key={i} {...fadeInUp} transition={{ delay: i * 0.1 }} className="team-card">
                <div className="card-image">
                  <img src={m.img} alt={m.name} />
                </div>
                <h5>{m.name}</h5>
                <p className="role">{m.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;