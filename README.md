# 🥏 DiscGolf Pro Shop – Inventory Management

A modern web app for managing a disc golf shop's inventory.

## Features
- **Browse** all products with search and category filtering
- **Add** new products (discs, bags, accessories)
- **Edit** any product's details
- **Delete** products with a confirmation step
- **Adjust stock quantity** directly from each product card
- Pre-populated with **20 real disc golf products** from brands like Innova, Discraft, Dynamic Discs, Latitude 64, Kastaplast, Westside, Axiom, MVP, Prodigy, and Discmania

## Tech Stack
- **Backend**: Node.js + Express + SQLite (`better-sqlite3`)
- **Frontend**: React 19 + Vite
- **Styling**: Custom CSS with dark theme

## Getting Started

### 1. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### 2. Start the backend (Terminal 1)

```bash
cd backend
node server.js
# → API running on http://localhost:3001
```

### 3. Start the frontend (Terminal 2)

```bash
cd frontend
npm run dev
# → App running on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/products` | List products (supports `?search=` and `?category=`) |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| PUT | `/api/products/:id/quantity` | Update quantity only |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/categories` | List all categories |

## Product Categories
- **Distance Driver** – e.g. Innova Boss, Discraft Zeus
- **Fairway Driver** – e.g. Innova Leopard3, Kastaplast Reko
- **Mid-Range** – e.g. Discraft Buzzz, Innova Mako3
- **Putter** – e.g. Innova Aviar, Dynamic Discs Judge
- **Disc Bag** – e.g. Discmania Weekender, Prodigy BP-3
- **Basket** – e.g. MVP Black Hole Pro
- **Accessories** – Towels, mini markers, etc.

