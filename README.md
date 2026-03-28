# Flipkart Clone 

Full-stack Flipkart-inspired ecommerce application built with React, Express, Prisma, and Neon Postgres.

## Stack

- Frontend: React + Vite
- Styling: Tailwind CSS v4
- Backend: Node.js + Express
- Database: PostgreSQL on Neon
- ORM: Prisma
- Auth: JWT-based authentication
- Mail: Nodemailer

## Core Features

- Product listing with search and category filters
- Product detail page with gallery, specs, stock, and pricing
- Guest browsing and guest cart
- Signup and login
- User-scoped cart and user-scoped order history
- Checkout gated behind authentication
- Post-login continuation back into the buying flow
- Wishlist page
- Order confirmation and order history
- Responsive layout across desktop and mobile
- Shimmer/skeleton loading states
- Human-readable validation and API errors
- Local product assets for reliable image rendering
- Optional email notification on order placement

## Guest And Auth Flow

- Guests can browse products, search, filter, view product details, and add items to cart
- Guests cannot place orders
- If a guest tries to buy or checkout, the app redirects them to login/signup
- After successful authentication, the guest cart is merged into the user cart
- After authentication, the user is returned to the intended buying step

## Demo Account

- Email: `demo@flipkartclone.local`
- Password: `Demo@123`

## Project Structure

```text
client/   React frontend
server/   Express API + Prisma schema + seed
scripts/  Root helper scripts
```

## Environment

Backend config lives in [server/.env](D:/Project-Flipkart/server/.env).
Frontend config lives in [client/.env](D:/Project-Flipkart/client/.env).

Required database/app values:

- `DATABASE_URL`
- `DIRECT_URL`
- `PORT`
- `CLIENT_URL`
- `ALLOWED_ORIGINS`
- `DEFAULT_USER_EMAIL`
- `JWT_SECRET`

Optional email values:

- `MAIL_FROM`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`

If SMTP values are not configured, the app falls back to a non-SMTP preview transport so order-email generation still works safely during development.

Frontend values:

- `VITE_API_BASE_URL`
  Example: `https://your-backend-service.onrender.com`
- `VITE_API_PROXY_TARGET`
  Example: `http://localhost:4000`

## Setup

From the project root:

```bash
npm install
npm run setup
```

Create env files from the examples before running:

```bash
copy .env.example .env
copy server\.env.example server\.env
copy client\.env.example client\.env
```

Then prepare the database:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

## Run The Backend

```bash
cd server
node src/server.js
```

Backend URL:

- `http://localhost:4000`
- health check: `http://localhost:4000/api/health`

## Run The Frontend

```bash
cd client
npm run dev -- --host 0.0.0.0
```

Frontend URL:

- `http://localhost:5173`

## API Overview

Public:

- `GET /api/health`
- `GET /api/categories`
- `GET /api/products`
- `GET /api/products/:slug`
- `POST /api/auth/signup`
- `POST /api/auth/login`

Authenticated:

- `GET /api/auth/me`
- `POST /api/auth/sync-cart`
- `GET /api/cart`
- `POST /api/cart/items`
- `PATCH /api/cart/items/:itemId`
- `DELETE /api/cart/items/:itemId`
- `GET /api/orders`
- `GET /api/orders/:id`
- `POST /api/orders`

## Database Models

- `User`
- `Category`
- `Product`
- `ProductImage`
- `Cart`
- `CartItem`
- `Order`
- `OrderItem`
- `ShippingAddress`

## Notes

- Cart and orders are now user-dependent
- Guest users keep a local cart until login/signup
- Product rendering uses local product assets for image stability
- The backend applies a small cache to public catalog endpoints for faster browsing

## Verification Completed

- Prisma client generation
- Prisma schema push to Neon
- Database reseed
- Backend smoke test for:
  - signup
  - authenticated `/auth/me`
  - authenticated cart access
  - catalog endpoints
