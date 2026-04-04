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
    <div class="main-wrapper">
      <aside class="sidebar">
        <div class="category-header">Categories <span>▼</span></div>
        <ul class="category-list">
          <li>All Products</li>
          <li>Cold & Specialty Drinks <span>(6)</span></li>
          <li>Hand-Made Baskets <span>(6)</span></li>
          <li>Clay-Pot Mug <span>(6)</span></li>
          <li>Coaster Set <span>(6)</span></li>
          <li class="active">Hand-Made Bags <span>(6)</span></li>
        </ul>
      </aside>

      <main class="content-area">
        <div class="hero-banner">
          <h1>SHOP COFFEE AND CULTURAL HERITAGE PRODUCTS</h1>
        </div>

        <div class="toolbar">
          <h2 id="current-category">Hand-Made Bags</h2>
          <div class="search-wrap">
            <div class="pager-wrap hide-pager">
              <button id="prevPage" class="pager-btn">&lt;</button>
              <span id="pageInfo">Page 1 of 1</span>
              <button id="nextPage" class="pager-btn">&gt;</button>
            </div>
            
            <input type="text" id="productSearch" placeholder="Search Products..." />
            
            <select class="sort-select">
              <option>Sort By: Best Selling</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        <div class="products-container">
          <div class="product-grid" id="productGrid">
            <div class="product-card" data-category="Cold & Specialty Drinks">
              <div class="img-box"><img src="images/bobatea.jpg" /></div>
              <h3 class="product-name">Boba Tea</h3>
              <div class="product-price">₱1,250.00</div>
              <button class="shop-btn">ADD TO CART</button>
            </div>
            <div class="product-card" data-category="Cold & Specialty Drinks">
              <div class="img-box"><img src="images/chocodrink.jpg" /></div>
              <h3 class="product-name">Iced Chocolate</h3>
              <div class="product-price">₱1,250.00</div>
              <button class="shop-btn">ADD TO CART</button>
            </div>
            <div class="product-card" data-category="Cold & Specialty Drinks">
              <div class="img-box"><img src="images/matchavanilla.jpg" /></div>
              <h3 class="product-name">Matcha Vanilla</h3>
              <div class="product-price">₱1,250.00</div>
              <button class="shop-btn">ADD TO CART</button>
            </div>
            <div class="product-card" data-category="Cold & Specialty Drinks">
              <div class="img-box"><img src="images/pandangfrappe.jpg" /></div>
              <h3 class="product-name">Pandan Frappe</h3>
              <div class="product-price">₱1,250.00</div>
              <button class="shop-btn">ADD TO CART</button>
            </div>
            <div class="product-card" data-category="Cold & Specialty Drinks">
              <div class="img-box"><img src="images/ubefrappe.jpg" /></div>
              <h3 class="product-name">Ube Frappe</h3>
              <div class="product-price">₱1,250.00</div>
              <button class="shop-btn">ADD TO CART</button>
            </div>
            <div class="product-card" data-category="Cold & Specialty Drinks">
              <div class="img-box"><img src="images/orangesoda.jpg" /></div>
              <h3 class="product-name">Orange Fizz Soda</h3>
              <div class="product-price">₱1,250.00</div>
              <button class="shop-btn">ADD TO CART</button>
            </div>

            <div class="product-card" data-category="Hand-Made Baskets">
              <div class="img-box"><img src="images/basket1.jpg" /></div>
              <h3 class="product-name">Barako Cold Brew</h3>
              <div class="product-price">₱1,250.00</div>
              <button class="shop-btn">ADD TO CART</button>
            </div>
            <div class="product-card" data-category="Hand-Made Baskets">
              <div class="img-box"><img src="images/basket2.jpg" /></div>
              <h3 class="product-name">Barako Cold Brew</h3>
              <div class="product-price">₱1,250.00</div>
              <button class="shop-btn">ADD TO CART</button>
            </div>
            <div class="product-card" data-category="Hand-Made Baskets">
              <div class="img-box"><img src="images/basket3.jpg" /></div>
              <h3 class="product-name">Barako Cold Brew</h3>
              <div class="product-price">₱1,250.00</div>
              <button class="shop-btn">ADD TO CART</button>
            </div>
            <div class="product-card" data-category="Hand-Made Baskets">
              <div class="img-box"><img src="images/basket4.jpg" /></div>
              <h3 class="product-name">Barako Cold Brew</h3>
              <div class="product-price">₱1,250.00</div>
              <button class="shop-btn">ADD TO CART</button>
            </div>
            <div class="product-card" data-category="Hand-Made Baskets">
              <div class="img-box"><img src="images/basket5.jpg" /></div>
              <h3 class="product-name">Barako Cold Brew</h3>
              <div class="product-price">₱1,250.00</div>
              <button class="shop-btn">ADD TO CART</button>
            </div>
            <div class="product-card" data-category="Hand-Made Baskets">
              <div class="img-box"><img src="images/basket6.jpg" /></div>
              <h3 class="product-name">Barako Cold Brew</h3>
              <div class="product-price">₱1,250.00</div>
              <button class="shop-btn">ADD TO CART</button>
            </div>

            <div class="product-card" data-category="Clay-Pot Mug">
              <div class="img-box"><img src="images/Banga Brew Cup.png" /></div>
              <h3 class="product-name">Barako Cold Brew</h3>
              <div class="product-price">₱1,250.00</div>
              <button class="shop-btn">ADD TO CART</button>
            </div>
            <div class="product-card" data-category="Clay-Pot Mug">
              <div class="img-box"><img src="images/Earthy Ceramic Cup.png" /></div>
              <h3 class="product-name">Barako Cold Brew</h3>
              <div class="product-price">₱1,250.00</div>
              <button class="shop-btn">ADD TO CART</button>
            </div>
            <div class="product-card" data-category="Clay-Pot Mug">
              <div class="img-box"><img src="images/Talavera Brew Cup.png" /></div>
              <h3 class="product-name">Barako Cold Brew</h3>
              <div class="product-price">₱1,250.00</div>
              <button class="shop-btn">ADD TO CART</button>
            </div>
            <div class="product-card" data-category="Clay-Pot Mug">
              <div class="img-box"><img src="images/Terracotta Cup.png" /></div>
              <h3 class="product-name">Barako Cold Brew</h3>
              <div class="product-price">₱1,250.00</div>
              <button class="shop-btn">ADD TO CART</button>
            </div>
            <div class="product-card" data-category="Clay-Pot Mug">
              <div class="img-box"><img src="images/Tapayan Clay Cup.png" /></div>
              <h3 class="product-name">Barako Cold Brew</h3>
              <div class="product-price">₱1,250.00</div>
              <button class="shop-btn">ADD TO CART</button>
            </div>
            <div class="product-card" data-category="Clay-Pot Mug">
              <div class="img-box"><img src="images/Traditional_Mug.png" /></div>
              <h3 class="product-name">Barako Cold Brew</h3>
              <div class="product-price">₱1,250.00</div>
              <button class="shop-btn">ADD TO CART</button>
            </div>

            <div class="product-card" data-category="Coaster Set">
              <div class="img-box"><img src="images/coaster4.jpg" /></div>
              <h3 class="product-name">Barako Cold Brew</h3>
              <div class="product-price">₱1,250.00</div>
              <button class="shop-btn">ADD TO CART</button>
            </div>
            <div class="product-card" data-category="Coaster Set">
              <div class="img-box"><img src="images/coaster5.jpg" /></div>
              <h3 class="product-name">Barako Cold Brew</h3>
              <div class="product-price">₱1,250.00</div>
              <button class="shop-btn">ADD TO CART</button>
            </div>
            <div class="product-card" data-category="Coaster Set">
              <div class="img-box"><img src="images/coaster1.jpg" /></div>
              <h3 class="product-name">Barako Cold Brew</h3>
              <div class="product-price">₱1,250.00</div>
              <button class="shop-btn">ADD TO CART</button>
            </div>
            <div class="product-card" data-category="Coaster Set">
              <div class="img-box"><img src="images/coaster3.jpg" /></div>
              <h3 class="product-name">Barako Cold Brew</h3>
              <div class="product-price">₱1,250.00</div>
              <button class="shop-btn">ADD TO CART</button>
            </div>
            <div class="product-card" data-category="Coaster Set">
              <div class="img-box"><img src="images/coaster2.jpg" /></div>
              <h3 class="product-name">Barako Cold Brew</h3>
              <div class="product-price">₱1,250.00</div>
              <button class="shop-btn">ADD TO CART</button>
            </div>
            <div class="product-card" data-category="Coaster Set">
              <div class="img-box"><img src="images/coaster6.png" /></div>
              <h3 class="product-name">Barako Cold Brew</h3>
              <div class="product-price">₱1,250.00</div>
              <button class="shop-btn">ADD TO CART</button>
            </div>

            <div class="product-card" data-category="Hand-Made Bags">
              <div class="img-box"><img src="images/Banig Bento.webp" /></div>
              <h3 class="product-name">Banig Bento</h3>
              <div class="product-price">₱1,250.00</div>
              <button class="shop-btn">ADD TO CART</button>
            </div>
            <div class="product-card" data-category="Hand-Made Bags">
              <div class="img-box"><img src="images/Banig Boxy.webp" /></div>
              <h3 class="product-name">Banig Boxy</h3>
              <div class="product-price">₱1,250.00</div>
              <button class="shop-btn">ADD TO CART</button>
            </div>
            <div class="product-card" data-category="Hand-Made Bags">
              <div class="img-box"><img src="images/Banig Crossbody.webp" /></div>
              <h3 class="product-name">Banig Crossbody</h3>
              <div class="product-price">₱1,250.00</div>
              <button class="shop-btn">ADD TO CART</button>
            </div>
            <div class="product-card" data-category="Hand-Made Bags">
              <div class="img-box"><img src="images/Banig Filo Classic Premium.webp" /></div>
              <h3 class="product-name">Banig Pinoy Classic</h3>
              <div class="product-price">₱1,250.00</div>
              <button class="shop-btn">ADD TO CART</button>
            </div>
            <div class="product-card" data-category="Hand-Made Bags">
              <div class="img-box"><img src="images/Banig John Tote.webp" /></div>
              <h3 class="product-name">Banig Tote Bag</h3>
              <div class="product-price">₱1,250.00</div>
              <button class="shop-btn">ADD TO CART</button>
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