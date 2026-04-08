// Cart page JavaScript

// Reload cart from localStorage to ensure we have latest data
function loadCartData() {
    cart = JSON.parse(localStorage.getItem('bookCart')) || [];
    console.log('Cart loaded from localStorage:', cart);
}

// Display cart items
function displayCart() {
    // Always reload cart data first
    loadCartData();
    
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');

    if (!cartItems) {
        console.error('cartItems element not found');
        return;
    }

    console.log('Current cart:', cart);
    console.log('Cart length:', cart.length);

    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartContent) cartContent.style.display = 'none';
        console.log('Cart is empty, showing empty message');
        return;
    }

    if (emptyCart) emptyCart.style.display = 'none';
    if (cartContent) cartContent.style.display = 'flex';

    // Generate cart items HTML
    let cartHTML = '';
    cart.forEach(item => {
        cartHTML += `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}" onerror="this.src='images/placeholder.svg'" style="width: 100px; height: 150px; object-fit: cover;">
            </div>
            <div class="cart-item-details">
                <h4>${item.title}</h4>
                <p>by ${item.author}</p>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="window.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <input type="number" value="${item.quantity}" min="1" class="quantity-input" onchange="window.updateQuantity(${item.id}, parseInt(this.value))">
                <button class="quantity-btn" onclick="window.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
            <div class="cart-item-total">
                <p>$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <div class="cart-item-remove">
                <button class="remove-btn" onclick="window.removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        </div>
        `;
    });

    cartItems.innerHTML = cartHTML;
    updateCartSummary();
    console.log('Cart displayed successfully');
}

// Update cart summary
function updateCartSummary() {
    // Reload cart to ensure fresh data
    loadCartData();
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

    console.log('Cart summary updated - Subtotal: $' + subtotal.toFixed(2) + ', Total: $' + total.toFixed(2));
}

// Proceed to checkout
function proceedToCheckout() {
    if (!isLoggedIn()) {
        showNotification('Please login to proceed to checkout.');
        openModal('loginModal');
        return;
    }

    if (cart.length === 0) {
        showNotification('Your cart is empty.');
        return;
    }

    window.location.href = 'checkout.html';
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cart page DOMContentLoaded fired');
    
    // Load cart and display
    loadCartData();
    displayCart();

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
        console.log('Checkout button listener attached');
    } else {
        console.error('Checkout button not found');
    }

    // Update cart when items change in other tabs
    window.addEventListener('storage', function(e) {
        if (e.key === 'bookCart') {
            console.log('Cart updated from another tab');
            loadCartData();
            displayCart();
        }
    });
});

// Export functions globally
window.displayCart = displayCart;
window.updateCartSummary = updateCartSummary;
window.proceedToCheckout = proceedToCheckout;