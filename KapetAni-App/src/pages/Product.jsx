import { useState } from "react";
import "../styles/Product.css";
import Newsletter from "../components/layout/Newsletter.jsx";
import Footer from "../components/layout/Footer.jsx";
import logo from "../assets/images/logo.png"; 

function Product() {
  return (
    <>
      {/* NAVBAR */}
      <nav id="navbar1">
        <div className="nav-inner1">
          <a href="/" className="logo">
            <img src={logo} alt="Kape't Pamana" height={70} />
            <span className="logo-text">Kape't Pamana</span>
          </a>

          <ul className="nav-links">
            <li><a href="/">Home</a></li>
            <li><a href="/product" className="active">Our Products</a></li>
            <li><a href="/blogs">Blogs</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/about">About</a></li>
          </ul>

          <div className="nav-cart">
            <a href="/login" className="nav-icon">
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </a>
            <a href="/checkout" className="nav-icon" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1={3} y1={6} x2={21} y2={6} />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              Cart
            </a>
            <div className="cart-badge">1</div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="main-wrapper">
        <aside className="sidebar">
          <div className="category-header">
            Categories <span>▼</span>
          </div>
          <ul className="category-list">
            <li>All Products</li>
            <li>Cold &amp; Specialty Drinks <span>(5)</span></li>
            <li>Hand-Made Baskets <span>(5)</span></li>
            <li>Clay-Pot Mug <span>(5)</span></li>
            <li>Coaster Set <span>(5)</span></li>
            <li className="active">Hand-Made Bags <span>(5)</span></li>
          </ul>
        </aside>

        <main className="content-area">
          <div className="hero-banner">
            <h1>SHOP COFFEE AND CULTURAL HERITAGE PRODUCTS</h1>
          </div>

          <div className="toolbar">
            <h2 id="current-category">Hand-Made Bags</h2>
            <div className="search-wrap">
              <input type="text" id="productSearch" placeholder="Search Products..." />
              <select className="sort-select">
                <option>Sort By: Best Selling</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="carousel-container">
            <button className="carousel-btn prev" id="prevBtn">❮</button>
            <div className="carousel-viewport" id="carouselViewport">
              <div className="product-grid1" id="productGrid">

                {/* Cold & Specialty Drinks */}
                <div className="product-card" data-category="Cold & Specialty Drinks">
                  <div className="img-box"><img src="drink1.png" alt="" /></div>
                  <button className="shop-btn">SHOP NOW</button>
                </div>
                <div className="product-card" data-category="Cold & Specialty Drinks">
                  <div className="img-box"><img src="drink2.png" alt="" /></div>
                  <button className="shop-btn">SHOP NOW</button>
                </div>
                <div className="product-card" data-category="Cold & Specialty Drinks">
                  <div className="img-box"><img src="drink3.png" alt="" /></div>
                  <button className="shop-btn">SHOP NOW</button>
                </div>
                <div className="product-card" data-category="Cold & Specialty Drinks">
                  <div className="img-box"><img src="drink4.png" alt="" /></div>
                  <button className="shop-btn">SHOP NOW</button>
                </div>
                <div className="product-card" data-category="Cold & Specialty Drinks">
                  <div className="img-box"><img src="drink5.png" alt="" /></div>
                  <button className="shop-btn">SHOP NOW</button>
                </div>

                {/* Hand-Made Baskets */}
                <div className="product-card" data-category="Hand-Made Baskets">
                  <div className="img-box"><img src="basket1.png" alt="" /></div>
                  <button className="shop-btn">SHOP NOW</button>
                </div>
                <div className="product-card" data-category="Hand-Made Baskets">
                  <div className="img-box"><img src="basket2.png" alt="" /></div>
                  <button className="shop-btn">SHOP NOW</button>
                </div>
                <div className="product-card" data-category="Hand-Made Baskets">
                  <div className="img-box"><img src="basket3.png" alt="" /></div>
                  <button className="shop-btn">SHOP NOW</button>
                </div>
                <div className="product-card" data-category="Hand-Made Baskets">
                  <div className="img-box"><img src="basket4.png" alt="" /></div>
                  <button className="shop-btn">SHOP NOW</button>
                </div>
                <div className="product-card" data-category="Hand-Made Baskets">
                  <div className="img-box"><img src="basket5.png" alt="" /></div>
                  <button className="shop-btn">SHOP NOW</button>
                </div>

                {/* Clay-Pot Mug */}
                <div className="product-card" data-category="Clay-Pot Mug">
                  <div className="img-box"><img src="images/Banga Brew Cup.png" alt="" /></div>
                  <button className="shop-btn">Banga Brew Mug</button>
                </div>
                <div className="product-card" data-category="Clay-Pot Mug">
                  <div className="img-box"><img src="images/Earthy Ceramic Cup.png" alt="" /></div>
                  <button className="shop-btn">Earthy Ceramic Mug</button>
                </div>
                <div className="product-card" data-category="Clay-Pot Mug">
                  <div className="img-box"><img src="images/Talavera Brew Cup.png" alt="" /></div>
                  <button className="shop-btn">Talavera Brew Mug</button>
                </div>
                <div className="product-card" data-category="Clay-Pot Mug">
                  <div className="img-box"><img src="images/Terracotta Cup.png" alt="" /></div>
                  <button className="shop-btn">Terracotta Mug</button>
                </div>
                <div className="product-card" data-category="Clay-Pot Mug">
                  <div className="img-box"><img src="images/Tapayan Clay Cup.png" alt="" /></div>
                  <button className="shop-btn">Tapayan Clay Mug</button>
                </div>

                {/* Coaster Set */}
                <div className="product-card" data-category="Coaster Set">
                  <div className="img-box"><img src="images/coaster1.jpg" alt="" /></div>
                  <button className="shop-btn">SHOP NOW</button>
                </div>
                <div className="product-card" data-category="Coaster Set">
                  <div className="img-box"><img src="images/coaster2.jpg" alt="" /></div>
                  <button className="shop-btn">SHOP NOW</button>
                </div>
                <div className="product-card" data-category="Coaster Set">
                  <div className="img-box"><img src="images/coaster3.jpg" alt="" /></div>
                  <button className="shop-btn">SHOP NOW</button>
                </div>
                <div className="product-card" data-category="Coaster Set">
                  <div className="img-box"><img src="images/coaster4.jpg" alt="" /></div>
                  <button className="shop-btn">SHOP NOW</button>
                </div>
                <div className="product-card" data-category="Coaster Set">
                  <div className="img-box"><img src="images/coaster5.jpg" alt="" /></div>
                  <button className="shop-btn">SHOP NOW</button>
                </div>

                {/* Hand-Made Bags */}
                <div className="product-card" data-category="Hand-Made Bags">
                  <div className="img-box"><img src="images/bobatea.jpg" alt="" /></div>
                  <button className="shop-btn">ADD TO CART</button>
                </div>
                <div className="product-card" data-category="Hand-Made Bags">
                  <div className="img-box"><img src="images/chocodrink.jpg" alt="" /></div>
                  <button className="shop-btn">ADD TO CART</button>
                </div>
                <div className="product-card" data-category="Hand-Made Bags">
                  <div className="img-box"><img src="images/matchavanilla.jpg" alt="" /></div>
                  <button className="shop-btn">ADD TO CART</button>
                </div>
                <div className="product-card" data-category="Hand-Made Bags">
                  <div className="img-box"><img src="images/pandangfrappe.jpg" alt="" /></div>
                  <button className="shop-btn">ADD TO CART</button>
                </div>
                <div className="product-card" data-category="Hand-Made Bags">
                  <div className="img-box"><img src="images/ubefrappe.jpg" alt="" /></div>
                  <button className="shop-btn">ADD TO CART</button>
                </div>

              </div>
            </div>
            <button className="carousel-btn next" id="nextBtn">❯</button>
          </div>
        </main>
      </div>

      <Newsletter />
      <Footer />
    </>
  );
}

export default Product;