// Checkout page JavaScript

// Display order summary
function displayOrderSummary() {
    const orderItems = document.getElementById('orderItems');
    if (!orderItems) return;

    orderItems.innerHTML = cart.map(item => `
        <div class="order-item">
            <div class="order-item-info">
                <h4>${item.title}</h4>
                <p>by ${item.author}</p>
                <p>Quantity: ${item.quantity}</p>
            </div>
            <div class="order-item-price">
                <p>$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
        </div>
    `).join('');

    updateOrderTotals();
}

// Update order totals
function updateOrderTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    document.getElementById('orderSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('orderShipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('orderTax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('orderTotal').textContent = `$${total.toFixed(2)}`;

    // Update M-Pesa amount (approximate KES conversion)
    const kesAmount = (total * 120).toFixed(0);
    const mpesaAmountElement = document.getElementById('mpesaAmount');
    if (mpesaAmountElement) {
        mpesaAmountElement.innerHTML = `Amount: <strong>KES ${kesAmount}</strong>`;
    }
}

// Toggle payment method
function togglePaymentMethod() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const cardPayment = document.getElementById('cardPayment');
    const mpesaPayment = document.getElementById('mpesaPayment');

    if (paymentMethod === 'mpesa') {
        cardPayment.style.display = 'none';
        mpesaPayment.style.display = 'block';
        // Clear card fields
        document.getElementById('cardNumber').removeAttribute('required');
        document.getElementById('expiryDate').removeAttribute('required');
        document.getElementById('cvv').removeAttribute('required');
        document.getElementById('cardName').removeAttribute('required');
    } else {
        cardPayment.style.display = 'block';
        mpesaPayment.style.display = 'none';
        // Add required back
        document.getElementById('cardNumber').setAttribute('required', 'true');
        document.getElementById('expiryDate').setAttribute('required', 'true');
        document.getElementById('cvv').setAttribute('required', 'true');
        document.getElementById('cardName').setAttribute('required', 'true');
    }
}

// Validate credit card number (basic validation)
function validateCardNumber(cardNumber) {
    // Remove spaces and dashes
    const cleaned = cardNumber.replace(/\s+/g, '').replace(/-/g, '');

    // Check if it's all digits and length is between 13-19
    if (!/^\d{13,19}$/.test(cleaned)) {
        return false;
    }

    // Luhn algorithm for basic validation
    let sum = 0;
    let shouldDouble = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned.charAt(i));

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
}

// Validate expiry date
function validateExpiryDate(expiry) {
    const match = expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;

    const month = parseInt(match[1]);
    const year = parseInt('20' + match[2]);

    if (month < 1 || month > 12) return false;

    const now = new Date();
    const expiryDate = new Date(year, month - 1);

    return expiryDate > now;
}

// Handle form submission
function handleCheckout(event) {
    event.preventDefault();

    if (!isLoggedIn()) {
        showNotification('Please login to place an order.');
        openModal('loginModal');
        return;
    }

    if (cart.length === 0) {
        showNotification('Your cart is empty.');
        return;
    }

    // Get form data
    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim(),
        city: document.getElementById('city').value.trim(),
        state: document.getElementById('state').value.trim(),
        zipCode: document.getElementById('zipCode').value.trim(),
        country: document.getElementById('country').value,
        paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value
    };

    // Add card details only if card payment is selected
    if (formData.paymentMethod === 'card') {
        formData.cardNumber = document.getElementById('cardNumber').value.trim();
        formData.expiryDate = document.getElementById('expiryDate').value.trim();
        formData.cvv = document.getElementById('cvv').value.trim();
        formData.cardName = document.getElementById('cardName').value.trim();
    }

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    for (const field of requiredFields) {
        if (!formData[field]) {
            showNotification(`Please fill in all required fields.`);
            return;
        }
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showNotification('Please enter a valid email address.');
        return;
    }

    // Validate phone
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
        showNotification('Please enter a valid phone number.');
        return;
    }

    // Validate card payment if selected
    if (formData.paymentMethod === 'card') {
        // Validate card number
        if (!validateCardNumber(formData.cardNumber)) {
            showNotification('Please enter a valid card number.');
            return;
        }

        // Validate expiry date
        if (!validateExpiryDate(formData.expiryDate)) {
            showNotification('Please enter a valid expiry date (MM/YY).');
            return;
        }

        // Validate CVV
        if (!/^\d{3,4}$/.test(formData.cvv)) {
            showNotification('Please enter a valid CVV.');
            return;
        }
    }

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    // Create shipping address string
    const shippingAddress = `${formData.firstName} ${formData.lastName}\n${formData.address}\n${formData.city}, ${formData.state} ${formData.zipCode}\n${formData.country}`;

    // Place order
    const orderData = {
        items: cart,
        total: total,
        shippingAddress: shippingAddress,
        paymentMethod: formData.paymentMethod
    };

    if (placeOrder(orderData)) {
        // Send notification to store owner
        sendOrderNotificationToAdmin(formData, orderData);

        // Clear cart
        cart = [];
        localStorage.setItem('bookCart', JSON.stringify(cart));
        updateCartCount();

        // Redirect to order confirmation
        window.location.href = 'order-confirmation.html';
    }
}

// Send order notification to store owner
function sendOrderNotificationToAdmin(orderData, orderDetails) {
    const user = getCurrentUser();
    const notificationMessage = `
        New Order Received!
        
        Customer: ${orderData.firstName} ${orderData.lastName}
        Email: ${orderData.email}
        Phone: ${orderData.phone}
        
        Order Address:
        ${orderDetails.shippingAddress}
        
        Payment Method: ${orderData.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Card'}
        Total Amount: $${orderDetails.total.toFixed(2)}
        
        Items:
        ${orderDetails.items.map(item => `- ${item.title} (x${item.quantity}): $${(item.price * item.quantity).toFixed(2)}`).join('\n')}
        
        Please confirm this order in the admin panel.
    `;

    console.log('Order Notification:', notificationMessage);
    // In a real app, this would send an email to wintayos23@gmail.com
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!isLoggedIn()) {
        showNotification('Please login to proceed to checkout.');
        setTimeout(() => {
            openModal('loginModal');
        }, 1000);
    }

    // Display order summary
    displayOrderSummary();

    // Handle checkout form
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }

    // Pre-fill user information if logged in
    if (isLoggedIn()) {
        const user = getCurrentUser();
        document.getElementById('email').value = user.email;
    }

    // Payment method toggle
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', togglePaymentMethod);
    });
});