document.addEventListener("DOMContentLoaded", () => {
    const cat1 = document.getElementById('category-1-grid');
    const cat2 = document.getElementById('category-2-grid');
    const cat3 = document.getElementById('category-3-grid');
    const cat4 = document.getElementById('category-4-grid');
    const cat5 = document.getElementById('category-5-grid');

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

    for (let i = 0; i < 5; i++) {
        cat1.innerHTML += createCard(productData);
        cat2.innerHTML += createCard(productData);
        cat3.innerHTML += createCard(productData);
        cat4.innerHTML += createCard(productData);
        cat5.innerHTML += createCard(productData);
    }
});

let count = 1;
function updateCart() {
    count++;
    document.getElementById('cart-count').innerText = count;
}