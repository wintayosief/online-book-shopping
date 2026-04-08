// Authentication JavaScript for BookHaven

// User data storage (in a real app, this would be on a server)
let users = JSON.parse(localStorage.getItem('bookUsers')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Check if user is logged in
function isLoggedIn() {
    return currentUser !== null;
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Login function
function login(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showNotification('Login successful!');
        updateAuthUI();
        closeModal('loginModal');
        return true;
    } else {
        showNotification('Invalid email or password.');
        return false;
    }
}

// Register function
function register(name, email, password) {
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        showNotification('User with this email already exists.');
        return false;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        orders: []
    };

    users.push(newUser);
    localStorage.setItem('bookUsers', JSON.stringify(users));

    // Auto login after registration
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    showNotification('Registration successful!');
    updateAuthUI();
    return true;
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    showNotification('Logged out successfully.');
}

// Update authentication UI
function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const userMenu = document.getElementById('userMenu');

    if (isLoggedIn()) {
        if (loginBtn) {
            loginBtn.style.display = 'none';
        }

        // Create user menu if it doesn't exist
        if (!userMenu) {
            const headerActions = document.querySelector('.user-actions');
            const userMenuDiv = document.createElement('div');
            userMenuDiv.id = 'userMenu';
            userMenuDiv.className = 'user-menu';
            userMenuDiv.innerHTML = `
                <span class="user-greeting">Welcome, ${currentUser.name}!</span>
                <div class="user-dropdown">
                    <button class="user-menu-btn">My Account <i class="fas fa-chevron-down"></i></button>
                    <div class="user-dropdown-content">
                        <a href="profile.html">Profile</a>
                        <a href="orders.html">My Orders</a>
                        <a href="#" onclick="logout(); return false;">Logout</a>
                    </div>
                </div>
            `;
            headerActions.appendChild(userMenuDiv);
        }
    } else {
        if (loginBtn) {
            loginBtn.style.display = 'inline-block';
        }
        if (userMenu) {
            userMenu.remove();
        }
    }
}

// Place order function
function placeOrder(orderData) {
    if (!isLoggedIn()) {
        showNotification('Please login to place an order.');
        openModal('loginModal');
        return false;
    }

    // Create order
    const order = {
        id: Date.now(),
        userId: currentUser.id,
        items: orderData.items,
        total: orderData.total,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod || 'card',
        status: 'pending',
        date: new Date().toISOString()
    };

    // Add order to user's orders
    currentUser.orders = currentUser.orders || [];
    currentUser.orders.push(order);

    // Update users array
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('bookUsers', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    // Send email notification (in a real app, this would be server-side)
    sendOrderEmail(order);

    showNotification('Order placed successfully! You will receive a confirmation email.');
    return true;
}

// Send order email (simulated)
function sendOrderEmail(order) {
    // In a real application, this would send an actual email
    console.log('Order confirmation email would be sent:', order);

    // For demo purposes, we'll just log it
    const emailContent = `
        Dear ${currentUser.name},

        Thank you for your order!

        Order ID: ${order.id}
        Total: $${order.total.toFixed(2)}

        Items:
        ${order.items.map(item => `- ${item.title} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

        Shipping Address:
        ${order.shippingAddress}

        We will process your order shortly.

        Best regards,
        BookHaven Team
    `;

    console.log('Email content:', emailContent);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Update auth UI on page load
    updateAuthUI();

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            login(email, password);
        });
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;

            if (password !== confirmPassword) {
                showNotification('Passwords do not match.');
                return;
            }

            if (register(name, email, password)) {
                window.location.href = 'index.html';
            }
        });
    }
});

// Export functions for use in other scripts
window.isLoggedIn = isLoggedIn;
window.getCurrentUser = getCurrentUser;
window.login = login;
window.register = register;
window.logout = logout;
window.placeOrder = placeOrder;