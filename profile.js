// Profile page JavaScript

// Display user profile information
function displayProfile() {
    const user = getCurrentUser();
    
    if (!user) {
        showNotification('Please login to view your profile.');
        window.location.href = 'index.html';
        return;
    }

    // Display basic info
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileEmail').textContent = user.email;
    
    // Calculate member since date
    const memberId = user.id;
    const memberDate = new Date(memberId).toLocaleDateString();
    document.getElementById('profileMemberSince').textContent = memberDate;

    // Calculate orders and total spent
    const orders = user.orders || [];
    const totalOrders = orders.length;
    const totalSpent = orders
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + order.total, 0);

    document.getElementById('profileTotalOrders').textContent = totalOrders;
    document.getElementById('profileTotalSpent').textContent = `$${totalSpent.toFixed(2)}`;
}

// Download user's books (view/download)
function downloadMyBooks() {
    const user = getCurrentUser();
    
    if (!user) {
        showNotification('Please login to view your books.');
        return;
    }

    const completedOrders = (user.orders || []).filter(order => order.status === 'completed');
    
    if (completedOrders.length === 0) {
        showNotification('You haven\'t purchased any books yet.');
        return;
    }

    // Collect all books from completed orders
    let allBooks = [];
    completedOrders.forEach(order => {
        allBooks = allBooks.concat(order.items);
    });

    // Create modal with book list
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px; max-height: 80vh; overflow-y: auto;">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>My Books</h2>
            <div class="my-books-list">
                ${allBooks.map(book => `
                    <div class="my-book-item">
                        <h3>${book.title}</h3>
                        <p><strong>Author:</strong> ${book.author}</p>
                        <p><strong>Price Paid:</strong> $${book.price.toFixed(2)}</p>
                        <div class="book-actions">
                            <a href="#" class="btn-primary" onclick="viewBook('${book.title}'); return false;">Read Online</a>
                            <a href="#" class="btn-secondary" onclick="downloadBook('${book.title}'); return false;">Download</a>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close modal when clicking outside
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.remove();
        }
    });
}

// View book online
function viewBook(bookTitle) {
    showNotification(`Opening "${bookTitle}" for reading...`);
    // In a real app, this would open a PDF viewer or e-reader
    console.log('Opening book:', bookTitle);
}

// Download book
function downloadBook(bookTitle) {
    showNotification(`Downloading "${bookTitle}"...`);
    // In a real app, this would initiate a download
    console.log('Downloading book:', bookTitle);
}

// Edit profile
function editProfile() {
    const user = getCurrentUser();
    
    if (!user) {
        showNotification('Please login to edit profile.');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>Edit Profile</h2>
            <form id="editProfileForm">
                <div class="form-group">
                    <label for="editName">Full Name</label>
                    <input type="text" id="editName" value="${user.name}" required>
                </div>
                <div class="form-group">
                    <label for="editEmail">Email</label>
                    <input type="email" id="editEmail" value="${user.email}" disabled>
                </div>
                <div class="form-group">
                    <label for="editPassword">Change Password</label>
                    <input type="password" id="editPassword" placeholder="Enter new password (optional)">
                </div>
                <button type="submit" class="btn-primary">Save Changes</button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    const form = modal.querySelector('#editProfileForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newName = document.getElementById('editName').value;
        const newPassword = document.getElementById('editPassword').value;

        // Update user info
        user.name = newName;
        if (newPassword) {
            user.password = newPassword;
        }

        // Update in storage
        const users = JSON.parse(localStorage.getItem('bookUsers')) || [];
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex] = user;
            localStorage.setItem('bookUsers', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(user));
        }

        showNotification('Profile updated successfully!');
        modal.remove();
        displayProfile();
    });

    // Close modal when clicking outside
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.remove();
        }
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    if (!isLoggedIn()) {
        showNotification('Please login to view your profile.');
        window.location.href = 'index.html';
        return;
    }

    displayProfile();
});