// Order confirmation JavaScript

// Display order confirmation details
function displayOrderConfirmation() {
    const orderDetails = document.getElementById('orderDetails');
    if (!orderDetails) return;

    // Get the most recent order from current user
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.orders || currentUser.orders.length === 0) {
        orderDetails.innerHTML = '<p>No recent order found.</p>';
        return;
    }

    // Get the most recent order
    const recentOrder = currentUser.orders[currentUser.orders.length - 1];

    orderDetails.innerHTML = `
        <div class="confirmation-summary">
            <div class="summary-row">
                <span>Order Number:</span>
                <span>#${recentOrder.id}</span>
            </div>
            <div class="summary-row">
                <span>Order Date:</span>
                <span>${new Date(recentOrder.date).toLocaleString()}</span>
            </div>
            <div class="summary-row">
                <span>Payment Method:</span>
                <span>${recentOrder.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Card'}</span>
            </div>
            <div class="summary-row">
                <span>Total Amount:</span>
                <span>$${recentOrder.total.toFixed(2)}</span>
            </div>
        </div>

        <h3>Your Books (Available for Reading)</h3>
        <div class="confirmation-items">
            ${recentOrder.items.map(item => `
                <div class="confirmation-item">
                    <div class="book-access-preview">
                        <div class="book-cover">
                            <i class="fas fa-book"></i>
                        </div>
                    </div>
                    <div class="item-info">
                        <h4>${item.title}</h4>
                        <p>by ${item.author}</p>
                        <p>Quantity: ${item.quantity}</p>
                        <div class="book-access-links">
                            <a href="#" onclick="readBook('${item.title}'); return false;" class="btn-primary">
                                <i class="fas fa-eye"></i> Read Online
                            </a>
                            <a href="#" onclick="downloadBook('${item.title}'); return false;" class="btn-secondary">
                                <i class="fas fa-download"></i> Download
                            </a>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="shipping-info">
            <h3>Shipping Address</h3>
            <pre>${recentOrder.shippingAddress}</pre>
        </div>

        <div class="next-steps">
            <h3>What's Next?</h3>
            <div class="payment-status">
                ${recentOrder.paymentMethod === 'mpesa' ? `
                    <div class="payment-info mpesa">
                        <i class="fas fa-mobile-alt"></i>
                        <div>
                            <h4>Complete M-Pesa Payment</h4>
                            <p><strong>Send to:</strong> +254759520073</p>
                            <p><strong>Amount:</strong> KES ${(recentOrder.total * 120).toFixed(0)}</p>
                            <p><strong>Please note your Order ID: #${recentOrder.id}</strong></p>
                        </div>
                    </div>
                ` : `
                    <div class="payment-info card">
                        <i class="fas fa-check-circle"></i>
                        <div>
                            <h4>Payment Confirmed</h4>
                            <p>Your payment has been processed. Thank you!</p>
                        </div>
                    </div>
                `}
            </div>
        </div>
    `;
}

// Read book online
function readBook(title) {
    showNotification(`Opening "${title}" for reading...`);
    // In a real app, this would open an e-reader or PDF viewer
}

// Download book
function downloadBook(title) {
    showNotification(`Downloading "${title}"...`);
    // In a real app, this would initiate a download
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!isLoggedIn()) {
        showNotification('Please login to view order confirmation.');
        window.location.href = 'index.html';
        return;
    }

    // Display order confirmation
    displayOrderConfirmation();
});