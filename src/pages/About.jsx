import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import anthonyy from '../assets/images/anthonyy.png';
import elaizaa from '../assets/images/elaizaa.jpg';
import reuel from '../assets/images/reuel.jpg';
import samuel from '../assets/images/samuel.jpeg';
import jmm from '../assets/images/jmm.png';
import miura from '../assets/images/miura.png';
import aboutcoffee from '../assets/images/aboutcoffee.jpg';
import aboutcoffee1 from '../assets/images/aboutcoffee1.jpg';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';
import Newsletter from '../components/layout/Newsletter';
import '../styles/about.css';
import { LINK_PATH } from "../admin/data/LinkPath.jsx";

const API_CONTENT = `${LINK_PATH}WebsiteContentController.php?page=about`;
const DEFAULTS = {
  heroTitle: "Behind the success of Kape't Ani",
  heroSubtitle: "Passion drives success behind scenes.",
  storyLabel: "Our Story",
  storyText: "\"Kape't Ani started as a small dream: to share the richness of Filipino coffee and culture while supporting local farmers and artisans.\"",
  heritageImage1: aboutcoffee1,
  heritageTitle1: "Curating heritage, craftsmanship, and culture beyond everyday living.",
  heritagePara1a: "Kape't Ani brings together the richness of Filipino tradition and the artistry of local craftsmanship to create experiences that go beyond the ordinary.",
  heritagePara1b: "Each carefully selected product reflects a deep respect for culture, quality, and community, transforming simple moments into meaningful rituals.",
  heritageTitle2: "Where heritage, coffee, and craft meet refined living.",
  heritagePara2: "Each cup was a tribute to farmers who rose before dawn, and each handcrafted piece reflected traditions shaped by time and patience.",
  heritageImage2: aboutcoffee,
  teamLabel: "— Meet the Team —",
  team1Name: "Uayan",
  team1Role: "Technical Lad",
  team2Name: "Reuel",
  team2Role: "Operations Manager",
  team3Name: "Elaiza",
  team3Role: "Barista",
  team4Name: "Anthony",
  team4Role: "CEO",
  team5Name: "Samuel",
  team5Role: "Designer",
  team6Name: "Yu",
  team6Role: "Marketing",
  timelineLabel: "— History Timeline —",
  timeline4Date: "OCTOBER 2018",
  timeline4Title: "One cup, one craft, one story.",
  timeline4Desc: "From a small dream to a growing e-commerce platform, Kape’t Ani expanded its product lines and partnerships.",
  timeline3Date: "AUGUST 2018",
  timeline3Title: "Building deeper connections",
  timeline3Desc: "The team reached out to community-based coffee farmers and artisans, learning their stories and understanding the care behind every bean.",
  timeline2Date: "JUNE 2018",
  timeline2Title: "Small steps",
  timeline2Desc: "Kape’t Ani started as a small dream to share the richness of Filipino coffee and culture while supporting local farmers.",
  timeline1Date: "NOVEMBER 2017",
  timeline1Title: "We've started Kape't Ani.",
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }
};

const About = () => {
  const [contentMap, setContentMap] = useState({});
  const txt = useCallback((k) => contentMap[k]?.title || contentMap[k]?.description || DEFAULTS[k] || "", [contentMap]);
  const img = useCallback((k) => contentMap[k]?.image_url || DEFAULTS[k] || "", [contentMap]);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await fetch(API_CONTENT);
        const data = await res.json();
        const map = {};
        (data?.items || []).forEach((item) => {
          if (item?.content_key) map[item.content_key] = item;
        });
        setContentMap(map);
      } catch {
        setContentMap({});
      }
    };
    loadContent();
  }, []);

  const team = [
    { name: txt("team1Name"), role: txt("team1Role"), img: jmm, link: "" },
    { name: txt("team2Name"), role: txt("team2Role"), img: reuel, link: "" },
    { name: txt("team3Name"), role: txt("team3Role"), img: elaizaa, link: "" },
    { name: txt("team4Name"), role: txt("team4Role"), img: anthonyy, link: "" },
    { name: txt("team5Name"), role: txt("team5Role"), img: samuel, link: "https://imsauce.github.io/sauce/home.html" },
    { name: txt("team6Name"), role: txt("team6Role"), img: miura, link: "" },
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
          <h1>{txt("heroTitle")}</h1>
          <p>{txt("heroSubtitle")}</p>
        </motion.div>
      </section>

      {/* --- INTRO --- */}
      <section className="intro-section">
        <motion.div {...fadeInUp} className="container">
          <h1 className="section-label">{txt("storyLabel")}</h1>
          <p className="story-text">
            {txt("storyText")}
          </p>
        </motion.div>
      </section>

      {/* --- HERITAGE SECTION (ZIGZAG) --- */}
      <section className="heritage-section">
        <div className="container">
          {/* Row 1: Image Left, Text Right */}
          <div className="heritage-row">
            <motion.div {...fadeInUp} className="heritage-image-box">
              <img src={img("heritageImage1")} alt="Coffee Pouring" />
              <div className="heritage-accent" />
            </motion.div>
            
            <motion.div {...fadeInUp} className="heritage-content" transition={{ delay: 0.2 }}>
              <h3>{txt("heritageTitle1")}</h3>
              <div className="divider" />
              <p>{txt("heritagePara1a")}</p>
              <p>{txt("heritagePara1b")}</p>
            </motion.div>
          </div>

          {/* Row 2: Text Left, Image Right */}
          <div className="heritage-row heritage-reverse">
            <motion.div {...fadeInUp} className="heritage-content" transition={{ delay: 0.2 }}>
              <h3>{txt("heritageTitle2")}</h3>
              <div className="divider" />
              <p>{txt("heritagePara2")}</p>
            </motion.div>

            <motion.div {...fadeInUp} className="heritage-image-box">
              <img src={img("heritageImage2")} alt="Barista working" />
              <div className="heritage-accent left" /> 
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- TEAM SECTION --- */}
      <section className="team-section">
        <div className="container">
          <h2 className="section-label">{txt("teamLabel")}</h2>
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
          <h2 className="section-label">{txt("timelineLabel")}</h2>
          <div className="timeline-container">
            <motion.div {...fadeInUp} className="timeline-item">
              <span className="timeline-number">04</span>
              <p className="timeline-date">{txt("timeline4Date")}</p>
              <h3 className="timeline-title">{txt("timeline4Title")}</h3>
              <p className="timeline-desc">{txt("timeline4Desc")}</p>
              <div className="timeline-line" />
            </motion.div>

            <motion.div {...fadeInUp} className="timeline-item">
              <span className="timeline-number">03</span>
              <p className="timeline-date">{txt("timeline3Date")}</p>
              <h3 className="timeline-title">{txt("timeline3Title")}</h3>
              <p className="timeline-desc">{txt("timeline3Desc")}</p>
              <div className="timeline-line" />
            </motion.div>

            <motion.div {...fadeInUp} className="timeline-item">
              <span className="timeline-number">02</span>
              <p className="timeline-date">{txt("timeline2Date")}</p>
              <h3 className="timeline-title">{txt("timeline2Title")}</h3>
              <p className="timeline-desc">{txt("timeline2Desc")}</p>
              <div className="timeline-line" />
            </motion.div>

            <motion.div {...fadeInUp} className="timeline-item">
              <span className="timeline-number">01</span>
              <p className="timeline-date">{txt("timeline1Date")}</p>
              <h3 className="timeline-title">{txt("timeline1Title")}</h3>
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