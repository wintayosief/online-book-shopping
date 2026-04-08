# BookHaven - Online Book Shopping Website

A complete e-commerce website for buying books online, built with HTML, CSS, and JavaScript.

## Features

### For Customers:
- **Browse Books**: View all available books with search and filtering options
- **User Registration & Login**: Create accounts and log in to track orders
- **Shopping Cart**: Add books to cart, update quantities, and remove items
- **Secure Checkout**: Complete orders with shipping and payment information
- **Order Tracking**: View order history and status
- **Responsive Design**: Works on desktop and mobile devices

### For Store Owners:
- **Admin Dashboard**: View sales statistics and manage orders
- **Order Management**: Accept orders and send confirmations
- **Customer Management**: View customer information and order history
- **Data Export**: Export order data to CSV files

## File Structure

```
online book shoping/
├── index.html              # Home page
├── books.html              # Books listing page
├── book-details.html       # Individual book page (template)
├── cart.html               # Shopping cart
├── checkout.html           # Checkout process
├── register.html           # User registration
├── order-confirmation.html # Order confirmation
├── admin.html              # Admin dashboard
├── css/
│   └── style.css           # Main stylesheet
├── js/
│   ├── main.js             # General functionality
│   ├── auth.js             # Authentication
│   ├── books.js            # Books page functionality
│   ├── cart.js             # Shopping cart
│   ├── checkout.js         # Checkout process
│   ├── confirmation.js     # Order confirmation
│   └── admin.js            # Admin panel
└── images/                 # Book cover images
```

## Book Catalog

The website now includes **10 classic and popular books**:

1. **The Great Gatsby** by F. Scott Fitzgerald ($12.99)
2. **To Kill a Mockingbird** by Harper Lee ($14.99)
3. **1984** by George Orwell ($13.99)
4. **Pride and Prejudice** by Jane Austen ($11.99)
5. **The Catcher in the Rye** by J.D. Salinger ($10.99)
6. **Harry Potter and the Sorcerer's Stone** by J.K. Rowling ($15.99)
7. **The Lord of the Rings** by J.R.R. Tolkien ($24.99)
8. **Dune** by Frank Herbert ($16.99)
9. **The Hobbit** by J.R.R. Tolkien ($13.99)
10. **Neuromancer** by William Gibson ($12.99)

## Book Cover Images

All book covers are sourced from **Wikipedia/Wikimedia Commons** (public domain or fair use). To download the images locally:

1. Open `download-images.html` in your browser
2. Right-click each image and select "Save Image As..."
3. Save images to the `images/` folder with the suggested filenames
4. Update the image paths in `js/main.js` from URLs to local paths (e.g., `"images/gatsby.jpg"`)

Or use the "Download All Images" button to download them automatically.

**After downloading images locally**, update the image paths in `js/main.js` by replacing the full URLs with local paths:

```javascript
// Change from:
image: "https://upload.wikimedia.org/wikipedia/commons/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg"

// Change to:
image: "images/gatsby.jpg"
```

**Quick Method**: Include `js/image-converter.js` in any page and run `convertImagePaths()` in the browser console to automatically update all paths.

## How to Use

### Setting Up the Website

1. **Download all files** to your computer
2. **Open index.html** in a web browser to start the website
3. The website uses local storage, so no server setup is required

### For Customers

1. **Browse Books**:
   - Visit the home page to see featured books
   - Click "Books" to see all available books
   - Use search and filters to find specific books

2. **Create an Account**:
   - Click "Register" to create a new account
   - Fill in your details and create a password
   - Login with your email and password

3. **Shop**:
   - Click "Add to Cart" on any book
   - View your cart by clicking the cart icon
   - Update quantities or remove items as needed

4. **Checkout**:
   - Click "Checkout" when ready to purchase
   - Fill in shipping and payment information
   - Complete your order

5. **Track Orders**:
   - Login to view your order history
   - See order status and details

### For Store Owners

1. **Access Admin Panel**:
   - Login with any user account
   - Visit `admin.html` to access the admin dashboard

2. **Manage Orders**:
   - View all pending and completed orders
   - Accept orders to mark them as completed
   - View customer details and order information

3. **View Statistics**:
   - See total orders, pending orders, and revenue
   - Monitor business performance

4. **Export Data**:
   - Export order data to CSV for external analysis

## Technical Details

### Technologies Used
- **HTML5**: Structure and content
- **CSS3**: Styling and responsive design
- **JavaScript (ES6+)**: Functionality and interactivity
- **Local Storage**: Data persistence (no database required)

### Key Features Implementation

#### Shopping Cart
- Items stored in browser local storage
- Real-time cart updates
- Quantity management
- Automatic total calculations

#### User Authentication
- User registration and login
- Password validation
- Session management
- Protected routes

#### Order Management
- Order creation and storage
- Order status tracking
- Email notifications (simulated)
- Order history

#### Admin Functions
- Dashboard with statistics
- Order management interface
- Data export capabilities
- Customer information access

### Browser Compatibility
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Customization

### Adding New Books
Edit the `books` array in `js/main.js`:

```javascript
{
    id: 7,
    title: "New Book Title",
    author: "Author Name",
    price: 19.99,
    category: "fiction",
    image: "images/newbook.jpg",
    description: "Book description here",
    rating: 4.5
}
```

### Changing Styling
Modify `css/style.css` to customize:
- Colors and fonts
- Layout and spacing
- Responsive breakpoints
- Component styles

### Adding New Features
- Extend existing JavaScript files
- Add new HTML pages
- Create corresponding CSS styles
- Update navigation menus

## Security Notes

This is a frontend-only implementation for demonstration purposes. In a production environment, you would need:

- **Backend Server**: Node.js, Python, PHP, etc.
- **Database**: MySQL, MongoDB, PostgreSQL
- **Secure Authentication**: JWT tokens, password hashing
- **Payment Processing**: Stripe, PayPal integration
- **Email Service**: SendGrid, Mailgun for notifications
- **HTTPS**: SSL certificate for secure connections

## Support

For questions or issues with this website template, please check:
1. All files are in the correct directories
2. JavaScript is enabled in your browser
3. Local storage is not disabled
4. You're using a modern web browser

## License

This project is provided as-is for educational and demonstration purposes. Feel free to modify and use for your own projects.