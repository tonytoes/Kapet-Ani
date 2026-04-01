document.addEventListener('DOMContentLoaded', () => {
    const listItems = document.querySelectorAll('.category-list li');
    const categoryTitle = document.getElementById('current-category');
    const productCards = Array.from(document.querySelectorAll('.product-card'));
    const pagerWrap = document.querySelector('.pager-wrap');
    
    let currentPage = 1;
    const itemsPerPage = 6;
    let filteredItems = [];

    function updateDisplay(isAllProducts) {
        // Hide everything
        productCards.forEach(card => card.classList.add('hidden'));

        if (isAllProducts) {
            // Show Pager on the left
            pagerWrap.classList.remove('hide-pager');
            
            const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;

            filteredItems.slice(startIndex, endIndex).forEach(card => card.classList.remove('hidden'));

            // Update Page Text
            document.getElementById('pageInfo').innerText = `Page ${currentPage} of ${totalPages}`;
            document.getElementById('prevPage').disabled = (currentPage === 1);
            document.getElementById('nextPage').disabled = (currentPage === totalPages);
        } else {
            // Hide Pager for specific categories
            pagerWrap.classList.add('hide-pager');
            filteredItems.forEach(card => card.classList.remove('hidden'));
        }
    }

    function filterProducts(category) {
        currentPage = 1;
        const isAll = (category === "All Products");

        filteredItems = productCards.filter(card => {
            const cardCategory = card.getAttribute('data-category');
            return (isAll || cardCategory === category);
        });

        updateDisplay(isAll);
    }

    // Pager Listeners
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updateDisplay(true);
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            updateDisplay(true);
        }
    });

    listItems.forEach(item => {
        item.addEventListener('click', () => {
            listItems.forEach(li => li.classList.remove('active'));
            item.classList.add('active');
            const selectedName = item.childNodes[0].textContent.trim();
            categoryTitle.innerText = selectedName;
            filterProducts(selectedName);
        });
    });

    // Default start
    filterProducts("Hand-Made Bags");
});