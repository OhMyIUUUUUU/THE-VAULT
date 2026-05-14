# VAULT-PH Full System Testing Walkthrough

This document is a comprehensive guide for User Acceptance Testing (UAT) across the entire VAULT-PH architectural streetwear storefront. It outlines all major features, how to interact with them, and what expected behaviors you should verify.

---

## 1. Authentication (`sign-in.html` & `sign-up.html`)
The system features a simulated authentication flow using local storage.

### Testing Steps:
1. **Sign Up**: Navigate to `sign-up.html`. Enter an email and password. Click "SIGN UP".
   - *Expected*: You should be redirected to the home page or dashboard, and your session should be saved locally.
2. **Sign In**: Navigate to `sign-in.html`. Enter the credentials you just created.
   - *Expected*: The system should recognize the credentials and grant access.
3. **Form Validation**: Try clicking Sign In/Sign Up without entering any data.
   - *Expected*: The brutalist form should display visual error states or block submission.

---

## 2. Storefront Home (`home.html`)
The main entry point features several dynamic, brutalist UI components.

### Testing Steps:
1. **Hero Typewriter**: Watch the main headline text on load.
   - *Expected*: The text "FASHION STREETWEAR" should type out automatically with a blinking cursor.
2. **Hero Image Carousel**: Click the massive `<` and `>` arrows on the main right-side picture.
   - *Expected*: The carousel smoothly crossfades between 3 images (Note: Image 2 and 3 are visually identical in the current build). The dark `mix-blend-luminosity` filter must remain active on all slides.
3. **New Arrivals Slider**: Scroll down to the "New Arrivals" section. Try clicking the Left/Right arrows above the products.
   - *Expected*: The product track should smoothly scroll left and right.

---

## 3. Collections & Filtering (`collections.html`)
The shop floor where all items are listed.

### Testing Steps:
1. **Category Filters**: Click on the different category buttons (e.g., "ALL", "OUTERWEAR", "ESSENTIALS").
   - *Expected*: The product grid should instantly filter out non-matching items. The active button should invert colors (black background, white text).
2. **Add to Stack**: Hover over a product and click the "ADD TO STACK" button.
   - *Expected*: The global Cart Drawer ("Pull Stack") should slide out from the right, displaying the added item. The cart badges in the navigation should update instantly.

---

## 4. Product Details (`product-detail.html`)
Deep dive into a specific piece.

### Testing Steps:
1. **Accessing**: Click on any product image or title from `collections.html` or `home.html`.
2. **Image Zoom**: Hover or click on the main product image.
   - *Expected*: The image should perform a smooth, editorial-style zoom focusing on the garment details.
3. **Sizing & Cart**: Select a size and click "ADD TO STACK".
   - *Expected*: The drawer should open, reflecting the addition.

---

## 5. Global Pull Stack (Cart Drawer)
The persistent shopping cart (`vault-stack.js`), accessible from any page via the top navigation.

### Testing Steps:
1. **Toggle Visibility**: Click the "CART" button in the top navigation on any page.
   - *Expected*: The drawer smoothly slides in/out.
2. **Quantity Adjustments**: Inside the drawer, click the `+` and `-` buttons on an item.
   - *Expected*: The item's line total and the drawer's overall subtotal should recalculate instantly.
3. **Persistence**: Add an item to the stack, close the tab, and reopen the page.
   - *Expected*: Your cart contents should still be there (saved via `localStorage`).

---

## 6. Premium Checkout (`checkout.html`)
The fully redesigned, tactile brutalist checkout experience.

### Testing Steps:
1. **Navigation**: Click "Continue to Cart" from the Pull Stack drawer.
2. **Tactile Form**: Click into the various input fields (Email, Name, Address).
   - *Expected*: The inputs should gain a sharp, heavy drop shadow when focused, giving a physical "pressed" feel.
3. **Payment Selection**: Click on different payment blocks (e.g., GCash, Maya, GrabPay).
   - *Expected*: The selected block should instantly invert to a bold black background with white text.
4. **Order Summary**: Scroll down the page.
   - *Expected*: The right-hand "Order Summary" (styled like a receipt) should stay sticky on the screen. It should accurately reflect the items and totals you added to the cart earlier.
5. **Place Order Animation**: Click the massive "PLACE ORDER" button at the bottom.
   - *Expected*: A highly stylized sequence should trigger: a rocket flies across the screen, a package drops down, and a success checkmark is stamped on the screen.
