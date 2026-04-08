import { useState, useEffect, useCallback } from "react";
import "../styles/Product.css";
import Newsletter from "../components/layout/Newsletter.jsx";
import Footer from "../components/layout/Footer.jsx";
import Navbar2 from "../components/layout/Navbar2.jsx";
import ProductModal from "../components/layout/ProductModal.jsx";

import bobatea from "../assets/images/bobatea.jpg";
import chocodrink from "../assets/images/chocodrink.jpg";
import matchavanilla from "../assets/images/matchavanilla2.jpg";
import pandangfrappe from "../assets/images/pandangfrappe.jpg";
import ubefrappe from "../assets/images/ubefrappe.jpg";
import orangesoda from "../assets/images/orangesoda.jpg";

import basket1 from "../assets/images/basket1.jpg";
import basket2 from "../assets/images/basket2.jpg";
import basket3 from "../assets/images/basket3.jpg";
import basket4 from "../assets/images/basket4.jpg";
import basket5 from "../assets/images/basket5.jpg";
import basket6 from "../assets/images/basket6.jpg";

function Product() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("Hand-Made Bags");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredItems, setFilteredItems] = useState([]);
  const itemsPerPage = 6;

const allProductCards = [
  // Cold & Specialty Drinks (6)
  { 
    id: 1, category: "Cold & Specialty Drinks", name: "Boba Tea", price: 1250.0, originalPrice: 1500.0, onSale: true, img: bobatea, image: bobatea, description: "Delicious boba tea with premium tea leaves and chewy tapioca pearls.", dimensions: { length: 10, height: 20, width: 10, weight: 500 }
  },
  { 
    id: 2, category: "Cold & Specialty Drinks", name: "Iced Chocolate", price: 1250.0, originalPrice: 1500.0, onSale: true, img: chocodrink, image: chocodrink, description: "Rich creamy iced chocolate made with premium cocoa.", dimensions: { length: 10, height: 20, width: 10, weight: 500 }
  },
  { 
    id: 3, category: "Cold & Specialty Drinks", name: "Matcha Vanilla", price: 1250.0, originalPrice: 1500.0, onSale: true, img: matchavanilla, image: matchavanilla, description: "Smooth matcha blended with vanilla for unique flavor.", dimensions: { length: 10, height: 20, width: 10, weight: 500 }
  },
  { 
    id: 4, category: "Cold & Specialty Drinks", name: "Pandan Frappe", price: 1250.0, originalPrice: 1500.0, onSale: true, img: pandangfrappe, image: pandangfrappe, description: "Exotic pandan frappe with creamy texture.", dimensions: { length: 10, height: 20, width: 10, weight: 500 }
  },
  { 
    id: 5, category: "Cold & Specialty Drinks", name: "Ube Frappe", price: 1250.0, originalPrice: 1500.0, onSale: true, img: ubefrappe, image: ubefrappe, description: "Purple yam frappe - sweet Filipino favorite.", dimensions: { length: 10, height: 20, width: 10, weight: 500 }
  },
  { 
    id: 6, category: "Cold & Specialty Drinks", name: "Orange Fizz Soda", price: 1250.0, originalPrice: 1500.0, onSale: true, img: orangesoda, image: orangesoda, description: "Sparkling orange soda with citrus burst.", dimensions: { length: 10, height: 20, width: 10, weight: 500 }
  },

  // Hand-Made Baskets (6)
  { 
    id: 7, category: "Hand-Made Baskets", name: "Abaca Basket 1", price: 1250.0, originalPrice: 1500.0, onSale: true, img: basket1, image: basket1, description: "Handwoven abaca basket for stylish storage.", dimensions: { length: 12, height: 8, width: 12, weight: 800 }
  },
  { 
    id: 8, category: "Hand-Made Baskets", name: "Abaca Basket 2", price: 1350.0, originalPrice: 1600.0, onSale: true, img: basket2, image: basket2, description: "Medium abaca basket with natural patterns.", dimensions: { length: 14, height: 10, width: 14, weight: 900 }
  },
  { 
    id: 9, category: "Hand-Made Baskets", name: "Abaca Basket 3", price: 1450.0, originalPrice: 1700.0, onSale: true, img: basket3, image: basket3, description: "Large abaca basket for laundry storage.", dimensions: { length: 16, height: 12, width: 16, weight: 1100 }
  },
  { 
    id: 10, category: "Hand-Made Baskets", name: "Rattan Basket", price: 1850.0, originalPrice: 2100.0, onSale: true, img: basket4, image: basket4, description: "Elegant rattan basket with sturdy construction.", dimensions: { length: 14, height: 10, width: 14, weight: 950 }
  },
  { 
    id: 11, category: "Hand-Made Baskets", name: "Bamboo Basket", price: 1350.0, originalPrice: 1600.0, onSale: true, img: basket5, image: basket5, description: "Lightweight bamboo basket with traditional weave.", dimensions: { length: 12, height: 8, width: 12, weight: 700 }
  },
  { 
    id: 12, category: "Hand-Made Baskets", name: "Seagrass Basket", price: 1550.0, originalPrice: 1800.0, onSale: true, img: basket6, image: basket6, description: "Beautiful seagrass basket with coastal charm.", dimensions: { length: 16, height: 12, width: 16, weight: 1000 }
  },

  // Clay-Pot Mug (6)
  { 
    id: 13, category: "Clay-Pot Mug", name: "Banga Brew Cup", price: 850.0, originalPrice: 1100.0, onSale: true, img: "../assets/images/Banga Brew Cup.png", image: "../../assets/images/Banga Brew Cup.png", description: "Traditional clay pot mug for hot beverages.", dimensions: { length: 4, height: 5, width: 4, weight: 400 }
  },
  { 
    id: 14, category: "Clay-Pot Mug", name: "Earthy Ceramic Cup", price: 950.0, originalPrice: 1200.0, onSale: true, img: "../assets/images/Earthy Ceramic Cup.png", image: "../../assets/images/Earthy Ceramic Cup.png", description: "Handcrafted ceramic cup with earthy tones.", dimensions: { length: 4.5, height: 5.5, width: 4.5, weight: 450 }
  },
  { 
    id: 15, category: "Clay-Pot Mug", name: "Talavera Brew Cup", price: 1050.0, originalPrice: 1300.0, onSale: true, img: "../assets/images/Talavera Brew Cup.png", image: "../../assets/images/Talavera Brew Cup.png", description: "Colorful Talavera-style clay mug.", dimensions: { length: 4, height: 5, width: 4, weight: 420 }
  },
  { 
    id: 16, category: "Clay-Pot Mug", name: "Terracotta Cup", price: 750.0, originalPrice: 1000.0, onSale: true, img: "../assets/images/Terracotta Cup.png", image: "../../assets/images/Terracotta Cup.png", description: "Classic terracotta mug with rustic charm.", dimensions: { length: 3.5, height: 4.5, width: 3.5, weight: 350 }
  },
  { 
    id: 17, category: "Clay-Pot Mug", name: "Tapayan Clay Cup", price: 900.0, originalPrice: 1150.0, onSale: true, img: "../assets/images/Tapayan Clay Cup.png", image: "../../assets/images/Tapayan Clay Cup.png", description: "Traditional Filipino clay cup design.", dimensions: { length: 4, height: 5, width: 4, weight: 380 }
  },
  { 
    id: 18, category: "Clay-Pot Mug", name: "Traditional Mug", price: 800.0, originalPrice: 1050.0, onSale: true, img: "../assets/images/Traditional_Mug.png", image: "../../assets/images/Traditional_Mug.png", description: "Authentic traditional clay mug.", dimensions: { length: 4, height: 4.5, width: 4, weight: 360 }
  },

  // Coaster Set (6)
  { 
    id: 19, category: "Coaster Set", name: "Abaca Coaster Set", price: 650.0, originalPrice: 850.0, onSale: true, img: "../assets/images/coaster4.jpg", image: "../../assets/images/coaster4.jpg", description: "Set of 6 handwoven abaca coasters.", dimensions: { length: 4, height: 0.5, width: 4, weight: 200 }
  },
  { 
    id: 20, category: "Coaster Set", name: "Rattan Coaster Set", price: 750.0, originalPrice: 950.0, onSale: true, img: "../assets/images/coaster5.jpg", image: "../../assets/images/coaster5.jpg", description: "Premium rattan coaster set of 6 pieces.", dimensions: { length: 4, height: 0.5, width: 4, weight: 250 }
  },
  { 
    id: 21, category: "Coaster Set", name: "Seagrass Coasters", price: 550.0, originalPrice: 750.0, onSale: true, img: "../assets/images/coaster1.jpg", image: "../../assets/images/coaster1.jpg", description: "Coastal seagrass coaster set (6 pieces).", dimensions: { length: 4, height: 0.5, width: 4, weight: 180 }
  },
  { 
    id: 22, category: "Coaster Set", name: "Bamboo Coasters", price: 600.0, originalPrice: 800.0, onSale: true, img: "../assets/images/coaster3.jpg", image: "../../assets/images/coaster3.jpg", description: "Eco-friendly bamboo coaster set.", dimensions: { length: 4, height: 0.5, width: 4, weight: 220 }
  },
  { 
    id: 23, category: "Coaster Set", name: "Palm Leaf Coasters", price: 700.0, originalPrice: 900.0, onSale: true, img: "../assets/images/coaster2.jpg", image: "../../assets/images/coaster2.jpg", description: "Unique palm leaf coaster set of 6.", dimensions: { length: 4, height: 0.5, width: 4, weight: 210 }
  },
  { 
    id: 24, category: "Coaster Set", name: "Clay Coaster Set", price: 800.0, originalPrice: 1000.0, onSale: true, img: "../assets/images/coaster6.png", image: "../../assets/images/coaster6.png", description: "Handmade clay coaster set with natural finish.", dimensions: { length: 4, height: 0.5, width: 4, weight: 300 }
  },

  // Hand-Made Bags (6)
  { 
    id: 25, category: "Hand-Made Bags", name: "Banig Bento", price: 2250.0, originalPrice: 2500.0, onSale: true, img: "../assets/images/Banig Bento.webp", image: "../../assets/images/Banig Bento.webp", description: "Compact banig bento bag for daily essentials.", dimensions: { length: 10, height: 8, width: 4, weight: 400 }
  },
  { 
    id: 26, category: "Hand-Made Bags", name: "Banig Boxy", price: 2450.0, originalPrice: 2700.0, onSale: true, img: "../assets/images/Banig Boxy.webp", image: "../../assets/images/Banig Boxy.webp", description: "Structured boxy banig bag with modern design.", dimensions: { length: 12, height: 10, width: 5, weight: 500 }
  },
  { 
    id: 27, category: "Hand-Made Bags", name: "Banig Crossbody", price: 1950.0, originalPrice: 2200.0, onSale: true, img: "../assets/images/Banig Crossbody.webp", image: "../../assets/images/Banig Crossbody.webp", description: "Convenient crossbody banig bag.", dimensions: { length: 9, height: 7, width: 3, weight: 350 }
  },
  { 
    id: 28, category: "Hand-Made Bags", name: "Banig Pinoy Classic", price: 2650.0, originalPrice: 2900.0, onSale: true, img: "../assets/images/Banig Filo Classic Premium.webp", image: "../../assets/images/Banig Filo Classic Premium.webp", description: "Classic Filipino banig bag with premium craftsmanship.", dimensions: { length: 14, height: 12, width: 6, weight: 600 }
  },
  { 
    id: 29, category: "Hand-Made Bags", name: "Banig Tote Bag", price: 2150.0, originalPrice: 2400.0, onSale: true, img: "../assets/images/Banig John Tote.webp", image: "../../assets/images/Banig John Tote.webp", description: "Spacious tote bag made from traditional banig.", dimensions: { length: 15, height: 13, width: 5, weight: 550 }
  },
  { 
    id: 30, category: "Hand-Made Bags", name: "Banig Small Bag", price: 1750.0, originalPrice: 2000.0, onSale: true, img: "../assets/images/Banig Small Bag.jpg", image: "../../assets/images/Banig Small Bag.jpg", description: "Chic small banig bag perfect for evenings.", dimensions: { length: 8, height: 6, width: 3, weight: 300 }
  }
];

  const categories = [
    "All Products",
    "Cold & Specialty Drinks",
    "Hand-Made Baskets",
    "Clay-Pot Mug",
    "Coaster Set",
    "Hand-Made Bags"
  ];

  // Filter products based on category
  const filterProducts = useCallback((category) => {
    setCurrentPage(1);
    const isAll = category === "All Products";
    
    const filtered = allProductCards.filter(card => {
      return isAll || card.category === category;
    });
    
    setFilteredItems(filtered);
  }, [allProductCards]);

  // Update display logic
  const getVisibleItems = useCallback(() => {
    const isAllProducts = currentCategory === "All Products";
    
    if (!isAllProducts) {
      return filteredItems;
    }
    
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return filteredItems.slice(startIndex, endIndex);
  }, [currentCategory, currentPage, filteredItems, itemsPerPage]);

  // Pager info
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const isAllProducts = currentCategory === "All Products";
  const showPager = isAllProducts && filteredItems.length > itemsPerPage;

  // Handle product click - open modal
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Handle category selection
  const handleCategoryClick = (category) => {
    setCurrentCategory(category);
    filterProducts(category);
  };

  // Handle pagination
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Initialize with default category
  useEffect(() => {
    filterProducts("Hand-Made Bags");
  }, []);

  // Re-filter when category changes
  useEffect(() => {
    filterProducts(currentCategory);
  }, [currentCategory, filterProducts]);

  const visibleItems = getVisibleItems();

  return (
    <>
      <Navbar2 activePage="product" />
      <div className="main-wrapper">
        <aside className="sidebar">
          <div className="category-header">Categories <span>▼</span></div>
          <ul className="category-list">
            {categories.map((category) => (
              <li 
                key={category}
                className={currentCategory === category ? 'active' : ''}
                onClick={() => handleCategoryClick(category)}
              >
                {category} <span>(6)</span>
              </li>
            ))}
          </ul>
        </aside>

        <main className="content-area">
          <div className="hero-banner">
            <h1>SHOP COFFEE AND CULTURAL HERITAGE PRODUCTS</h1>
          </div>

          <div className="toolbar">
            <h2>{currentCategory}</h2>
            <div className="search-wrap">
              <div className={`pager-wrap ${showPager ? '' : 'hide-pager'}`}>
                <button 
                  className="pager-btn"
                  disabled={currentPage === 1}
                  onClick={handlePrevPage}
                >
                  &lt;
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button 
                  className="pager-btn"
                  disabled={currentPage === totalPages}
                  onClick={handleNextPage}
                >
                  &gt;
                </button>
              </div>
              
              <input type="text" placeholder="Search Products..." />
              
              <select className="sort-select">
                <option>Sort By: Best Selling</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="products-container">
            <div className="product-grid">
              {visibleItems.map((product) => (
                <div 
                  key={product.id}
                  className={`product-card clickable ${product.category}`}
                  data-category={product.category}
                  onClick={() => handleProductClick(product)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="img-box">
                    <img src={product.img} alt={product.name} />
                  </div>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-price">{product.price.toLocaleString('en-US', {style: 'currency', currency: 'PHP'})}</div>
                  <button className="shop-btn">ADD TO CART</button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Product Modal */}
      {isModalOpen && selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={closeModal}
        />
      )}

      <Newsletter />
      <Footer />
    </>
  );
}

export default Product;