document.addEventListener('DOMContentLoaded', () => {
    const listItems = document.querySelectorAll('.category-list li');
    const categoryTitle = document.getElementById('current-category');
    const productCards = document.querySelectorAll('.product-card');

    function filterProducts(category) {
        productCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            // Show if "All Products" or if category matches
            if (category === "All Products" || cardCategory === category) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    listItems.forEach(item => {
        item.addEventListener('click', () => {
            // Update Active Class
            listItems.forEach(li => li.classList.remove('active'));
            item.classList.add('active');
            
            // Get text (ignoring the span count)
            const selectedName = item.childNodes[0].textContent.trim();
            categoryTitle.innerText = selectedName;
            
            filterProducts(selectedName);
        });
    });

    // Default view: Hand-Made Bags
    filterProducts("Hand-Made Bags");
});