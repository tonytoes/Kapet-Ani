import { useState, useEffect, useCallback } from "react";
import "../styles/Product.css";
import Newsletter from "../components/layout/Newsletter.jsx";
import Footer from "../components/layout/Footer.jsx";
import Navbar2 from "../components/layout/Navbar2.jsx";
import ProductModal from "../components/layout/ProductModal.jsx";
import { LINK_PATH } from "../admin/data/LinkPath.jsx";
import { getCartItems, saveCartItems } from "../utils/cart";

const API_PRODUCTS = `${LINK_PATH}Inventorycontroller.php`;
const API_CATEGORIES = `${LINK_PATH}Inventorycontroller.php?resource=categories`;
const API_CONTENT = `${LINK_PATH}WebsiteContentController.php?page=product`;

const PRODUCT_DEFAULTS = {
  allProductsLabel: "All Products",
  categoriesTitle: "Categories",
  heroTitle: "SHOP COFFEE AND CULTURAL HERITAGE PRODUCTS",
  searchPlaceholder: "Search Products...",
  pagerLabel: "Page",
  pagerOfLabel: "of",
  sortFeaturedLabel: "Sort By: Featured",
  sortLowLabel: "Price: Low to High",
  sortHighLabel: "Price: High to Low",
  loadingProductsLabel: "Loading products...",
  noProductsLabel: "No products found.",
  addToCartLabel: "ADD TO CART",
  outOfStockLabel: "OUT OF STOCK",
  modalBreadcrumb: "Collection / Studio Pieces",
  modalOutOfStock: "Out of Stock",
  modalItemAdded: "Item Added",
  modalAddToCart: "Add to Cart",
  modalStock: "Stock",
  modalCategory: "Category",
  modalStatus: "Status",
  modalInStock: "In Stock",
  modalLocalProduct: "Local Product",
  modalActiveStatus: "Active",
};

function Product() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All Products"]);
  const [currentCategory, setCurrentCategory] = useState("All Products");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("best");
  const [loading, setLoading] = useState(true);
  const [contentMap, setContentMap] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredItems, setFilteredItems] = useState([]);
  const itemsPerPage = 6;

  const addToCart = useCallback((product) => {
    const current = getCartItems();
    const match = current.find((i) => i.id === product.id);
    if (match) {
      match.qty += 1;
    } else {
      current.push({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.discount,
        stock: Number(product.qty || 0),
        qty: 1,
      });
    }
    saveCartItems(current);
  }, []);

  const formatCurrency = useCallback((n) =>
    Number(n || 0).toLocaleString("en-PH", { style: "currency", currency: "PHP" }), []);

  const normalizeProducts = useCallback((rows = []) => {
    return rows
      .map((p) => {
        const base = Number(p.price || 0);
        const discount = Number(p.discount || 0);
        const total = Number(p.totalprice || base);
        const finalPrice = discount > 0 ? total : base;
        return {
          id: p.id,
          category: p.category || "Uncategorized",
          name: p.name,
          description: p.description || "No description available.",
          originalPrice: base,
          price: finalPrice,
          discount,
          onSale: discount > 0,
          qty: Number(p.qty || 0),
          status: p.status,
          img: p.image_url || "https://via.placeholder.com/240x240?text=No+Image",
          image: p.image_url || "https://via.placeholder.com/640x640?text=No+Image",
        };
      })
      .filter((p) => p.name);
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        fetch(API_PRODUCTS),
        fetch(API_CATEGORIES),
      ]);
      const pData = await pRes.json();
      const cData = await cRes.json();
      const normalized = normalizeProducts(pData?.products || []);
      setProducts(normalized);
      const catNames = (cData?.categories || []).map((c) => c.name).filter(Boolean);
      const fromProducts = [...new Set(normalized.map((p) => p.category))];
      const merged = [PRODUCT_DEFAULTS.allProductsLabel, ...new Set([...catNames, ...fromProducts])];
      setCategories(merged);
    } catch {
      setProducts([]);
      setCategories([PRODUCT_DEFAULTS.allProductsLabel]);
    } finally {
      setLoading(false);
    }
  }, [normalizeProducts]);

  // Filter products based on category
  const filterProducts = useCallback((category, searchText = search, order = sortOrder) => {
    setCurrentPage(1);
    const isAll = category === (contentMap.allProductsLabel?.title || PRODUCT_DEFAULTS.allProductsLabel);

    let filtered = products.filter((card) => {
      const passCategory = isAll || card.category === category;
      const q = searchText.trim().toLowerCase();
      const passSearch = !q || card.name.toLowerCase().includes(q) || card.category.toLowerCase().includes(q);
      return passCategory && passSearch;
    });

    if (order === "low") filtered.sort((a, b) => a.price - b.price);
    if (order === "high") filtered.sort((a, b) => b.price - a.price);

    setFilteredItems(filtered);
  }, [products, search, sortOrder]);

  // Update display logic
  const getVisibleItems = useCallback(() => {
    const isAllProducts = currentCategory === (contentMap.allProductsLabel?.title || PRODUCT_DEFAULTS.allProductsLabel);
    
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
  const isAllProducts = currentCategory === (contentMap.allProductsLabel?.title || PRODUCT_DEFAULTS.allProductsLabel);
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
    filterProducts(category, search, sortOrder);
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

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

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

  // Re-filter when list controls change
  useEffect(() => {
    filterProducts(currentCategory, search, sortOrder);
  }, [currentCategory, search, sortOrder, filterProducts]);

  const visibleItems = getVisibleItems();
  const txt = (key) => contentMap[key]?.title || contentMap[key]?.description || PRODUCT_DEFAULTS[key] || "";
  const categoryCounts = categories.reduce((acc, category) => {
    if (category === txt("allProductsLabel")) {
      acc[category] = products.length;
      return acc;
    }
    acc[category] = products.filter((p) => p.category === category).length;
    return acc;
  }, {});

  return (
    <>
      <Navbar2 activePage="product" />
      <div className="main-wrapper">
        <aside className="sidebar">
          <div className="category-header">{txt("categoriesTitle")} <span>▼</span></div>
          <ul className="category-list">
            {categories.map((category) => (
              <li 
                key={category}
                className={currentCategory === category ? 'active' : ''}
                onClick={() => handleCategoryClick(category)}
              >
                {category} <span>({categoryCounts[category] || 0})</span>
              </li>
            ))}
          </ul>
        </aside>

        <main className="content-area">
          <div className="hero-banner">
            <h1>{txt("heroTitle")}</h1>
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
                <span>{txt("pagerLabel")} {currentPage} {txt("pagerOfLabel")} {totalPages}</span>
                <button 
                  className="pager-btn"
                  disabled={currentPage === totalPages}
                  onClick={handleNextPage}
                >
                  &gt;
                </button>
              </div>
              
              <input
                id="productSearch"
                type="text"
                placeholder={txt("searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select className="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="best">{txt("sortFeaturedLabel")}</option>
                <option value="low">{txt("sortLowLabel")}</option>
                <option value="high">{txt("sortHighLabel")}</option>
              </select>
            </div>
          </div>

          <div className="products-container">
            <div className="product-grid">
              {loading && <div>{txt("loadingProductsLabel")}</div>}
              {!loading && visibleItems.length === 0 && <div>{txt("noProductsLabel")}</div>}
              {!loading && visibleItems.map((product) => (
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
                  <div className="product-price">{formatCurrency(product.price)}</div>
                  <div className="product-discount-row">
                    {product.onSale ? (
                      <>
                        <span style={{ textDecoration: "line-through", color: "#9CA3AF", marginRight: 6 }}>{formatCurrency(product.originalPrice)}</span>
                        <span style={{ color: "#B45309", fontWeight: 700 }}>-{product.discount}%</span>
                      </>
                    ) : (
                      <span className="product-discount-placeholder">.</span>
                    )}
                  </div>
                  <button
                    className="shop-btn"
                    disabled={product.qty <= 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (product.qty > 0) addToCart(product);
                    }}
                  >
                    {product.qty <= 0 ? txt("outOfStockLabel") : txt("addToCartLabel")}
                  </button>
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
          onAddToCart={addToCart}
          formatCurrency={formatCurrency}
          labels={{
            breadcrumb: txt("modalBreadcrumb"),
            outOfStock: txt("modalOutOfStock"),
            itemAdded: txt("modalItemAdded"),
            addToCart: txt("modalAddToCart"),
            stock: txt("modalStock"),
            category: txt("modalCategory"),
            status: txt("modalStatus"),
            inStock: txt("modalInStock"),
            localProduct: txt("modalLocalProduct"),
            activeStatus: txt("modalActiveStatus"),
          }}
        />
      )}

      <Newsletter />
      <Footer />
    </>
  );
}

export default Product;