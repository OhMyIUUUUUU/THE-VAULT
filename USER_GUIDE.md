# Vault PH — User Guide

A short guide for using the Vault PH demo storefront: registry (sign in / sign up), profile, checkout, and how your data is stored.

---

## 1. Opening the site

- **Start page:** Opening `index.html` (or the site root) sends you to **Sign in** (`sign-in.html`).
- **Shop home:** Use **`home.html`** for the main landing experience, or use **HOME** in the navigation where available.

**Important:** For **sign-in** and **sign-up** you need pages served over **HTTP** (not `file://`).

- **Write new users into `users.json`:** run **`npm start`** in this folder and open **`http://localhost:3000`**. Create account will **append** to the real **`users.json`** file via `POST /api/register`.
- **Other static servers** (e.g. Live Server on another port): sign-up still works using **localStorage** only; the **`users.json`** file on disk is **not** updated unless you use **`npm start`**.

---

## 2. Registry accounts (demo)

### Sign up (`sign-up.html`)

1. Fill in **full name**, **email**, **password** (and confirmation), **registry address**, and accept **terms**.
2. Optionally opt in to **email updates**.
3. Submit **Create account**.

**What happens**

1. **If you use `npm start` (recommended):** the browser sends **`POST /api/register`** to the local Node server. The server **reads and updates `users.json`** on disk (adds your user, bumps `updatedAt`). Then the app refreshes its local snapshot and redirects you to **Sign in** with your **email prefilled**.
2. **If the API is missing** (wrong server or offline): your account is saved only in **`localStorage`** (`vaultPhRegisteredUsers`) and a merged copy in **`vaultPhUsersJsonSnapshot`** — the repo **`users.json`** file is unchanged until you use **`npm start`** or paste users in by hand.

Browsers alone **cannot** write files on your computer; the small **`server.js`** is what writes **`users.json`**.

### Sign in (`sign-in.html`)

1. Enter **email** and **password**.
2. Submit **Sign in**.

**Validation:** Email and password are checked against:

- Users loaded from **`users.json`**, **plus**
- Any users you created via **Sign up** (stored locally).

**Demo accounts in `users.json`:**  
Example: **`mara.santos@example.com`** with password **`vault2026`** (see `users.json` for all demo users and `passwordDemo` values).

**After a successful sign in:** You are sent to **`home.html`**. A **session** (no password) is stored in **`localStorage`** as **`vaultPhSession`**.

### Already signed in

If you open **Sign in** or **Sign up** while a session exists, you are redirected to **`home.html`**.

---

## 3. Profile (`profile.html`)

- Open **Profile** from the **person** icon in the header (on shop pages and checkout), or go to **`profile.html`** directly.
- **Signed out:** You see a short message and links to **Sign in** / **Create account** / **Back to home**.
- **Signed in:** You see your **avatar initials**, **name**, **email**, **role**, **member since**, **contact**, **default shipping address**, and **registry status** (terms, last sign-in).
- **Sign out** clears the session and returns you to **Sign in**.

Data shown on the profile comes from the **session** (derived from the merged user list when you signed in).

---

## 4. Checkout

- With an active session, **checkout** can **prefill** contact email, name (split from full name), and shipping fields when the page loads.
- You can still edit every field before placing an order (demo checkout).

---

## 5. Data & privacy (demo only)

| Storage key | Purpose |
|-------------|---------|
| `vaultPhRegisteredUsers` | Users created through **Sign up** (includes `passwordDemo` for demo login). |
| `vaultPhSession` | Current signed-in user **without** password fields. |
| `vaultPhUsersJsonSnapshot` | Last merged **`users.json`-style** document after a successful sign-up sync. |
| `vaultPhCollectionStack` | Pull stack / cart (used on shop and checkout). |

**Not for production:** Passwords are stored for **demo** only. A real app needs a server, a database, and **hashed** passwords—never ship plaintext passwords in JSON or `localStorage`.

---

## 6. Saving new accounts into `users.json`

1. In a terminal: **`npm start`** (runs **`node server.js`** on port **3000** by default).
2. Open **`http://localhost:3000`** → sign in / sign up as usual.
3. After **Create account**, open **`users.json`** in your editor — the new user should appear in the **`users`** array.

To use another port: **`set PORT=8080`** (Windows) or **`PORT=8080 npm start`** (Unix), then open that URL.

---

## 7. Updating `users.json` manually (optional)

The app **reads** `users.json` at runtime. You can still edit **`users.json`** by hand or merge rows from **`vaultPhUsersJsonSnapshot`** in DevTools if you used localStorage-only mode.

---

## 8. Quick navigation map

| Page | File | Notes |
|------|------|--------|
| Entry redirect | `index.html` | Goes to sign-in. |
| Sign in | `sign-in.html` | Validates against JSON + local registrations. |
| Sign up | `sign-up.html` | With **`npm start`**, appends to **`users.json`**; otherwise localStorage. |
| Home | `home.html` | Main storefront landing. |
| Shop | `collections.html` | Collections / filters. |
| Archive | `archive.html` | The Vault. |
| Product | `product-detail.html` | Query `?id=` for a product. |
| Checkout | `checkout.html` | Prefill from session when available. |
| Profile | `profile.html` | Session details; sign out here. |

---

## 9. Troubleshooting

| Issue | What to try |
|--------|-------------|
| Sign-in always fails | Serve over **http://localhost** (not `file://`). Check **`users.json`** path and network tab for 404. |
| “Could not sync with users.json” on sign-up | Same as above: use a **local server**. |
| New account missing after clearing site data | Registrations live in **local storage** only; clearing storage removes them unless they were copied into **`users.json`**. |
| Profile empty / guest | Sign in again; session may have been cleared or never set. |

---

*Vault PH — architectural streetwear (demo storefront).*
