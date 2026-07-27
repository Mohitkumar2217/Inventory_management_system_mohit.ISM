# Inventory Management System

A full-stack **Inventory Management System** built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**. The application streamlines warehouse operations by providing secure inventory, supplier, product, category, order, and staff management through a modern dashboard.

The backend follows a modular RESTful architecture with JWT-based authentication and role-based authorization, while the frontend delivers a responsive user experience using React and Vite.

---

## Features

### Authentication
- User Registration & Login
- Forgot Password & Password Reset
- JWT Authentication
- Protected Routes
- Role-Based Access Control

### Inventory Management
- Warehouse Stock Management
- Product Management
- Category Management
- Supplier Management
- Order Management

### Staff Management
- Staff Profile Management
- Staff Administration
- Role Management (Admin, Manager, Warehouse Staff)

### Dashboard
- Product Analytics
- Order Analytics
- Inventory Tracking
- Search & Filtering

### Additional Features
- File Uploads using Multer
- RESTful API Design
- MongoDB Integration
- Responsive User Interface

---

# Tech Stack

## Frontend

- React.js
- Vite
- React Router
- Context API
- Axios
- CSS

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Multer
- dotenv

---

# Project Structure

```text
Inventory_management_system_mohit.ISM
│
├── backend
│   ├── controllers/
│   ├── db/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── utils/
│   ├── index.js
│   ├── seed.js
│   └── package.json
│
├── frontend
│   ├── public/
│   ├── src/
│   │   ├── Staff/
│   │   ├── Warehouse/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layout/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# System Architecture

```text
                              Inventory Management System

┌────────────────────────────────────────────────────────────────────────────┐
│                             React Frontend                                │
│                                                                            │
│ Dashboard │ Staff │ Warehouse │ Orders │ Products │ Suppliers │ Categories │
└───────────────────────────────┬────────────────────────────────────────────┘
                                │
                         HTTP / REST API
                                │
┌───────────────────────────────▼────────────────────────────────────────────┐
│                            Express.js Server                              │
│                                                                            │
│ Authentication │ Routes │ Middleware │ Controllers │ Business Logic        │
└───────────────────────────────┬────────────────────────────────────────────┘
                                │
┌───────────────────────────────▼────────────────────────────────────────────┐
│                          Authentication Layer                             │
│                                                                            │
│ JWT Authentication │ Role-Based Authorization │ Request Validation         │
└───────────────────────────────┬────────────────────────────────────────────┘
                                │
┌───────────────────────────────▼────────────────────────────────────────────┐
│                            Mongoose Models                                │
│                                                                            │
│ Users │ Staff │ Warehouse │ Products │ Orders │ Categories │ Suppliers     │
└───────────────────────────────┬────────────────────────────────────────────┘
                                │
┌───────────────────────────────▼────────────────────────────────────────────┐
│                             MongoDB Database                              │
└────────────────────────────────────────────────────────────────────────────┘
```

---

# Request Flow

```text
User
 │
 ▼
React Frontend
 │
 ▼
Axios HTTP Requests
 │
 ▼
Express Routes
 │
 ▼
Authentication Middleware
 │
 ▼
Controllers
 │
 ▼
Database Models
 │
 ▼
MongoDB
```

---

# REST API

## Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate user |
| POST | `/api/auth/forgot-password` | Send password reset link |
| POST | `/api/auth/reset-password/:token` | Reset password |

---

## Categories

| Method | Endpoint |
|--------|----------|
| GET | `/api/categories` |
| POST | `/api/categories` |
| PUT | `/api/categories/:id` |
| DELETE | `/api/categories/:id` |

---

## Products

| Method | Endpoint |
|--------|----------|
| GET | `/api/products` |
| GET | `/api/products/analysis/trends` |
| POST | `/api/products` |
| PUT | `/api/products/:id` |
| DELETE | `/api/products/:id` |

---

## Warehouse

| Method | Endpoint |
|--------|----------|
| GET | `/api/warehouse` |
| POST | `/api/warehouse` |
| PUT | `/api/warehouse/:id` |
| DELETE | `/api/warehouse/:id` |

---

## Suppliers

| Method | Endpoint |
|--------|----------|
| GET | `/api/suppliers` |
| POST | `/api/suppliers` |
| PUT | `/api/suppliers/:id` |
| DELETE | `/api/suppliers/:id` |

---

## Staff

| Method | Endpoint |
|--------|----------|
| GET | `/api/staffs/profile` |
| PUT | `/api/staffs/update-profile` |
| GET | `/api/staffs` |
| POST | `/api/staffs` |
| PUT | `/api/staffs/:id` |
| DELETE | `/api/staffs/:id` |

---

## Orders

| Method | Endpoint |
|--------|----------|
| GET | `/api/orders` |
| GET | `/api/orders/analysis/trends` |
| POST | `/api/orders` |
| PUT | `/api/orders/:id` |
| PATCH | `/api/orders/status/:id` |
| DELETE | `/api/orders/:id` |

---

# Installation

## Clone Repository

```bash
git clone https://github.com/Mohitkumar2217/Inventory_management_system_mohit.ISM.git

cd Inventory_management_system_mohit.ISM
```

## Backend Setup

```bash
cd backend

npm install

npm run dev
```

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# Environment Variables

Create a `.env` file inside the `backend` directory.

```env
PORT=4000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email

EMAIL_PASS=your_email_password

FRONTEND_URL=http://localhost:5173
```

---

# Security

- JWT Authentication
- Role-Based Authorization
- Password Hashing (bcrypt)
- Protected REST APIs
- Secure Password Reset Flow
- Middleware-Based Request Validation
- File Upload Validation using Multer

---

# Future Improvements

- Dashboard Charts
- Barcode & QR Code Integration
- Low Stock Notifications
- Export Reports (PDF/Excel)
- Docker Support
- CI/CD Pipeline
- Unit & Integration Testing
- Swagger API Documentation

---

# Author

**Mohit Kumawat** 

---

## Show Your Support

If you found this project useful, consider giving it a ⭐ on GitHub.
