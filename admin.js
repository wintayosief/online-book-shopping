// Admin panel JavaScript

// Check if user is admin (for demo purposes, any logged in user can access)
function isAdmin() {
    return isLoggedIn();
}

// Get all orders from all users
function getAllOrders() {
    const users = JSON.parse(localStorage.getItem('bookUsers')) || [];
    const allOrders = [];

    users.forEach(user => {
        if (user.orders && user.orders.length > 0) {
            user.orders.forEach(order => {
                allOrders.push({
                    ...order,
                    customerName: user.name,
                    customerEmail: user.email
                });
            });
        }
    });

    return allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Display dashboard statistics
function displayDashboardStats() {
    const allOrders = getAllOrders();

    const totalOrders = allOrders.length;
    const pendingOrders = allOrders.filter(order => order.status === 'pending').length;
    const completedOrders = allOrders.filter(order => order.status === 'completed').length;
    const totalRevenue = allOrders
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + order.total, 0);

    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('pendingOrders').textContent = pendingOrders;
    document.getElementById('completedOrders').textContent = completedOrders;
    document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
}

// Display recent orders
function displayRecentOrders() {
    const recentOrdersList = document.getElementById('recentOrdersList');
    if (!recentOrdersList) return;

    const allOrders = getAllOrders().slice(0, 5); // Show only 5 most recent

    if (allOrders.length === 0) {
        recentOrdersList.innerHTML = '<p>No orders yet.</p>';
        return;
    }

    recentOrdersList.innerHTML = allOrders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <h4>Order #${order.id}</h4>
                <span class="order-status status-${order.status}">${order.status}</span>
            </div>
            <div class="order-details">
                <p><strong>Customer:</strong> ${order.customerName}</p>
                <p><strong>Email:</strong> ${order.customerEmail}</p>
                <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
                <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
            </div>
            <div class="order-actions">
                <button onclick="viewOrderDetails(${order.id})" class="btn-secondary">View Details</button>
                ${order.status === 'pending' ? `<button onclick="acceptOrder(${order.id})" class="btn-primary">Accept Order</button>` : ''}
            </div>
        </div>
    `).join('');
}

// View order details
function viewOrderDetails(orderId) {
    const allOrders = getAllOrders();
    const order = allOrders.find(o => o.id === orderId);

    if (!order) {
        showNotification('Order not found.');
        return;
    }

    // Create modal to show order details
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>Order Details #${order.id}</h2>
            <div class="order-details-modal">
                <div class="order-info">
                    <h3>Customer Information</h3>
                    <p><strong>Name:</strong> ${order.customerName}</p>
                    <p><strong>Email:</strong> ${order.customerEmail}</p>
                    <p><strong>Shipping Address:</strong></p>
                    <pre>${order.shippingAddress}</pre>
                </div>
                <div class="order-items">
                    <h3>Order Items</h3>
                    ${order.items.map(item => `
                        <div class="order-item">
                            <span>${item.title} by ${item.author} (x${item.quantity})</span>
                            <span>$${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-total">
                    <h3>Total: $${order.total.toFixed(2)}</h3>
                    <p><strong>Status:</strong> ${order.status}</p>
                    <p><strong>Order Date:</strong> ${new Date(order.date).toLocaleString()}</p>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'block';
}

// Accept order
function acceptOrder(orderId) {
    const users = JSON.parse(localStorage.getItem('bookUsers')) || [];

    // Find and update the order
    let orderFound = false;
    users.forEach(user => {
        if (user.orders) {
            const orderIndex = user.orders.findIndex(order => order.id === orderId);
            if (orderIndex !== -1) {
                user.orders[orderIndex].status = 'completed';
                orderFound = true;
            }
        }
    });

    if (orderFound) {
        localStorage.setItem('bookUsers', JSON.stringify(users));
        showNotification('Order accepted successfully!');
        displayDashboardStats();
        displayRecentOrders();

        // Send confirmation email (simulated)
        sendOrderConfirmationEmail(orderId);
    } else {
        showNotification('Order not found.');
    }
}

// Send order confirmation email (simulated)
function sendOrderConfirmationEmail(orderId) {
    const allOrders = getAllOrders();
    const order = allOrders.find(o => o.id === orderId);

    if (order) {
        console.log('Order confirmation email sent to:', order.customerEmail);
        console.log('Email content: Order', order.id, 'has been accepted and is being processed.');
    }
}

// Export orders to CSV
function exportOrders() {
    const allOrders = getAllOrders();

    if (allOrders.length === 0) {
        showNotification('No orders to export.');
        return;
    }

    // Create CSV content
    const csvContent = [
        ['Order ID', 'Customer Name', 'Customer Email', 'Total', 'Status', 'Date'],
        ...allOrders.map(order => [
            order.id,
            order.customerName,
            order.customerEmail,
            order.total.toFixed(2),
            order.status,
            new Date(order.date).toLocaleDateString()
        ])
    ];

    // Convert to CSV string
    const csvString = csvContent.map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    // Create download link
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    showNotification('Orders exported successfully!');
}

// Send newsletter (simulated)
function sendNewsletter() {
    const users = JSON.parse(localStorage.getItem('bookUsers')) || [];
    const subscribers = users.length;

    showNotification(`Newsletter sent to ${subscribers} customers!`);
}

// Update inventory (simulated)
function updateInventory() {
    showNotification('Inventory updated successfully!');
}

// Logout admin
function logoutAdmin() {
    logout();
    window.location.href = 'index.html';
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!isAdmin()) {
        showNotification('Please login to access admin panel.');
        window.location.href = 'index.html';
        return;
    }

    // Display dashboard data
    displayDashboardStats();
    displayRecentOrders();

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutAdmin);
    }
});