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
import { LINK_PATH } from "../admin/data/LinkPath.jsx";

const API_CONTENT = `${LINK_PATH}WebsiteContentController.php?page=blogs`;

const BLOG_DEFAULTS = {
  heroLine1: "Discover the stories",
  heroLine2: "behind every brew.",
  introTitle: "Read coffee stories on our Blog",
  introDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\nSuspendisse varius enim in eros elementum tristique.",
  featuredLabel: "Featured Posts",
  featured1Image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800&q=80",
  featured1Title: "Will drinking coffee prolong your life?",
  featured1Excerpt: "Aliquid aperiam accusantium quam ipsam. Velit rerum veniam optio illo dolor delectus et recusandae. Impedit aut cupiditate. Illum eveniet officiis ullam ipsam sed iste eius. Nam at quae ducimus dicta delectus",
  featured1Date: "October 9, 2018",
  featured2Image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
  featured2Title: "Health Check: why do I get a headache when I haven't had my coffee?",
  featured2Excerpt: "It is a paradisematic country, in which roasted parts of sentences fly into your mouth.",
  featured2Date: "October 9, 2018",
  readFullStoryLabel: "Read the Full Story",
  latestHeading: "Latest Posts",
  latest1Image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&q=80",
  latest1Title: "More coffee, lower death risk?",
  latest1Excerpt: "Eveniet itaque aperiam qui officia in ducimus. Voluptas culpa ut eligendi in. Minima est dolores dolore aut et alias p",
  latest1Date: "October 9, 2018",
  latest2Image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&q=80",
  latest2Title: "Will drinking coffee prolong your life?",
  latest2Excerpt: "Aliquid aperiam accusantium quam ipsam. Velit rerum veniam optio illo dolor delectus et recusandae.",
  latest2Date: "October 9, 2018",
  latest3Image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400&q=80",
  latest3Title: "Health Check: why do I get a headache when I haven't had my coffee?",
  latest3Excerpt: "It is a paradisematic country, in which roasted parts of sentences fly into your mouth.",
  latest3Date: "October 9, 2018",
  latest4Image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80",
  latest4Title: "How long does a cup of coffee keep you awake?",
  latest4Excerpt: "It is a paradisematic country, in which roasted parts. Vel qui et ad voluptatem.",
  latest4Date: "October 9, 2018",
  latest5Image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80",
  latest5Title: "Recent research suggests that heavy coffee drinkers may reap health benefits.",
  latest5Excerpt: "It is a paradisematic country, in which roasted parts of sentences fly into your mouth.",
  latest5Date: "October 9, 2018",
  sidebarAboutHeading: "About Us",
  sidebarBrandName: "Kape't Pamana",
  sidebarAboutText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
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
          <Newsletter />
          <Footer />
        </div>
      </>
    </>
  );
}
export default Blogs;
