# InstaTube Virals – Multi-Vendor E-Commerce Marketplace

**InstaTube Virals** is a complete, modern, responsive multi-vendor e-commerce marketplace connecting small-scale organic farmers, traditional artisans, handmade creators, and independent sellers directly with conscious shoppers.

Designed with a warm earthy aesthetic (warm cream `#FAF7F2`, forest green `#234E32`, terracotta `#C85A32`, and earthy brown `#4A3728`), the platform features strict role-based access, guest-access product restrictions, comprehensive seller & product curation workflows, and an atomic checkout pipeline with Cash on Delivery (COD).

---

## 🌿 Tech Stack

- **Frontend**:
  - React.js with Vite
  - React Router DOM
  - Context API (`AuthContext` & `CartContext`)
  - Axios with JWT Interceptors and automatic token refresh
  - Pure CSS3 custom design system
  - Lucide React for consistent icons
- **Backend**:
  - Python 3.12+ & Django 6.1
  - Django REST Framework (DRF)
  - SimpleJWT (`rest_framework_simplejwt`)
  - SQLite Database with atomic transactions
  - Django Media Storage for product photography
  - `django-cors-headers`

---

## 👥 User Roles & Permissions

| Role | Access Level & Key Capabilities |
| :--- | :--- |
| **Guest** | Can access **only** Home (`/`), Our Story (`/about`), Login (`/login`), Customer Registration (`/register`), and Seller Application (`/register-seller`). **Product listings and details are strictly blocked by both frontend guards and backend APIs.** |
| **Customer** | Authenticated access to the curated Marketplace (`/marketplace`), search & category filters, full product detail view, live shopping cart, atomic checkout with Cash on Delivery (COD), order tracking, and profile address management. |
| **Seller** | Seller Hub dashboard, product catalog management (Add, Edit, Delete own products), real-time approval status tracking (`PENDING`, `APPROVED`, `REJECTED`), and order fulfillment milestone management (`PROCESSING`, `SHIPPED`, `DELIVERED`). Must be approved by Admin before products appear in the marketplace. |
| **Admin** | Overview dashboard with marketplace GMV, total customer and seller counts, pending seller application approvals/rejections, product curation queue, category taxonomy CRUD, and platform-wide order management. |

---

## 🔑 Pre-Seeded Demo Accounts

The database comes pre-seeded with realistic data, products, categories, and past orders. You can log into any role immediately:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@instatube.com` | `Admin@12345` | Platform Curator (Eleanor Vance) |
| **Approved Seller 1** | `artisan@instatube.com` | `Seller@12345` | EarthCrafts Artisan Studio |
| **Approved Seller 2** | `farmer@instatube.com` | `Seller@12345` | GreenValley Organic Homestead |
| **Pending Seller** | `newcrafter@instatube.com` | `Seller@12345` | TimberWood Heritage Studio (Awaiting Review) |
| **Customer** | `customer@instatube.com` | `Customer@12345` | Aria Montgomery |

> **Tip:** The Login page (`/login`) also includes **one-click demo login buttons** to switch between accounts with a single click.

---

## 🚀 Quickstart & Execution

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Backend Setup & Run

Open a terminal in the project root:

```bash
# 1. Install dependencies
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers pillow

# 2. Run migrations
python manage.py migrate

# 3. Seed demo database (Admin, Sellers, Categories, Products, and Orders)
python manage.py seed_data

# 4. Start Django backend server (runs on http://127.0.0.1:8000)
python manage.py runserver 8000
```

### 3. Frontend Setup & Run

Open a second terminal in the `frontend/` directory:

```bash
cd frontend

# 1. Install frontend packages
npm install

# 2. Start Vite dev server (runs on http://localhost:5173)
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🧪 Automated End-to-End Verification

A comprehensive automated test script (`test_api.py`) verifies all 6 critical functional requirements:

```bash
python test_api.py
```

### Verification Checks:
1. **Guest Access Guard**: Verifies that requests to `/api/products/` without credentials strictly return `401 Unauthorized`.
2. **Customer Access**: Authenticates customer and confirms only `APPROVED` products are returned.
3. **Seller Restrictions**: Confirms approved sellers can create products with initial status `PENDING`.
4. **Admin Curation**: Confirms admin can approve products to make them live.
5. **Atomic Checkout**: Re-validates stock under lock, decrements inventory, creates order and order items with price snapshots, and clears cart in an atomic transaction.
6. **Seller Fulfillment**: Confirms sellers can update their items' fulfillment milestones (`SHIPPED`, `DELIVERED`).

---

## 🗄️ Database Architecture

1. **`accounts.User`**: Custom user model with role choices (`CUSTOMER`, `SELLER`, `ADMIN`), email authentication, and profile relationships.
2. **`accounts.Address`**: Customer delivery destinations with default address flag.
3. **`accounts.CustomerProfile`**: Extended customer phone and address data.
4. **`sellers.SellerProfile`**: OneToOne with User, store brand name, workshop description, dispatch address, and `approval_status` (`PENDING`, `APPROVED`, `REJECTED`).
5. **`categories.Category`**: Category name, auto-slug, description, and icon reference.
6. **`products.Product`**: Seller foreign key, Category foreign key, title, description, price, stock, image/image_url, and curation status.
7. **`cart.Cart` & `cart.CartItem`**: OneToOne customer cart, unique `(cart, product)` constraint, stock validation on quantity changes.
8. **`orders.Order`**: Unique alphanumeric order number (`ITV-XXXXXXXX`), customer foreign key, total amount, shipping snapshot, and payment method (`COD`).
9. **`orders.OrderItem`**: Snapshot price at checkout time, seller foreign key, product link, and seller fulfillment status.

---

## 🛡️ Security & Strict Rules

- **Zero Dead Buttons**: Every button, link, filter, quantity control, checkout step, and modal is end-to-end connected to React state and backend APIs.
- **Login-Gated Visibility**: Product catalog and product details are inaccessible to guests on both frontend router guards and DRF permission classes.
- **Role Isolation**: Sellers can modify only their own catalog items; customers can access only their own carts and orders; admins have oversight over the entire platform.
