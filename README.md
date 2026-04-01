**CTGGrocery** is a modern, full-stack e-commerce platform for grocery delivery, built with Django REST Framework (backend) and React (frontend) using Tailwind CSS for a clean, responsive UI.

**Features:**
- User authentication with JWT, registration, login, and role-based access (admin/customer).
- Product catalog with category, brand, and keyword search/filtering.
- Cart and checkout: add/remove items, update quantities, order summary, and order history.
- Admin dashboard for managing products, viewing orders, analytics, and inventory.
- Order management: track status, reorder, manage profiles and addresses.
- RESTful API endpoints for all core resources, ready for mobile or other clients.
- Responsive, mobile-friendly UI inspired by leading e-commerce sites.
- Easy local setup: SQLite for development, PostgreSQL for production, Docker Compose for containers.
- Modular, extensible codebase for easy feature expansion.

**Tech Stack:**
• Backend: Django, Django REST Framework, JWT Auth, PostgreSQL/SQLite, Docker
• Frontend: React, Tailwind CSS, React Router, Axios

**Project Structure:**
```
GroceryCTG/
├── backend/
│   ├── accounts/         # User models, authentication
│   ├── analytics/        # Analytics endpoints
│   ├── carts/            # Cart logic
│   ├── coupons/          # Coupon logic
│   ├── orders/           # Order management
│   ├── products/         # Product catalog
│   ├── ctggrocery/       # Django settings/urls
│   ├── media/            # Uploaded files
│   ├── static/           # Static files
│   ├── requirements.txt  # Python deps
│   └── manage.py         # Django script
├── frontend/
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── api.js        # API logic
│   │   ├── App.js        # Main app/routing
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page components
│   │   └── index.js      # Entry point
│   ├── package.json      # Frontend deps
│   └── tailwind.config.js# Tailwind config
├── docker-compose.yml    # Orchestration
├── README.md             # Docs
└── .env.example          # Env vars
```
