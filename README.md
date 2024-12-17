# Monos Backend Payment

## Overview

Monos Backend Payment is a payment module that integrates with the **Stripe API** to handle vendor subscription payments for the **Monos** mobile application. The mobile app allows vendors to register their businesses and list their products in a business directory. Before a business can be listed, vendors must pay for a subscription based on their selected tier and the number of branches they have.

This backend supports three subscription tiers: **Starter**, **Pro**, and **Enterprise**, with charges based on the number of products and additional branches.

---

## Features

- **Stripe Integration**: Secure payment processing via the Stripe API.
- **Subscription Tiers**: Vendors can choose from **Starter**, **Pro**, or **Enterprise** tiers.
- **Branch Management**: Additional branches are charged £1 per month.
- **Edge Case Handling**: Includes validation for invalid tiers, failed payments, and branch count errors.
- **Payment Records**: Stores payment details securely in a database.

---

## Setup

### Prerequisites

- **Node.js** (>= 14.x)
- **PostgreSQL** (for the database)
- **Stripe Account** (with secret and publishable keys)

### 1. Clone the Repository

```bash
git clone https://github.com/cmucheru/monos-backend-payment.git
cd monos-backend-payment
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project and add the following variables:

```env
DATABASE_URL=postgres://<user>:<password>@localhost:5432/<database_name>
STRIPE_SECRET_KEY=<your_stripe_secret_key>
STRIPE_PUBLISHABLE_KEY=<your_stripe_publishable_key>
JWT_SECRET=<your_jwt_secret_key>
```

- **DATABASE_URL**: Your PostgreSQL connection string.
- **STRIPE_SECRET_KEY**: Secret key from your Stripe account.
- **STRIPE_PUBLISHABLE_KEY**: Publishable key from your Stripe account.
- **JWT_SECRET**: Secret key used to sign JWT tokens for authentication.

### 4. Run Database Migrations

Ensure your database is set up and run the migrations to create the required tables.

```bash
npx sequelize-cli db:migrate
```

### 5. Start the Server

```bash
npm start
```

The server should now be running on `http://localhost:3000`.

---


## Database Schema

The project uses PostgreSQL with the following database schema.

### **Payments Table**

```sql
CREATE TABLE Payments (
    id SERIAL PRIMARY KEY,
    vendor_id INTEGER NOT NULL,
    subscription_tier VARCHAR(50),
    branch_count INTEGER NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    payment_intent_id VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Vendors Table**

```sql
CREATE TABLE Vendors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    subscription_tier VARCHAR(50),
    branch_count INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```
