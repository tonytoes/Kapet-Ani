import "../styles/Product.css";
import Navbar from "../components/layout/Navbar.jsx";
import Newsletter from "../components/layout/Newsletter.jsx";
import Footer from "../components/layout/Footer.jsx";

function Product() {
  return (
    <>
      <Navbar activePage="products" />
      <div className="main-wrapper">
        <aside className="sidebar">
          <div className="category-header">
            Categories <span>▼</span>
          </div>
          <ul className="category-list">
            <li>All Products</li>
            <li>
              Cold &amp; Specialty Drinks <span>(5)</span>
            </li>
            <li>
              Hand-Made Baskets <span>(5)</span>
            </li>
            <li>
              Clay-Pot Mug <span>(5)</span>
            </li>
            <li>
              Coaster Set <span>(5)</span>
            </li>
            <li className="active">
              Hand-Made Bags <span>(5)</span>
            </li>
          </ul>
        </aside>
        <main className="content-area">
          <div className="hero-banner">
            <h1>SHOP COFFEE AND CULTURAL HERITAGE PRODUCTS</h1>
          </div>
          <div className="toolbar">
            <h2 id="current-category">Hand-Made Bags</h2>
            <div className="search-wrap">
              <input
                type="text"
                id="productSearch"
                placeholder="Search Products..."
              />
              <select className="sort-select">
                <option>Sort By: Best Selling</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>
          <div className="carousel-container">
            <button className="carousel-btn prev" id="prevBtn">
              ❮
            </button>
            <div className="carousel-viewport" id="carouselViewport">
              <div className="product-grid" id="productGrid">
                <div
                  className="product-card"
                  data-category="Cold & Specialty Drinks"
                >
                  <div className="img-box">
                    <img src="drink1.png" />
                  </div>
                  <button className="shop-btn">SHOP NOW</button>
                </div>
                <div
                  className="product-card"
                  data-category="Cold & Specialty Drinks"
                >
                  <div className="img-box">
                    <img src="drink2.png" />
                  </div>
                  <button className="shop-btn">SHOP NOW</button>
                </div>
                <div
                  className="product-card"
                  data-category="Cold & Specialty Drinks"
                >
                  <div className="img-box">
                    <img src="drink3.png" />
                  </div>
                  <button className="shop-btn">SHOP NOW</button>
                </div>
                <div
                  className="product-card"
                  data-category="Cold & Specialty Drinks"
                >
                  <div className="img-box">
                    <img src="drink4.png" />
                  </div>
                  <button className="shop-btn">SHOP NOW</button>
                </div>
                <div
                  className="product-card"
                  data-category="Cold & Specialty Drinks"
                >
                  <div className="img-box">
                    <img src="drink5.png" />
                  </div>
                  <button className="shop-btn">SHOP NOW</button>
                </div>
                <div className="product-card" data-category="Hand-Made Baskets">
                  <div className="img-box">
                    <img src="basket1.png" />
                  </div>
                  <button className="shop-btn">SHOP NOW</button>
                </div>
                <div className="product-card" data-category="Hand-Made Baskets">
                  <div className="img-box">
                    <img src="basket2.png" />
                  </div>
                  <button className="shop-btn">SHOP NOW</button>
                </div>
                <div className="product-card" data-category="Hand-Made Baskets">
                  <div className="img-box">
                    <img src="basket3.png" />
                  </div>
                  <button className="shop-btn">SHOP NOW</button>
                </div>
                <div className="product-card" data-category="Hand-Made Baskets">
                  <div className="img-box">
                    <img src="basket4.png" />
                  </div>
                  <button className="shop-btn">SHOP NOW</button>
                </div>
                <div className="product-card" data-category="Hand-Made Baskets">
                  <div className="img-box">
                    <img src="basket5.png" />
                  </div>
                  <button className="shop-btn">SHOP NOW</button>
                </div>
                <div className="product-card" data-category="Clay-Pot Mug">
                  <div className="img-box">
                    <img src="images/Banga Brew Cup.png" />
                  </div>
                  <button className="shop-btn">Banga Brew Mug</button>
                </div>
                <div className="product-card" data-category="Clay-Pot Mug">
                  <div className="img-box">
                    <img src="images/Earthy Ceramic Cup.png" />
                  </div>
                  <button className="shop-btn">Earthy Ceramic Mug</button>
                </div>
                <div className="product-card" data-category="Clay-Pot Mug">
                  <div className="img-box">
                    <img src="images/Talavera Brew Cup.png" />
                  </div>
                  <button className="shop-btn">Talavera Brew Mug</button>
                </div>
                <div className="product-card" data-category="Clay-Pot Mug">
                  <div className="img-box">
                    <img src="images/Terracotta Cup.png" />
                  </div>
                  <button className="shop-btn">Terracotta Mug</button>
                </div>
                <div className="product-card" data-category="Clay-Pot Mug">
                  <div className="img-box">
                    <img src="images/Tapayan Clay Cup.png" />
                  </div>
                  <button className="shop-btn">Tapayan Clay Mug</button>
                </div>
                <div className="product-card" data-category="Coaster Set">
                  <div className="img-box">
                    <img src="images/coaster4.jpg" />
                  </div>
                  <button className="shop-btn">SHOP NOW</button>
                </div>
                <div className="product-card" data-category="Coaster Set">
                  <div className="img-box">
                    <img src="images/coaster5.jpg" />
                  </div>
                  <button className="shop-btn">SHOP NOW</button>
                </div>
                <div className="product-card" data-category="Coaster Set">
                  <div className="img-box">
                    <img src="images/coaster1.jpg" />
                  </div>
                  <button className="shop-btn">SHOP NOW</button>
                </div>
                <div className="product-card" data-category="Coaster Set">
                  <div className="img-box">
                    <img src="images/coaster3.jpg" />
                  </div>
                  <button className="shop-btn">SHOP NOW</button>
                </div>
                <div className="product-card" data-category="Coaster Set">
                  <div className="img-box">
                    <img src="./assets/images/coaster2.jpg" />
                  </div>
                  <button className="shop-btn">SHOP NOW</button>
                </div>
                <div className="product-card" data-category="Hand-Made Bags">
                  <div className="img-box">
                    <img src="images/bobatea.jpg" />
                  </div>
                  <button className="shop-btn">Add to Card</button>
                </div>
                <div className="product-card" data-category="Hand-Made Bags">
                  <div className="img-box">
                    <img src="images/chocodrink.jpg" />
                  </div>
                  <button className="shop-btn">Add to Card</button>
                </div>
                <div className="product-card" data-category="Hand-Made Bags">
                  <div className="img-box">
                    <img src="images/matchavanilla.jpg" />
                  </div>
                  <button className="shop-btn">Add to Card</button>
                </div>
                <div className="product-card" data-category="Hand-Made Bags">
                  <div className="img-box">
                    <img src="images/pandangfrappe.jpg" />
                  </div>
                  <button className="shop-btn">Add to Card</button>
                </div>
                <div className="product-card" data-category="Hand-Made Bags">
                  <div className="img-box">
                    <img src="images/ubefrappe.jpg" />
                  </div>
                  <button className="shop-btn">Add to Card</button>
                </div>
              </div>
            </div>
            <button className="carousel-btn next" id="nextBtn">
              ❯
            </button>
          </div>
        </main>
      </div>
      <Newsletter />
      <Footer />
    </>
  );
}

export default Product;
