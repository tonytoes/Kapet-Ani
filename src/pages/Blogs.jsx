import "../styles/blogs.css";
import { useEffect, useState, useCallback } from "react";
import anthonyy from "../assets/images/anthonyy.png";
import elaizaa from "../assets/images/elaizaa.jpg";
import reuel from "../assets/images/reuel.jpg";
import samuel from "../assets/images/samuel.jpeg";
import jmm from "../assets/images/jmm.png";
import miura from "../assets/images/miura.png";
import Newsletter from "../components/layout/Newsletter";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import coffeeVideo from "../assets/video/coffee_video3.mp4";
import Chatbot from '../components/layout/Chatbot.jsx';
import { LINK_PATH } from "../admin/data/LinkPath.jsx";

const API_CONTENT = `${LINK_PATH}WebsiteContentController.php?page=blogs`;

const BLOG_DEFAULTS = {
  heroLine1: "Discover the stories",
  heroLine2: "behind every brew.",
  introTitle: "Read coffee stories on our Blog",
  introDesc: "From brewing tips to artisan stories, our blog shares practical coffee knowledge and the culture behind every cup.\nDiscover guides, features, and updates from Kape't Pamana.",
  featuredLabel: "Featured Posts",
  featured1Image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800&q=80",
  featured1Title: "Will drinking coffee prolong your life?",
  featured1Excerpt: "New studies continue to link moderate coffee intake with long-term wellness. We break down what the research says, what it does not, and how to enjoy coffee responsibly every day.",
  featured1Date: "March 14, 2019",
  featured2Image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
  featured2Title: "Health Check: why do I get a headache when I haven't had my coffee?",
  featured2Excerpt: "If skipping your usual brew gives you a headache, caffeine withdrawal may be the reason. Learn simple ways to adjust your routine while keeping your energy and focus steady.",
  featured2Date: "July 22, 2021",
  readFullStoryLabel: "Read the Full Story",
  latestHeading: "Latest Posts",
  latest1Image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&q=80",
  latest1Title: "More coffee, lower death risk?",
  latest1Excerpt: "Coffee and longevity are often discussed together, but context matters. Here is what researchers currently agree on and how to build healthier daily coffee habits.",
  latest1Date: "November 5, 2018",
  latest2Image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&q=80",
  latest2Title: "Will drinking coffee prolong your life?",
  latest2Excerpt: "Can daily coffee support a longer life? Here is a quick look at current findings, recommended intake, and the habits that matter most beyond your cup.",
  latest2Date: "February 17, 2020",
  latest3Image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400&q=80",
  latest3Title: "Health Check: why do I get a headache when I haven't had my coffee?",
  latest3Excerpt: "Coffee headaches are common, especially during schedule changes. These practical tips can help you reduce discomfort without fully giving up your favorite brew.",
  latest3Date: "August 9, 2022",
  latest4Image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80",
  latest4Title: "How long does a cup of coffee keep you awake?",
  latest4Excerpt: "How long caffeine keeps you awake depends on timing, dosage, and sensitivity. Use this guide to plan your coffee hours without sacrificing better sleep.",
  latest4Date: "January 28, 2024",
  latest5Image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80",
  latest5Title: "Recent research suggests that heavy coffee drinkers may reap health benefits.",
  latest5Excerpt: "Recent reports suggest regular coffee drinkers may gain meaningful health benefits. We summarize the highlights and explain what they mean for everyday routines.",
  latest5Date: "May 11, 2026",
  sidebarAboutHeading: "About Us",
  sidebarBrandName: "Kape't Pamana",
  sidebarAboutText: "Kape't Pamana celebrates Filipino coffee and craftsmanship by supporting local farmers, artisans, and communities through thoughtfully curated products and stories.",
  sidebarAboutLinkLabel: "Read the full Story",
  sidebarCategoriesHeading: "Categories",
  category1: "Barista",
  category2: "Coffee",
  category3: "Lifestyle",
  category4: "Mugs",
  sidebarAuthorsHeading: "Authors",
  author1Name: "Anthony",
  author2Name: "Elaiza",
  author3Name: "Reuel",
  author4Name: "Samuel",
  author5Name: "Uayan",
  author6Name: "Yu",
  quoteText: "\"I wake up some mornings and sit and have my coffee and look out at my beautiful garden, and I go, 'Remember how good this is. Because you can lose it.'\"",
  quoteAuthor: "Jason Johnson · Owner of CoffeeStyle",
};

function Blogs() {
  const [contentMap, setContentMap] = useState({});
  const txt = useCallback((k) => contentMap[k]?.title || contentMap[k]?.description || BLOG_DEFAULTS[k] || "", [contentMap]);
  const img = useCallback((k) => contentMap[k]?.image_url || BLOG_DEFAULTS[k] || "", [contentMap]);

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
  return (
    <>
      <>
        <Navbar activePage="blogs" />
        {/* HERO */}
        <section className="blog-hero">
          <video className="hero-bg" autoPlay muted loop playsInline>
            <source src={coffeeVideo} type="video/mp4" />
          </video>
          <div className="blog-hero-overlay" />
          <div className="blog-hero-content">
            <h1
              style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: "80px",
                fontWeight: 600,
                color: "var(--white)",
                lineHeight: 1.25,
                marginBottom: "36px",
              }}
            >
              {txt("heroLine1")} <br></br>
              <em
                style={{
                  fontStyle: "italic",
                  color: "var(--gold-light)",
                }}
              >
                {txt("heroLine2")}
              </em>
            </h1>
          </div>
        </section>
        {/* INTRO */}
        <section className="blog-intro">
          <h2>{txt("introTitle")}</h2>
          <p style={{ color: "black" }}>
            {txt("introDesc").split("\n").map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 ? <br /> : null}</span>
            ))}
          </p>
        </section>
        {/* MAIN CONTENT */}
        <div className="wrapper">
          <main className="blog-main">
            {/* LEFT: Posts */}
            <div className="blog-content">
              {/* FEATURED POSTS */}
              <div className="section-rule-wrap fade-up">
                <div className="section-rule">
                  <span className="section-label">{txt("featuredLabel")}</span>
                </div>
              </div>
              <div className="featured-posts fade-up">
                <div className="featured-card">
                  <div className="featured-img-wrap">
                    <img
                      src={img("featured1Image")}
                      alt={txt("featured1Title")}
                    />
                    <div className="featured-img-overlay">
                      <span>{txt("readFullStoryLabel")}</span>
                    </div>
                  </div>
                  <p className="post-title">{txt("featured1Title")}</p>
                  <p className="post-excerpt">{txt("featured1Excerpt")}</p>
                  <p className="post-date">{txt("featured1Date")}</p>
                </div>
                <div className="featured-card">
                  <div className="featured-img-wrap">
                    <img
                      src={img("featured2Image")}
                      alt={txt("featured2Title")}
                    />
                    <div className="featured-img-overlay">
                      <span>{txt("readFullStoryLabel")}</span>
                    </div>
                  </div>
                  <p className="post-title">{txt("featured2Title")}</p>
                  <p className="post-excerpt">{txt("featured2Excerpt")}</p>
                  <p className="post-date">{txt("featured2Date")}</p>
                </div>
              </div>
              {/* LATEST POSTS */}
              <div className="latest-section fade-up">
                <h3 className="latest-heading">{txt("latestHeading")}</h3>
                <div className="latest-divider" />
                <div className="latest-post">
                  <div className="latest-img-wrap">
                    <img
                      src={img("latest1Image")}
                      alt={txt("latest1Title")}
                    />
                  </div>
                  <div className="latest-text">
                    <p className="post-title">{txt("latest1Title")}</p>
                    <p className="post-excerpt">{txt("latest1Excerpt")}</p>
                    <p className="post-date">{txt("latest1Date")}</p>
                  </div>
                </div>
                <div className="latest-post">
                  <div className="latest-img-wrap">
                    <img
                      src={img("latest2Image")}
                      alt={txt("latest2Title")}
                    />
                  </div>
                  <div className="latest-text">
                    <p className="post-title">{txt("latest2Title")}</p>
                    <p className="post-excerpt">{txt("latest2Excerpt")}</p>
                    <p className="post-date">{txt("latest2Date")}</p>
                  </div>
                </div>
                <div className="latest-post">
                  <div className="latest-img-wrap">
                    <img
                      src={img("latest3Image")}
                      alt={txt("latest3Title")}
                    />
                  </div>
                  <div className="latest-text">
                    <p className="post-title">{txt("latest3Title")}</p>
                    <p className="post-excerpt">{txt("latest3Excerpt")}</p>
                    <p className="post-date">{txt("latest3Date")}</p>
                  </div>
                </div>
                <div className="latest-post">
                  <div className="latest-img-wrap">
                    <img
                      src={img("latest4Image")}
                      alt={txt("latest4Title")}
                    />
                  </div>
                  <div className="latest-text">
                    <p className="post-title">{txt("latest4Title")}</p>
                    <p className="post-excerpt">{txt("latest4Excerpt")}</p>
                    <p className="post-date">{txt("latest4Date")}</p>
                  </div>
                </div>
                <div className="latest-post">
                  <div className="latest-img-wrap">
                    <img
                      src={img("latest5Image")}
                      alt={txt("latest5Title")}
                    />
                  </div>
                  <div className="latest-text">
                    <p className="post-title">{txt("latest5Title")}</p>
                    <p className="post-excerpt">{txt("latest5Excerpt")}</p>
                    <p className="post-date">{txt("latest5Date")}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* RIGHT: Sidebar */}
            <aside className="blog-sidebar fade-up">
              {/* About Us */}
              <div className="sidebar-block">
                <h4 className="sidebar-heading">{txt("sidebarAboutHeading")}</h4>
                <div className="sidebar-divider" />
                <p className="sidebar-brand-name">{txt("sidebarBrandName")}</p>
                <p className="sidebar-about-text">{txt("sidebarAboutText")}</p>
                <a href="#" className="sidebar-link">
                  {txt("sidebarAboutLinkLabel")}
                </a>
              </div>
              {/* Categories */}
              <div className="sidebar-block">
                <h4 className="sidebar-heading">{txt("sidebarCategoriesHeading")}</h4>
                <div className="sidebar-divider" />
                <ul className="sidebar-categories">
                  <li>{txt("category1")}</li>
                  <li>{txt("category2")}</li>
                  <li>{txt("category3")}</li>
                  <li>{txt("category4")}</li>
                </ul>
              </div>
              {/* Authors */}
              <div className="sidebar-block">
                <h4 className="sidebar-heading">{txt("sidebarAuthorsHeading")}</h4>
                <div className="sidebar-divider" />
                <ul className="sidebar-authors">
                  <li>
                    <div className="author-avatar">
                      <img
                        src={anthonyy}
                        alt="Anthony"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <span>{txt("author1Name")}</span>
                  </li>
                  <li>
                    <div className="author-avatar">
                      <img
                        src={elaizaa}
                        alt="elaiza"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <span>{txt("author2Name")}</span>
                  </li>
                  <li>
                    <div className="author-avatar">
                      <img
                        src={reuel}
                        alt="reuel"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <span>{txt("author3Name")}</span>
                  </li>
                  <li>
                    <div className="author-avatar">
                      <img
                        src={samuel}
                        alt="samuel"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <span>{txt("author4Name")}</span>
                  </li>
                  <li>
                    <div className="author-avatar">
                      <img
                        src={jmm}
                        alt="jm"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <span>{txt("author5Name")}</span>
                  </li>
                  <li>
                    <div className="author-avatar">
                      <img
                        src={miura}
                        alt="Anthony"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <span>{txt("author6Name")}</span>
                  </li>
                </ul>
              </div>
            </aside>
          </main>
        </div>

        <div className="wrapper">
          {/* QUOTE */}
          <section className="quote-section fade-up">
            <div className="quote-box">
              <p className="quote-text">
                {txt("quoteText")}
              </p>
            </div>
            <p className="quote-author">{txt("quoteAuthor")}</p>
          </section>
          <Chatbot />
          <Newsletter />
          <Footer />
        </div>
      </>
    </>
  );
}
export default Blogs;
