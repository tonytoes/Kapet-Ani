document.addEventListener('DOMContentLoaded', () => {
    const listItems = document.querySelectorAll('.category-list li');
    const categoryTitle = document.getElementById('current-category');
    const productCards = document.querySelectorAll('.product-card');
    const viewport = document.getElementById('carouselViewport');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    function filterProducts(category) {
        productCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (category === "All Products" || cardCategory === category) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
        viewport.scrollLeft = 0;
    }

    listItems.forEach(item => {
        item.addEventListener('click', () => {
            listItems.forEach(li => li.classList.remove('active'));
            item.classList.add('active');
            
            const selectedName = item.childNodes[0].textContent.trim();
            categoryTitle.innerText = selectedName;
            
            filterProducts(selectedName);
        });
    });

    const scrollAmount = 230 * 4; 
    if (nextBtn && prevBtn && viewport) {
        nextBtn.addEventListener('click', () => viewport.scrollBy({ left: scrollAmount, behavior: 'smooth' }));
        prevBtn.addEventListener('click', () => viewport.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
    }

    filterProducts("Hand-Made Bags");
});