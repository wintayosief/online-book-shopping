// Main JavaScript for BookHaven

// Sample book data
const books = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        price: 5.99,
        category: "classic",
        image: "https://upload.wikimedia.org/wikipedia/commons/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg",
        description: "A classic American novel set in the Jazz Age.",
        rating: 4.5
    },
    {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        price: 14.99,
        category: "classic",
        image: "https://upload.wikimedia.org/wikipedia/commons/4/4f/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg",
        description: "A powerful story about racial injustice and childhood.",
        rating: 4.8
    },
    {
        id: 3,
        title: "1984",
        author: "George Orwell",
        price: 13.99,
        category: "sci-fi",
        image: "https://i.imgur.com/3MZQ9yu.jpg",
        description: "A dystopian novel about totalitarianism and surveillance.",
        rating: 4.6
    },
    {
        id: 4,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        price: 11.99,
        category: "romance",
        image: "https://upload.wikimedia.org/wikipedia/commons/1/17/PrideAndPrejudiceTitlePage.jpg",
        description: "A romantic novel about love, marriage, and social class.",
        rating: 4.7
    },
    {
        id: 5,
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        price: 10.99,
        category: "classic",
        image: "https://upload.wikimedia.org/wikipedia/en/3/32/Rye_catcher.jpg",
        description: "A coming-of-age story about teenage rebellion.",
        rating: 4.3
    },
    {
        id: 6,
        title: "Harry Potter and the Sorcerer's Stone",
        author: "J.K. Rowling",
        price: 15.99,
        category: "fantasy",
        image: "https://upload.wikimedia.org/wikipedia/en/6/6b/Harry_Potter_and_the_Philosopher%27s_Stone_Book_Cover.jpg",
        description: "The first book in the magical Harry Potter series.",
        rating: 4.9
    },
    {
        id: 7,
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        price: 24.99,
        category: "fantasy",
        image: "https://upload.wikimedia.org/wikipedia/en/e/e9/First_Single_Volume_Edition_of_The_Lord_of_the_Rings.gif",
        description: "An epic fantasy adventure in Middle-earth.",
        rating: 4.8
    },
    {
        id: 8,
        title: "Dune",
        author: "Frank Herbert",
        price: 16.99,
        category: "sci-fi",
        image: "https://upload.wikimedia.org/wikipedia/en/d/de/Dune-Frank_Herbert_%281965%29_First_edition.jpg",
        description: "A science fiction masterpiece about desert planets and political intrigue.",
        rating: 4.7
    },
    {
        id: 9,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        price: 13.99,
        category: "fantasy",
        image: "https://upload.wikimedia.org/wikipedia/en/4/4a/TheHobbit_FirstEdition.jpg",
        description: "A fantasy adventure following Bilbo Baggins on his unexpected journey.",
        rating: 4.6
    },
    {
        id: 10,
        title: "Neuromancer",
        author: "William Gibson",
        price: 12.99,
        category: "sci-fi",
        image: "https://upload.wikimedia.org/wikipedia/en/4/4a/Neuromancer_%28Book%29.jpg",
        description: "A groundbreaking cyberpunk novel that defined the genre.",
        rating: 4.4
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('bookCart')) || [];

// Function to reload cart from localStorage
function reloadCartFromStorage() {
    cart = JSON.parse(localStorage.getItem('bookCart')) || [];
    console.log('Cart reloaded from storage:', cart);
    updateCartCount();
}

// Update cart count in header
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// Add to cart function
function addToCart(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        const existingItem = cart.find(item => item.id === bookId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...book, quantity: 1 });
        }
        localStorage.setItem('bookCart', JSON.stringify(cart));
        updateCartCount();
        showNotification('Book added to cart!');
    }
}

// Remove from cart function
function removeFromCart(bookId) {
    cart = cart.filter(item => item.id !== bookId);
    localStorage.setItem('bookCart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

// Update cart item quantity
function updateQuantity(bookId, newQuantity) {
    const item = cart.find(item => item.id === bookId);
    if (item && newQuantity > 0) {
        item.quantity = newQuantity;
        localStorage.setItem('bookCart', JSON.stringify(cart));
        displayCart();
    }
}

// Display featured books
function displayFeaturedBooks() {
    const featuredBooksContainer = document.getElementById('featuredBooks');
    if (!featuredBooksContainer) return;

    // Show first 8 books as featured
    const featuredBooks = books.slice(0, 8);
    featuredBooksContainer.innerHTML = featuredBooks.map(book => `
        <div class="book-card">
            <img src="${book.image}" alt="${book.title}" class="book-image" onerror="this.src='images/placeholder.svg'">
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">by ${book.author}</p>
                <p class="book-price">$${book.price.toFixed(2)}</p>
                <div class="book-actions">
                    <button onclick="addToCart(${book.id})" class="btn-primary">Add to Cart</button>
                    <a href="book-details.html?id=${book.id}" class="btn-secondary">View Details</a>
                </div>
            </div>
        </div>
    `).join('');
}

// Search functionality
function searchBooks(query) {
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase())
    );
    return filteredBooks;
}

// Modal functionality
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Notification system
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart count
    updateCartCount();

    // Display featured books
    displayFeaturedBooks();

    // Login modal
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeBtn = document.querySelector('.close');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => openModal('loginModal'));
    }

    // Cart button navigation
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            window.location.href = 'cart.html';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal('loginModal'));
    }

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            closeModal('loginModal');
        }
    });

    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `books.html?search=${encodeURIComponent(query)}`;
            }
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }

    // Newsletter subscription
    const subscribeBtn = document.getElementById('subscribeBtn');
    const newsletterEmail = document.getElementById('newsletterEmail');

    if (subscribeBtn && newsletterEmail) {
        subscribeBtn.addEventListener('click', () => {
            const email = newsletterEmail.value.trim();
            if (email) {
                showNotification('Thank you for subscribing!');
                newsletterEmail.value = '';
            } else {
                showNotification('Please enter a valid email address.');
            }
        });
    }
});

// Export functions for use in other scripts
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.openModal = openModal;
window.closeModal = closeModal;
window.showNotification = showNotification;
window.reloadCartFromStorage = reloadCartFromStorage;
window.isLoggedIn = isLoggedIn;