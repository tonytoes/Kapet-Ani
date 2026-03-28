document.addEventListener("DOMContentLoaded", () => {
    const categories = [
        document.getElementById('category-1-grid'),
        document.getElementById('category-2-grid'),
        document.getElementById('category-3-grid'),
        document.getElementById('category-4-grid'),
        document.getElementById('category-5-grid')
    ];

    const productData = {
        name: "Cozy Cacao Kit",
        price: "₱250.00",
        desc: "Warm cocoa + spice blend",
        img: "cozy-kit.png" 
    };

    function createCard(data) {
        return `
            <div class="product-card">
                <img src="${data.img}" alt="${data.name}">
                <h3>${data.name}</h3>
                <p style="font-size: 0.65rem; color: #888;">${data.desc}</p>
                <p class="price">${data.price}</p>
                <button class="add-btn" onclick="updateCart()">Add to Cart</button>
            </div>
        `;
    }

    categories.forEach(cat => {
        if(cat) {
            for (let i = 0; i < 10; i++) {
                cat.innerHTML += createCard(productData);
            }
        }
    });
});

function moveCarousel(gridId, direction) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    const viewport = grid.parentElement;
    const card = grid.querySelector('.product-card');
    const cardWidth = card ? card.offsetWidth + 20 : 300; 
    
    viewport.scrollBy({
        left: (cardWidth * 2) * direction,
        behavior: 'smooth'
    });
}

let count = 1;
function updateCart() {
    count++;
    document.getElementById('cart-count').innerText = count;
}