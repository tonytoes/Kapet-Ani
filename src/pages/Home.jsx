import '../styles/home.css';
import { useEffect, useState, useCallback } from "react";
import mangofrappe from '../assets/images/matchavanilla2.jpg';
import ubefrappe from '../assets/images/milkube.jpg';
import basket1 from '../assets/images/basket1.jpg';
import basket2 from '../assets/images/basket2.jpg';
import basket3 from '../assets/images/basket3.jpg';
import basket4 from '../assets/images/basket4.jpg';
import basket5 from '../assets/images/basket5.jpg';
import basket6 from '../assets/images/basket6.jpg';
import basket7 from '../assets/images/coaster2.jpg';
import mug1 from '../assets/images/Banig Crossbody.webp';
import mug2 from '../assets/images/mug1.jpg';
import parallax from '../assets/images/parallax.png';
import Navbar from '../components/layout/Navbar.jsx';
import Newsletter from "../components/layout/Newsletter.jsx";
import Footer from '../components/layout/Footer.jsx';
import coffeeVideo from "../assets/video/coffee_video.mp4";
import { LINK_PATH } from "../admin/data/LinkPath.jsx";

const CONTENT_API = `${LINK_PATH}WebsiteContentController.php`;

const HOME_DEFAULTS = {
  heroEyebrow: "Est. 1996 · Filipino Heritage",
  heroTitleLine1: "From Filipino Hands",
  heroTitleLine2: "to global streets",
  heroCtaLabel: "Explore Our Products",
  heroCtaLink: "#featured",
  featuredSectionLabel: "Featured Products",
  moreSectionLabel: "More Products",
  vouchersSectionLabel: "Product Vouchers",
  voucherTitle: "ChoosDay Promo",
  voucherDesc: "Tune in for the next ChoosDay Promo!\n(Tuesday 8:00–9:00 pm)",
  voucherCtaLabel: "Start Shopping",
  voucherCtaLink: "#",
  blogsSectionLabel: "Lifestyle Stories",
  blog1Title: "Health Check: why do I get a headache when I haven't had my coffee?",
  blog1Excerpt: "Understand why caffeine withdrawal can trigger headaches and how small routine changes can help you stay balanced without skipping coffee completely.",
  blog1Date: "December 3, 2019",
  blog2Title: "How long does a cup of coffee keep you awake?",
  blog2Excerpt: "Caffeine timing matters. Learn how long coffee effects can last and when to drink your last cup for better evening rest.",
  blog2Date: "April 26, 2023",
  blog3Title: "Recent research suggests that heavy coffee drinkers may reap health benefits.",
  blog3Excerpt: "Emerging research continues to explore the benefits of moderate coffee intake, from focus and mood support to potential long-term health gains.",
  blog3Date: "September 15, 2025",
  featured1Name: "Matcha Vanilla",
  featured2Name: "Ube Frappe",
  more1Name: "Abaca Basket 1",
  more2Name: "Abaca Basket 2",
  more3Name: "Abaca Basket 3",
  more4Name: "Rattan Basket",
  more5Name: "Bamboo Basket",
  more6Name: "Seagrass Basket",
  more7Name: "Palm Leaf Coasters",
  more8Name: "Banig Crossbody",
  more9Name: "Clay Mug",
};

const PRODUCT_NAME_KEYS = [
  ["Matcha Vanilla", "featured1Name"],
  ["Ube Frappe", "featured2Name"],
  ["Abaca Basket 1", "more1Name"],
  ["Abaca Basket 2", "more2Name"],
  ["Abaca Basket 3", "more3Name"],
  ["Rattan Basket", "more4Name"],
  ["Bamboo Basket", "more5Name"],
  ["Seagrass Basket", "more6Name"],
  ["Palm Leaf Coasters", "more7Name"],
  ["Banig Crossbody", "more8Name"],
  ["Clay Mug", "more9Name"],
];

const PRODUCT_NAME_BY_KEY = Object.fromEntries(PRODUCT_NAME_KEYS.map(([dbName, key]) => [key, dbName]));

const HOME_IMAGE_DEFAULTS = {
  featured1Image: mangofrappe,
  featured2Image: ubefrappe,
  more1Image: basket1,
  more2Image: basket2,
  more3Image: basket3,
  more4Image: basket4,
  more5Image: basket5,
  more6Image: basket6,
  more7Image: basket7,
  more8Image: mug1,
  more9Image: mug2,
  voucherImageMain: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&q=80",
  voucherImage2: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
  voucherImage3: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80",
  blog1Image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&q=80",
  blog2Image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=700&q=80",
  blog3Image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=700&q=80",
};


function Home() {
  const [pricingMap, setPricingMap] = useState({});
  const [contentMap, setContentMap] = useState({});

  const formatCurrency = useCallback((value) => {
    return Number(value || 0).toLocaleString("en-PH", { style: "currency", currency: "PHP" });
  }, []);

  const renderPrice = useCallback((name) => {
    const p = pricingMap[name];
    if (!p) {
      return (
        <p className="product-price">
          <s>--</s>
          <span>--</span>
        </p>
      );
    }
    const original = Number(p.price || 0);
    const discounted = Number(p.discount || 0) > 0 ? Number(p.totalprice || original) : original;
    return (
      <p className="product-price">
        <s>{formatCurrency(original)}</s>
        <span>{formatCurrency(discounted)}</span>
      </p>
    );
  }, [formatCurrency, pricingMap]);

  const renderSaleBadge = useCallback((name) => {
    const p = pricingMap[name];
    const qty = Number(p?.qty || 0);
    const discount = Number(p?.discount || 0);

    if (qty <= 0) {
      return (
        <span className="on-sale-badge not-for-sale-badge">
          Not for Sale
        </span>
      );
    }

    if (discount > 0) {
      return <span className="on-sale-badge">On Sale.</span>;
    }

    return null;
  }, [pricingMap]);

  const contentText = useCallback((key) => {
    const item = contentMap[key];
    if (!item) return HOME_DEFAULTS[key] || "";
    return item.title || item.description || item.subtitle || HOME_DEFAULTS[key] || "";
  }, [contentMap]);

  const contentMultiline = useCallback((key) => {
    return contentText(key).split("\n");
  }, [contentText]);

  const contentLink = useCallback((key, fallback = "#") => {
    const item = contentMap[key];
    return item?.cta_link || HOME_DEFAULTS[key] || fallback;
  }, [contentMap]);

  const contentLabel = useCallback((key) => {
    const item = contentMap[key];
    return item?.cta_label || HOME_DEFAULTS[key] || "";
  }, [contentMap]);

  const contentImage = useCallback((key) => {
    const item = contentMap[key];
    return item?.image_url || HOME_IMAGE_DEFAULTS[key];
  }, [contentMap]);

  const displayName = useCallback((key) => contentText(key), [contentText]);

  const sourceNameForPricing = useCallback((key) => PRODUCT_NAME_BY_KEY[key] || displayName(key), [displayName]);

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

  useEffect(() => {
    const loadPricing = async () => {
      try {
        const res = await fetch(`${LINK_PATH}Inventorycontroller.php`);
        const data = await res.json();
        const map = {};
        (data?.products || []).forEach((item) => {
          if (item?.name) map[item.name] = item;
        });
        setPricingMap(map);
      } catch {
        setPricingMap({});
      }
    };
    loadPricing();
  }, []);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await fetch(`${CONTENT_API}?page=home`);
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
    <div className="home-wrapper">
      <>
        <Navbar activePage="home" />

        {/* HERO */}
        <section className="hero">
          <video className="hero-bg" autoPlay muted loop playsInline>
            <source src={coffeeVideo} type="video/mp4" />
          </video>
          <div className="hero-overlay" />
          <div className="hero-content">
            <p className="hero-eyebrow">{contentText("heroEyebrow")}</p>
            <h1 className="hero-headline">
              {contentText("heroTitleLine1")}
              <br />
              <em>{contentText("heroTitleLine2")}</em>
            </h1>
            <a href={contentLink("heroCtaLink", "#featured")} className="btn-primary">{contentLabel("heroCtaLabel")}</a>
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
              <span className="section-label">{contentText("featuredSectionLabel")}</span>
            </div>
          </div>
          <div className="featured-grid">
            <div className="product-card1 fade-up">
              <div className="product-img">
                <img src={contentImage("featured1Image")} alt={displayName("featured1Name")} />
                {renderSaleBadge(sourceNameForPricing("featured1Name"))}
              </div>
              <div className="product-info">
                <p className="product-name">{displayName("featured1Name")}</p>
                {renderPrice(sourceNameForPricing("featured1Name"))}
              </div>
            </div>
            <div className="product-card1 fade-up" style={{ transitionDelay: "0.1s" }}>
              <div className="product-img">
                <img src={contentImage("featured2Image")} alt={displayName("featured2Name")} />
                {renderSaleBadge(sourceNameForPricing("featured2Name"))}
              </div>
              <div className="product-info">
                <p className="product-name">{displayName("featured2Name")}</p>
                {renderPrice(sourceNameForPricing("featured2Name"))}
              </div>
            </div>
          </div>
        </section>

        {/* MORE PRODUCTS */}
        <section className="more-products">
          <div className="section-header fade-up">
            <div className="section-rule">
              <span className="section-label">{contentText("moreSectionLabel")}</span>
            </div>
          </div>
          <div className="products-grid">
            <div className="product-card1 fade-up">
              <div className="product-img">
                <img src={contentImage("more1Image")} alt={displayName("more1Name")} />
                {renderSaleBadge(sourceNameForPricing("more1Name"))}
              </div>
              <div className="product-info">
                <p className="product-name">{displayName("more1Name")}</p>
                {renderPrice(sourceNameForPricing("more1Name"))}
              </div>
            </div>
            <div className="product-card1 fade-up" style={{ transitionDelay: "0.08s" }}>
              <div className="product-img">
                <img src={contentImage("more2Image")} alt={displayName("more2Name")} />
                {renderSaleBadge(sourceNameForPricing("more2Name"))}
              </div>
              <div className="product-info">
                <p className="product-name">{displayName("more2Name")}</p>
                {renderPrice(sourceNameForPricing("more2Name"))}
              </div>
            </div>
            <div className="product-card1 fade-up" style={{ transitionDelay: "0.16s" }}>
              <div className="product-img">
                <img src={contentImage("more3Image")} alt={displayName("more3Name")} />
                {renderSaleBadge(sourceNameForPricing("more3Name"))}
              </div>
              <div className="product-info">
                <p className="product-name">{displayName("more3Name")}</p>
                {renderPrice(sourceNameForPricing("more3Name"))}
              </div>
            </div>
            <div className="product-card1 fade-up" style={{ transitionDelay: "0.04s" }}>
              <div className="product-img">
                <img src={contentImage("more4Image")} alt={displayName("more4Name")} />
                {renderSaleBadge(sourceNameForPricing("more4Name"))}
              </div>
              <div className="product-info">
                <p className="product-name">{displayName("more4Name")}</p>
                {renderPrice(sourceNameForPricing("more4Name"))}
              </div>
            </div>
            <div className="product-card1 fade-up" style={{ transitionDelay: "0.12s" }}>
              <div className="product-img">
                <img src={contentImage("more5Image")} alt={displayName("more5Name")} />
                {renderSaleBadge(sourceNameForPricing("more5Name"))}
              </div>
              <div className="product-info">
                <p className="product-name">{displayName("more5Name")}</p>
                {renderPrice(sourceNameForPricing("more5Name"))}
              </div>
            </div>
            <div className="product-card1 fade-up" style={{ transitionDelay: "0.2s" }}>
              <div className="product-img">
                <img src={contentImage("more6Image")} alt={displayName("more6Name")} />
                {renderSaleBadge(sourceNameForPricing("more6Name"))}
              </div>
              <div className="product-info">
                <p className="product-name">{displayName("more6Name")}</p>
                {renderPrice(sourceNameForPricing("more6Name"))}
              </div>
            </div>
            <div className="product-card1 fade-up" style={{ transitionDelay: "0.06s" }}>
              <div className="product-img">
                <img src={contentImage("more7Image")} alt={displayName("more7Name")} />
                {renderSaleBadge(sourceNameForPricing("more7Name"))}
              </div>
              <div className="product-info">
                <p className="product-name">{displayName("more7Name")}</p>
                {renderPrice(sourceNameForPricing("more7Name"))}
              </div>
            </div>
            <div className="product-card1 fade-up" style={{ transitionDelay: "0.14s" }}>
              <div className="product-img">
                <img src={contentImage("more8Image")} alt={displayName("more8Name")} />
                {renderSaleBadge(sourceNameForPricing("more8Name"))}
              </div>
              <div className="product-info">
                <p className="product-name">{displayName("more8Name")}</p>
                {renderPrice(sourceNameForPricing("more8Name"))}
              </div>
            </div>
            <div className="product-card1 fade-up" style={{ transitionDelay: "0.22s" }}>
              <div className="product-img">
                <img src={contentImage("more9Image")} alt={displayName("more9Name")} />
                {renderSaleBadge(sourceNameForPricing("more9Name"))}
              </div>
              <div className="product-info">
                <p className="product-name">{displayName("more9Name")}</p>
                {renderPrice(sourceNameForPricing("more9Name"))}
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCT VOUCHERS */}
        <section className="vouchers">
          <div className="section-header fade-up">
            <div className="section-rule">
              <span className="section-label">{contentText("vouchersSectionLabel")}</span>
            </div>
          </div>
          <div className="voucher-inner">
            <div className="voucher-gallery fade-up">
              <img className="big" src={contentImage("voucherImageMain")} alt="Voucher promo" />
              <img src={contentImage("voucherImage2")} alt="Coffee cup" />
              <img src={contentImage("voucherImage3")} alt="Espresso" />
            </div>
            <div className="voucher-text fade-up" style={{ transitionDelay: "0.15s" }}>
              <h2>{contentText("voucherTitle")}</h2>
              <p>
                {contentMultiline("voucherDesc").map((line, idx) => (
                  <span key={idx}>{line}{idx < contentMultiline("voucherDesc").length - 1 ? <><br /></> : null}</span>
                ))}
              </p>
              <a href={contentLink("voucherCtaLink", "#")} className="btn-primary">{contentLabel("voucherCtaLabel")}</a>
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
              <span className="section-label">{contentText("blogsSectionLabel")}</span>
            </div>
          </div>
          <div className="blog-grid">
            <div className="blog-card fade-up">
              <div className="blog-img">
                <img src={contentImage("blog1Image")} alt="Coffee shop interior" />
              </div>
              <p className="blog-title">{contentText("blog1Title")}</p>
              <p className="blog-excerpt">{contentText("blog1Excerpt")}</p>
              <p className="blog-date">{contentText("blog1Date")}</p>
            </div>
            <div className="blog-card fade-up" style={{ transitionDelay: "0.1s" }}>
              <div className="blog-img">
                <img src={contentImage("blog2Image")} alt="Barista at work" />
              </div>
              <p className="blog-title">{contentText("blog2Title")}</p>
              <p className="blog-excerpt">{contentText("blog2Excerpt")}</p>
              <p className="blog-date">{contentText("blog2Date")}</p>
            </div>
            <div className="blog-card fade-up" style={{ transitionDelay: "0.2s" }}>
              <div className="blog-img">
                <img src={contentImage("blog3Image")} alt="Coffee and pour over" />
              </div>
              <p className="blog-title">{contentText("blog3Title")}</p>
              <p className="blog-excerpt">{contentText("blog3Excerpt")}</p>
              <p className="blog-date">{contentText("blog3Date")}</p>
            </div>
          </div>
        </section>
        <Newsletter />
        <Footer />

      </>
    </div>
  );
}

export default Home;