<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Syne&weight=800&size=42&pause=1000&color=F77F00&center=true&vCenter=true&width=600&height=80&lines=Flipkart+Clone" alt="Flipkart Clone" />

**A full-stack ecommerce powerhouse — browse, cart, auth, checkout, orders.**  
*Built with React · Express · Prisma · Neon Postgres · deployed on Vercel + Render.*

<br/>

[![Live Demo](https://img.shields.io/badge/LIVE%20DEMO-▲%20Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://flipkart-clone-pink-pi.vercel.app/)
[![Backend API](https://img.shields.io/badge/BACKEND-◎%20Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://flipkart-clone-3-3a18.onrender.com/api/health)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Postgres](https://img.shields.io/badge/Neon-00E599?style=for-the-badge&logo=postgresql&logoColor=black)](https://neon.tech/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

<br/>

</div>

---

## 📑 Table of Contents

| # | Section |
|---|---------|
| 01 | [✨ Highlights](#-highlights) |
| 02 | [🛠️ Tech Stack](#%EF%B8%8F-tech-stack) |
| 03 | [🔑 Demo Account](#-demo-account) |
| 04 | [🚀 Features](#-features) |
| 05 | [📁 Project Structure](#-project-structure) |
| 06 | [⚙️ Environment Variables](#%EF%B8%8F-environment-variables) |
| 07 | [📦 Local Setup](#-local-setup) |
| 08 | [▶️ Running Locally](#%EF%B8%8F-running-locally) |
| 09 | [☁️ Deployment Notes](#%EF%B8%8F-deployment-notes) |
| 10 | [🔌 API Overview](#-api-overview) |
| 11 | [🗄️ Database Models](#%EF%B8%8F-database-models) |
| 12 | [✅ Verification](#-verification) |

---

## ✨ Highlights

> Everything you'd expect from a production ecommerce app — and then some.

- 🛍️ &nbsp;**Flipkart-style storefront** with search and category filtering
- 📦 &nbsp;**Rich product detail pages** — gallery, specs, pricing, ratings, stock state
- 👤 &nbsp;**Guest browsing + guest cart** — no forced signup to explore
- 🔐 &nbsp;**Smart post-auth continuation** — guests redirected at checkout land right back after login
- ❤️ &nbsp;**Wishlist, order confirmation, and order history**
- ✨ &nbsp;**Shimmer loading states** — zero blank screens, ever
- 📧 &nbsp;**Nodemailer order emails** — with safe preview fallback in dev
- 📱 &nbsp;**Fully responsive** desktop and mobile layouts
- ⚡ &nbsp;**Lightweight response caching** on public catalog endpoints
- 🧠 &nbsp;**Human-readable API and form errors** throughout

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| ⚛️ Frontend | React + Vite | UI framework |
| 🎨 Styling | Tailwind CSS v4 | Utility-first styles |
| 🧭 Routing | React Router | Client-side navigation |
| 📡 HTTP | Axios | API requests |
| 🟢 Runtime | Node.js + Express | REST API server |
| 🔒 Auth | JWT | Stateless authentication |
| 📬 Email | Nodemailer | Order confirmations |
| 🔷 ORM | Prisma | Database layer |
| 🐘 Database | PostgreSQL on Neon | Serverless persistent storage |
| ▲ Deploy FE | Vercel | Frontend hosting |
| ◎ Deploy BE | Render | Backend hosting |

---

## 🔑 Demo Account

> Use this to instantly explore login, cart sync, checkout, and order history.

```
Email     →  demo@flipkartclone.local
Password  →  Demo@123
```

---

## 🚀 Features

### 🛒 Shopping Experience

- Browse seeded products across multiple categories
- Search by product name, filter by category
- View images, brand, specs, ratings, pricing, and stock
- Add to cart or wishlist from any listing page

### 🔑 Auth & Checkout Flow

- Guests can browse and build a cart freely
- Guest cart is preserved and merged on login/signup
- Auth-redirect preserves the checkout destination
- Orders, carts, and history scoped to the signed-in user

### 💅 UX & Reliability

- Shimmer skeletons on every async data surface
- Stable local product assets — no broken image CDN links
- Human-readable validation + API errors
- Responsive across all screen sizes

---

## 📁 Project Structure

```
flipkart-clone/
│
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── .env
│
├── server/          # Express API + Prisma
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── server.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   └── .env
│
└── scripts/         # Root helper scripts
```

---

## ⚙️ Environment Variables

### Backend — `server/.env`

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | ✅ Yes | Neon pooled connection string |
| `DIRECT_URL` | ✅ Yes | Neon direct connection string |
| `PORT` | ✅ Yes | Backend port |
| `CLIENT_URL` | ✅ Yes | Primary frontend origin |
| `ALLOWED_ORIGINS` | ✅ Yes | Comma-separated CORS allowlist |
| `JWT_SECRET` | ✅ Yes | JWT signing secret |
| `DEFAULT_USER_EMAIL` | ⬜ No | Seed / demo fallback email |
| `MAIL_FROM` | ⬜ No | Sender identity for emails |
| `SMTP_HOST` | ⬜ No | SMTP host |
| `SMTP_PORT` | ⬜ No | SMTP port |
| `SMTP_USER` | ⬜ No | SMTP username |
| `SMTP_PASS` | ⬜ No | SMTP password or app password |

> **Note:** If SMTP values are missing, the app falls back to a safe preview transport for development.

### Frontend — `client/.env`

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_API_BASE_URL` | ✅ Production | Absolute backend URL |
| `VITE_API_PROXY_TARGET` | ✅ Dev | Local Vite proxy target for `/api` |

---

## 📦 Local Setup

### 1 — Install Dependencies

```bash
npm install
npm run setup
```

### 2 — Create Env Files

```bash
copy .env.example .env
copy server\.env.example server\.env
copy client\.env.example client\.env
```

### 3 — Prepare the Database

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

<details>
<summary><b>⚡ Quick Start — run everything at once</b></summary>

```bash
npm install && npm run setup && npm run db:generate && npm run db:push && npm run db:seed
```

</details>

---

## ▶️ Running Locally

### Backend

```bash
cd server
node src/server.js
```

| | URL |
|-|-----|
| Base | `http://localhost:4000` |
| Health Check | `http://localhost:4000/api/health` |

### Frontend

```bash
cd client
npm run dev -- --host 0.0.0.0
```

| | URL |
|-|-----|
| App | `http://localhost:5173` |

---

## ☁️ Deployment Notes

### ▲ Frontend — Vercel

Set this in your Vercel dashboard and redeploy:

```env
VITE_API_BASE_URL=https://flipkart-clone-3-3a18.onrender.com
```

### ◎ Backend — Render

| Setting | Value |
|---------|-------|
| Root Directory | `server` |
| Build Command | `npm install && npx prisma generate && npx prisma db push` |
| Start Command | `node src/server.js` |

Recommended backend env:

```env
CLIENT_URL=https://flipkart-clone-pink-pi.vercel.app
ALLOWED_ORIGINS=http://localhost:5173,https://flipkart-clone-pink-pi.vercel.app
```

> ⚠️ **Use exact origins — no trailing slash.**  
> If the frontend shows empty data or auth hits Vercel instead of Render, `VITE_API_BASE_URL` is missing from the production environment.

---

## 🔌 API Overview

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/categories` | List all categories |
| `GET` | `/api/products` | List / search products |
| `GET` | `/api/products/:slug` | Single product detail |
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT |

### 🔒 Authenticated Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/auth/me` | Get current user |
| `POST` | `/api/auth/sync-cart` | Merge guest cart on login |
| `GET` | `/api/cart` | Get user cart |
| `POST` | `/api/cart/items` | Add item to cart |
| `PATCH` | `/api/cart/items/:itemId` | Update cart item quantity |
| `DELETE` | `/api/cart/items/:itemId` | Remove cart item |
| `GET` | `/api/orders` | Get order history |
| `GET` | `/api/orders/:id` | Single order detail |
| `POST` | `/api/orders` | Place a new order |

---

## 🗄️ Database Models

```
User            →  accounts and auth
Category        →  product categories
Product         →  catalog items
ProductImage    →  gallery images per product
Cart            →  user or guest cart
CartItem        →  individual cart line items
Order           →  placed orders
OrderItem       →  line items per order
ShippingAddress →  delivery address per order
```

---

## ✅ Verification

- [x] Prisma client generation completed
- [x] Prisma schema pushed to Neon
- [x] Database seed executed successfully
- [x] Backend smoke-tested — auth, cart, orders, catalog all green

---

## 📝 Notes

- Carts and orders are user-scoped after authentication
- Guest users keep a local cart until login or signup (then merged)
- Product rendering uses local assets for image stability
- Public catalog endpoints use lightweight caching for faster browsing

---

<div align="center">

**[Live Frontend](https://flipkart-clone-pink-pi.vercel.app/) · [Backend Health](https://flipkart-clone-3-3a18.onrender.com/api/health)**

<br/>

*Built with ❤️*

</div>