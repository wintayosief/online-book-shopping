// Books page JavaScript

let currentPage = 1;
const booksPerPage = 12;
let filteredBooks = [...books];
let currentFilters = {
    category: '',
    search: '',
    sort: 'title'
};

// Display books with pagination
function displayBooks() {
    const booksGrid = document.getElementById('booksGrid');
    if (!booksGrid) return;

    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const booksToDisplay = filteredBooks.slice(startIndex, endIndex);

    booksGrid.innerHTML = booksToDisplay.map(book => `
        <div class="book-card">
            <img src="${book.image}" alt="${book.title}" class="book-image" onerror="this.src='images/placeholder.svg'">
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">by ${book.author}</p>
                <div class="book-rating">
                    ${generateStars(book.rating)}
                    <span>(${book.rating})</span>
                </div>
                <p class="book-price">$${book.price.toFixed(2)}</p>
                <div class="book-actions">
                    <button onclick="addToCart(${book.id})" class="btn-primary">Add to Cart</button>
                    <a href="book-details.html?id=${book.id}" class="btn-secondary">View Details</a>
                </div>
            </div>
        </div>
    `).join('');

    updatePagination();
}

// Generate star rating display
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let stars = '';

    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }

    // Half star
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }

    return stars;
}

// Update pagination controls
function updatePagination() {
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
    const pageInfo = document.getElementById('pageInfo');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');

    if (pageInfo) {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }

    if (prevPage) {
        prevPage.disabled = currentPage === 1;
        prevPage.style.opacity = currentPage === 1 ? '0.5' : '1';
    }

    if (nextPage) {
        nextPage.disabled = currentPage === totalPages;
        nextPage.style.opacity = currentPage === totalPages ? '0.5' : '1';
    }
}

// Filter books
function filterBooks() {
    let filtered = [...books];

    // Category filter
    if (currentFilters.category) {
        filtered = filtered.filter(book => book.category === currentFilters.category);
    }

    // Search filter
    if (currentFilters.search) {
        filtered = filtered.filter(book =>
            book.title.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
            book.author.toLowerCase().includes(currentFilters.search.toLowerCase())
        );
    }

    // Sort
    switch (currentFilters.sort) {
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
        case 'title':
        default:
            filtered.sort((a, b) => a.title.localeCompare(b.title));
            break;
    }

    filteredBooks = filtered;
    currentPage = 1;
    displayBooks();
}

// Get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Get initial filters from URL
    const urlCategory = getUrlParameter('category');
    const urlSearch = getUrlParameter('search');

    if (urlCategory) {
        currentFilters.category = urlCategory;
        document.getElementById('categoryFilter').value = urlCategory;
    }

    if (urlSearch) {
        currentFilters.search = urlSearch;
        document.getElementById('searchInput').value = urlSearch;
    }

    // Initial display
    filterBooks();

    // Category filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            currentFilters.category = this.value;
            filterBooks();
        });
    }

    // Sort filter
    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            currentFilters.sort = this.value;
            filterBooks();
        });
    }

    // Pagination
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');

    if (prevPage) {
        prevPage.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                displayBooks();
            }
        });
    }

    if (nextPage) {
        nextPage.addEventListener('click', function() {
            const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                displayBooks();
            }
        });
    }

    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            currentFilters.search = searchInput.value.trim();
            filterBooks();
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }
});