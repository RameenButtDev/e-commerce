# ShopEasy — Full-Stack MERN E-Commerce Website

A complete e-commerce platform (Daraz-style) built with **MongoDB, Express, React, Node.js** — with customer storefront, cart, checkout (COD / JazzCash / EasyPaisa), and a full **Admin Panel** (products, categories, orders, users, coupons, analytics dashboard).

---

## 📁 Project Structure
```
ecommerce-app/
  backend/     → Node.js + Express API + MongoDB (Mongoose)
  frontend/    → React (Vite) + Tailwind CSS
```

---

## 🚀 Setup Instructions

### 1. Prerequisites
- Node.js v18+ installed
- MongoDB installed locally OR a free MongoDB Atlas cluster (https://www.mongodb.com/cloud/atlas)

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```
Open `.env` and fill in:
- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — any long random string
- JazzCash / EasyPaisa merchant credentials (get from their sandbox/merchant portal — see Payment Setup below)

Load sample data (creates an admin account, categories, and products):
```bash
npm run seed
```
This prints demo logins:
- **Admin:** admin@shop.com / admin123
- **Customer:** customer@shop.com / customer123

Start the backend:
```bash
npm run dev
```
Backend runs on **http://localhost:5000**

### 3. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on **http://localhost:5173** (already proxies `/api` calls to the backend).

Visit **http://localhost:5173** → Login with the admin account → go to **My Account → Admin Panel**.

---

## 💳 Payment Setup (JazzCash / EasyPaisa)

This project includes fully-wired **JazzCash Mobile Wallet** and **EasyPaisa** integrations using their standard merchant HTTP POST API pattern (secure hash generation, redirect + callback handling). To go live:

1. Register as a merchant:
   - JazzCash: https://www.jazzcash.com.pk/business/ (sandbox: https://sandbox.jazzcash.com.pk)
   - EasyPaisa: https://easypaisa.com.pk/business-payment-solutions/
2. You'll receive: Merchant ID, Password, Integrity Salt (JazzCash) / Store ID, Hash Key (EasyPaisa)
3. Put these values into `backend/.env`
4. Switch `JAZZCASH_API_URL` from sandbox to the production URL once approved.

Until you configure real credentials, JazzCash/EasyPaisa checkout will redirect to their sandbox (test) endpoint — perfect for development and demoing the full flow. **Cash on Delivery works immediately with no setup.**

---

## ✨ Features

**Customer site:**
- Product browsing, search, category & price filters, sorting, pagination
- Product detail page with image gallery, ratings & reviews
- Cart (persisted in browser), coupon codes at checkout
- Checkout form (shipping address + COD/JazzCash/EasyPaisa payment selection)
- Order history & order detail tracking

**Admin Panel** (`/admin`, admin-only):
- Dashboard with revenue, orders, low-stock alerts, top products
- Products: create/edit/delete, image upload, featured toggle
- Categories: create/delete
- Orders: view all, update status (Pending → Processing → Shipped → Delivered)
- Users: view, promote/demote admin role, enable/disable accounts
- Coupons: create % or fixed discounts, usage limits, expiry
- Analytics: sales trend chart, orders-by-status pie chart, top-selling products

---

## 🔒 Security Notes
- Passwords hashed with bcrypt
- JWT-based authentication
- Order totals are **always recalculated server-side** from the database (never trusts client-submitted prices)
- Admin routes protected by role-based middleware

## 🛠 Tech Stack
React 18, React Router, Tailwind CSS, Recharts, Axios · Node.js, Express, MongoDB/Mongoose, JWT, Multer, bcryptjs
