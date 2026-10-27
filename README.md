# FarmFresh Frontend Demo

A beginner-friendly frontend-only marketplace prototype for farmers and customers.

## Features
- Responsive landing page
- Product cards, categories, and search
- Buyer and seller demo login screens
- Cart quantity controls and simulated checkout
- Seller dashboard: add and delete products
- Browser `localStorage` keeps demo data between refreshes

## Run the project
1. Download and unzip `farmfresh-frontend.zip`.
2. Open the `farmfresh-frontend` folder.
3. Double-click `index.html` to open it in a modern browser.
4. For a better development workflow, open the folder in VS Code and use the **Live Server** extension.

No npm install, Java, backend, or database is required for this demo.

## Try it
1. Browse products and add items to your cart.
2. Open the cart and choose “Place demo order”. Sign in as a buyer when prompted.
3. Use “Sell with us” to open the seller demo login.
4. Enter a name, email, and demo password, then add a product from the seller dashboard.
5. Refresh the browser: products and cart data are saved locally.

## Project files
- `index.html` — page structure and dialogs
- `style.css` — layout, colors, responsive styles
- `script.js` — sample products, search, cart, demo login, seller dashboard

## Important limitations
This is a learning prototype, not production-ready ecommerce:
- Login does not authenticate users securely; passwords are not stored or checked.
- Anyone using the same browser can manipulate localStorage and demo data.
- Data is stored only in the current browser, not shared with other users or devices.
- Orders and checkout are simulated; there is no payment, delivery service, or server.
- Product photos load from Unsplash and require an internet connection.
- Sample products are illustrative. Do not claim produce is certified organic unless verified.

Before launching publicly, add a secure backend, password hashing, database, authorization, server-side price/stock validation, payment integration, order management, and privacy/security protections.
