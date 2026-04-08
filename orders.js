// Orders page JavaScript

// Display user's orders
function displayOrders() {
    const user = getCurrentUser();
    const ordersList = document.getElementById('ordersList');
    const emptyOrders = document.getElementById('emptyOrders');

    if (!user) {
        showNotification('Please login to view your orders.');
        window.location.href = 'index.html';
        return;
    }

    const orders = user.orders || [];

    if (orders.length === 0) {
        ordersList.style.display = 'none';
        emptyOrders.style.display = 'block';
        return;
    }

    emptyOrders.style.display = 'none';
    ordersList.style.display = 'block';

    ordersList.innerHTML = orders
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map(order => `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-id-status">
                        <h3>Order #${order.id}</h3>
                        <span class="order-status status-${order.status}">${order.status}</span>
                    </div>
                    <div class="order-date">
                        ${new Date(order.date).toLocaleDateString()}
                    </div>
                </div>

                <div class="order-body">
                    <div class="order-items-preview">
                        <h4>Books Ordered:</h4>
                        <ul>
                            ${order.items.map(item => `
                                <li>${item.title} by ${item.author} (x${item.quantity})</li>
                            `).join('')}
                        </ul>
                    </div>

                    <div class="order-details-box">
                        <div class="detail-row">
                            <span>Order Date:</span>
                            <span>${new Date(order.date).toLocaleString()}</span>
                        </div>
                        <div class="detail-row">
                            <span>Total Amount:</span>
                            <span><strong>$${order.total.toFixed(2)}</strong></span>
                        </div>
                        <div class="detail-row">
                            <span>Status:</span>
                            <span><strong>${order.status === 'completed' ? '✓ Completed' : '⏳ Processing'}</strong></span>
                        </div>
                    </div>
                </div>

                <div class="order-actions">
                    <button onclick="viewOrderDetails(${order.id})" class="btn-secondary">View Details</button>
                    ${order.status === 'completed' ? `<button onclick="readBooks(${order.id})" class="btn-primary"><i class="fas fa-book"></i> Read Books</button>` : ''}
                </div>
            </div>
        `).join('');
}

// View full order details
function viewOrderDetails(orderId) {
    const user = getCurrentUser();
    const order = (user.orders || []).find(o => o.id === orderId);

    if (!order) {
        showNotification('Order not found.');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 700px;">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>Order Details #${order.id}</h2>

            <div class="order-detail-view">
                <div class="detail-section">
                    <h3>Shipping Address</h3>
                    <pre>${order.shippingAddress}</pre>
                </div>

                <div class="detail-section">
                    <h3>Books Ordered</h3>
                    <table class="order-table">
                        <thead>
                            <tr>
                                <th>Book Title</th>
                                <th>Author</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map(item => `
                                <tr>
                                    <td>${item.title}</td>
                                    <td>${item.author}</td>
                                    <td>${item.quantity}</td>
                                    <td>$${item.price.toFixed(2)}</td>
                                    <td>$${(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div class="detail-section">
                    <h3>Order Total</h3>
                    <p><strong>Amount: $${order.total.toFixed(2)}</strong></p>
                    <p><strong>Status: ${order.status}</strong></p>
                    <p><strong>Order Date: ${new Date(order.date).toLocaleString()}</strong></p>
                </div>

                <div class="detail-section">
                    <h3>Payment Instructions</h3>
                    <p>If not yet paid, please complete payment via M-Pesa:</p>
                    <p><strong>M-Pesa Number: +254759520073</strong></p>
                    <p><strong>Amount: KES ${(order.total * 120).toFixed(0)}</strong> (approximately)</p>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.remove();
        }
    });
}

// Read/view books from an order
function readBooks(orderId) {
    const user = getCurrentUser();
    const order = (user.orders || []).find(o => o.id === orderId);

    if (!order || order.status !== 'completed') {
        showNotification('Books are not available for this order yet.');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px; max-height: 80vh; overflow-y: auto;">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>Your Books - Order #${order.id}</h2>
            <div class="books-collection">
                ${order.items.map((book, index) => `
                    <div class="book-access-card">
                        <div class="book-cover-placeholder">
                            <i class="fas fa-book"></i>
                        </div>
                        <div class="book-access-info">
                            <h4>${book.title}</h4>
                            <p>by ${book.author}</p>
                            <p class="purchase-info">Purchased: ${new Date(order.date).toLocaleDateString()}</p>
                            <div class="book-access-buttons">
                                <button onclick="openBook(${index}, '${book.title}')" class="btn-primary">
                                    <i class="fas fa-eye"></i> Read Online
                                </button>
                                <button onclick="downloadBook('${book.title}')" class="btn-secondary">
                                    <i class="fas fa-download"></i> Download
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.remove();
        }
    });
}

// Open book for reading
function openBook(index, title) {
    showNotification(`Opening "${title}" for reading...`);
    // In a real application, this would open an e-reader or PDF viewer
    console.log('Opening book:', title);
}

// Download book
function downloadBook(title) {
    showNotification(`Starting download of "${title}"...`);
    // In a real application, this would initiate a file download
    console.log('Downloading:', title);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    if (!isLoggedIn()) {
        showNotification('Please login to view your orders.');
        window.location.href = 'index.html';
        return;
    }

    displayOrders();
});