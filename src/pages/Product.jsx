import { useState } from "react";
import "../styles/Product.css";
import Newsletter from "../components/layout/Newsletter.jsx";
import Footer from "../components/layout/Footer.jsx";
import logo from "../assets/images/logo.png"; 
import Navbar2 from "../components/layout/Navbar2.jsx";


function Product() {
  
  return (
    <>
    <Navbar2 activePage="product" />
    <div className="main-wrapper">
      <aside className="sidebar">
        <div className="category-header">Categories <span>▼</span></div>
        <ul className="category-list">
          <li>All Products</li>
          <li>Cold & Specialty Drinks <span>(6)</span></li>
          <li>Hand-Made Baskets <span>(6)</span></li>
          <li>Clay-Pot Mug <span>(6)</span></li>
          <li>Coaster Set <span>(6)</span></li>
          <li className="active">Hand-Made Bags <span>(6)</span></li>
        </ul>
      </aside>

      <main className ="content-area">
        <div className="hero-banner">
          <h1>SHOP COFFEE AND CULTURAL HERITAGE PRODUCTS</h1>
        </div>

        <div className="toolbar">
          <h2 id="current-category">Hand-Made Bags</h2>
          <div className="search-wrap">
            <div className="pager-wrap hide-pager">
              <button id="prevPage" className="pager-btn">&lt;</button>
              <span id="pageInfo">Page 1 of 1</span>
              <button id="nextPage" className="pager-btn">&gt;</button>
            </div>
            
            <input type="text" id="productSearch" placeholder="Search Products..." />
            
            <select className="sort-select">
              <option>Sort By: Best Selling</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="products-container">
          <div className="product-grid" id="productGrid">
            <div className="product-card" data-category="Cold & Specialty Drinks">
              <div className="img-box"><img src="images/bobatea.jpg" /></div>
              <h3 className="product-name">Boba Tea</h3>
              <div className="product-price">₱1,250.00</div>
              <button className="shop-btn">ADD TO CART</button>
            </div>
            <div className="product-card" data-category="Cold & Specialty Drinks">
              <div className="img-box"><img src="images/chocodrink.jpg" /></div>
              <h3 className="product-name">Iced Chocolate</h3>
              <div className="product-price">₱1,250.00</div>
              <button className="shop-btn">ADD TO CART</button>
            </div>
            <div className="product-card" data-category="Cold & Specialty Drinks">
              <div className="img-box"><img src="images/matchavanilla.jpg" /></div>
              <h3 className="product-name">Matcha Vanilla</h3>
              <div className="product-price">₱1,250.00</div>
              <button className="shop-btn">ADD TO CART</button>
            </div>
            <div className="product-card" data-category="Cold & Specialty Drinks">
              <div className="img-box"><img src="images/pandangfrappe.jpg" /></div>
              <h3 className="product-name">Pandan Frappe</h3>
              <div className="product-price">₱1,250.00</div>
              <button className="shop-btn">ADD TO CART</button>
            </div>
            <div className="product-card" data-category="Cold & Specialty Drinks">
              <div className="img-box"><img src="images/ubefrappe.jpg" /></div>
              <h3 className="product-name">Ube Frappe</h3>
              <div className="product-price">₱1,250.00</div>
              <button className="shop-btn">ADD TO CART</button>
            </div>
            <div className="product-card" data-category="Cold & Specialty Drinks">
              <div className="img-box"><img src="images/orangesoda.jpg" /></div>
              <h3 className="product-name">Orange Fizz Soda</h3>
              <div className="product-price">₱1,250.00</div>
              <button className="shop-btn">ADD TO CART</button>
            </div>

            <div className="product-card" data-category="Hand-Made Baskets">
              <div className="img-box"><img src="images/basket1.jpg" /></div>
              <h3 className="product-name">Barako Cold Brew</h3>
              <div className="product-price">₱1,250.00</div>
              <button className="shop-btn">ADD TO CART</button>
            </div>
            <div className="product-card" data-category="Hand-Made Baskets">
              <div className="img-box"><img src="images/basket2.jpg" /></div>
              <h3 className="product-name">Barako Cold Brew</h3>
              <div className="product-price">₱1,250.00</div>
              <button className="shop-btn">ADD TO CART</button>
            </div>
            <div className="product-card" data-category="Hand-Made Baskets">
              <div className="img-box"><img src="images/basket3.jpg" /></div>
              <h3 className="product-name">Barako Cold Brew</h3>
              <div className="product-price">₱1,250.00</div>
              <button className="shop-btn">ADD TO CART</button>
            </div>
            <div className="product-card" data-category="Hand-Made Baskets">
              <div className="img-box"><img src="images/basket4.jpg" /></div>
              <h3 className="product-name">Barako Cold Brew</h3>
              <div className="product-price">₱1,250.00</div>
              <button className="shop-btn">ADD TO CART</button>
            </div>
            <div className="product-card" data-category="Hand-Made Baskets">
              <div className="img-box"><img src="images/basket5.jpg" /></div>
              <h3 className="product-name">Barako Cold Brew</h3>
              <div className="product-price">₱1,250.00</div>
              <button className="shop-btn">ADD TO CART</button>
            </div>
            <div className="product-card" data-category="Hand-Made Baskets">
              <div className="img-box"><img src="images/basket6.jpg" /></div>
              <h3 className="product-name">Barako Cold Brew</h3>
              <div className="product-price">₱1,250.00</div>
              <button className="shop-btn">ADD TO CART</button>
            </div>

            <div className="product-card" data-category="Clay-Pot Mug">
              <div className="img-box"><img src="images/Banga Brew Cup.png" /></div>
              <h3 className="product-name">Barako Cold Brew</h3>
              <div className="product-price">₱1,250.00</div>
              <button className="shop-btn">ADD TO CART</button>
            </div>
            <div className="product-card" data-category="Clay-Pot Mug">
              <div className="img-box"><img src="images/Earthy Ceramic Cup.png" /></div>
              <h3 className="product-name">Barako Cold Brew</h3>
              <div className="product-price">₱1,250.00</div>
              <button className="shop-btn">ADD TO CART</button>
            </div>
            <div className="product-card" data-category="Clay-Pot Mug">
              <div className="img-box"><img src="images/Talavera Brew Cup.png" /></div>
              <h3 className="product-name">Barako Cold Brew</h3>
              <div className="product-price">₱1,250.00</div>
              <button className="shop-btn">ADD TO CART</button>
            </div>
            <div className="product-card" data-category="Clay-Pot Mug">
              <div className="img-box"><img src="images/Terracotta Cup.png" /></div>
              <h3 className="product-name">Barako Cold Brew</h3>
              <div className="product-price">₱1,250.00</div>
              <button className="shop-btn">ADD TO CART</button>
            </div>
            <div className="product-card" data-category="Clay-Pot Mug">
              <div className="img-box"><img src="images/Tapayan Clay Cup.png" /></div>
              <h3 className="product-name">Barako Cold Brew</h3>
              <div className="product-price">₱1,250.00</div>
              <button className="shop-btn">ADD TO CART</button>
            </div>
            <div className="product-card" data-category="Clay-Pot Mug">
              <div className="img-box"><img src="images/Traditional_Mug.png" /></div>
              <h3 className="product-name">Barako Cold Brew</h3>
              <div className="product-price">₱1,250.00</div>
              <button className="shop-btn">ADD TO CART</button>
            </div>

            <div className="product-card" data-category="Coaster Set">
              <div className="img-box"><img src="images/coaster4.jpg" /></div>
              <h3 className="product-name">Barako Cold Brew</h3>
              <div className="product-price">₱1,250.00</div>
              <button className="shop-btn">ADD TO CART</button>
            </div>
            <div className="product-card" data-category="Coaster Set">
              <div className="img-box"><img src="images/coaster5.jpg" /></div>
              <h3 className="product-name">Barako Cold Brew</h3>
              <div className="product-price">₱1,250.00</div>
              <button className="shop-btn">ADD TO CART</button>
            </div>
            <div className="product-card" data-category="Coaster Set">
              <div className="img-box"><img src="images/coaster1.jpg" /></div>
              <h3 className="product-name">Barako Cold Brew</h3>
              <div className="product-price">₱1,250.00</div>
              <button className="shop-btn">ADD TO CART</button>
            </div>
            <div className="product-card" data-category="Coaster Set">
              <div className="img-box"><img src="images/coaster3.jpg" /></div>
              <h3 className="product-name">Barako Cold Brew</h3>
              <div className="product-price">₱1,250.00</div>
              <button className="shop-btn">ADD TO CART</button>
            </div>
            <div className="product-card" data-category="Coaster Set">
              <div className="img-box"><img src="images/coaster2.jpg" /></div>
              <h3 className="product-name">Barako Cold Brew</h3>
              <div className="product-price">₱1,250.00</div>
              <button className="shop-btn">ADD TO CART</button>
            </div>
            <div className="product-card" data-category="Coaster Set">
              <div className="img-box"><img src="images/coaster6.png" /></div>
              <h3 className="product-name">Barako Cold Brew</h3>
              <div className="product-price">₱1,250.00</div>
              <button className="shop-btn">ADD TO CART</button>
            </div>

            <div className="product-card" data-category="Hand-Made Bags">
              <div className="img-box"><img src="images/Banig Bento.webp" /></div>
              <h3 className="product-name">Banig Bento</h3>
              <div className="product-price">₱1,250.00</div>
              <button className="shop-btn">ADD TO CART</button>
            </div>
            <div className="product-card" data-category="Hand-Made Bags">
              <div className="img-box"><img src="images/Banig Boxy.webp" /></div>
              <h3 className="product-name">Banig Boxy</h3>
              <div className="product-price">₱1,250.00</div>
              <button className="shop-btn">ADD TO CART</button>
            </div>
            <div className="product-card" data-category="Hand-Made Bags">
              <div className="img-box"><img src="images/Banig Crossbody.webp" /></div>
              <h3 className="product-name">Banig Crossbody</h3>
              <div className="product-price">₱1,250.00</div>
              <button className="shop-btn">ADD TO CART</button>
            </div>
            <div className="product-card" data-category="Hand-Made Bags">
              <div className="img-box"><img src="images/Banig Filo Classic Premium.webp" /></div>
              <h3 className="product-name">Banig Pinoy Classic</h3>
              <div className="product-price">₱1,250.00</div>
              <button className="shop-btn">ADD TO CART</button>
            </div>
            <div className="product-card" data-category="Hand-Made Bags">
              <div className="img-box"><img src="images/Banig John Tote.webp" /></div>
              <h3 className="product-name">Banig Tote Bag</h3>
              <div className="product-price">₱1,250.00</div>
              <button className="shop-btn">ADD TO CART</button>
            </div>
            <div class="product-card" data-category="Hand-Made Bags">
              <div class="img-box"><img src="images/Banig Small Bag.jpg" /></div>
              <h3 class="product-name">Banig Small Bag</h3>
              <div class="product-price">₱1,250.00</div>
              <button class="shop-btn">ADD TO CART</button>
            </div>
          </div>
        </div>
      </main>
    </div>

      <Newsletter />
      <Footer />
    </>
  );
}

export default Product;