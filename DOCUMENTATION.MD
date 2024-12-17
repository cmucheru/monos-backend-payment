
### 1. **Backend Design of the Payment System for the Mobile App**

#### a. **APIs & Endpoints**

1. **Process Payment Endpoint**  
   - **Endpoint**: `/payment/process-payment`  
   - **Description**: This endpoint processes the payment for vendor subscriptions.
   - **Input**:
     ```json
     {
        "vendor_id": 19,
        "subscription_tier": "enterprise",
        "branch_count": 3,
        "paymentMethodId": "pm_card_visa",
        "customerEmail": "example@example.com"
     }
     ```
   - **Output**:
     ```json
     {
        "success": true,
        "paymentIntent": {
            "id": "pi_3QWr3qP8IfexbQCP0IPauWkA",
            "status": "succeeded",
            "amount": 700,
            "payment_method": "card"
        }
     }
     ```

2. **Get All Payments Endpoint**  
   - **Endpoint**: `/payments/all`
   - **Description**: This endpoint fetches all payment records.
   - **Input**: Optional filters like vendor_id, subscription_tier, date range, etc.
   - **Output**:
     ```json
     [
         {
            "id": 1,
            "vendor_id": 19,
            "subscription_tier": "pro",
            "branch_count": 3,
            "amount": 5.00,
            "payment_intent_id": "pi_3QWr3qP8IfexbQCP0IPauWkA",
            "status": "succeeded",
            "payment_method": "card",
            "created_at": "2024-12-17T10:19:09.369Z",
            "updated_at": "2024-12-17T10:19:09.369Z"
         },
         {
            "more data here"
         }
     ]
     ```

#### b. **Database Design**

1. **Payments Table Schema**
   ```sql
   CREATE TABLE Payments (
       id SERIAL PRIMARY KEY,              -- Auto-incremented primary key
       vendor_id INTEGER NOT NULL,         -- Reference to the vendor
       subscription_tier VARCHAR(50),      -- Subscription tier (starter, pro, enterprise)
       branch_count INTEGER NOT NULL,      -- Number of branches associated
       amount NUMERIC(10, 2) NOT NULL,     -- Total amount charged
       payment_intent_id VARCHAR(255),    -- Stripe Payment Intent ID
       status VARCHAR(50) NOT NULL,        -- Payment status (succeeded, failed)
       payment_method VARCHAR(50),         -- Payment method used (e.g., card, bank transfer)
       created_at TIMESTAMP DEFAULT NOW(), -- Timestamp for when the payment was created
       updated_at TIMESTAMP DEFAULT NOW() -- Timestamp for when the payment was last updated
   );
   ```

2. **Vendors Table Schema**
   ```sql
   CREATE TABLE Vendors (
       id SERIAL PRIMARY KEY,               -- Auto-incremented primary key
       name VARCHAR(255) NOT NULL,          -- Vendor name
       email VARCHAR(255) NOT NULL UNIQUE,  -- Vendor email (unique)
       subscription_tier VARCHAR(50),       -- Subscription tier (optional)
       branch_count INTEGER DEFAULT 1,      -- Default branch count
       created_at TIMESTAMP DEFAULT NOW(), -- Timestamp for when the vendor was created
       updated_at TIMESTAMP DEFAULT NOW()  -- Timestamp for when the vendor was last updated
   );
   ```

#### c. **Business Logic**

1. **Subscription Tiers & Pricing**
   - **Starter (£1/month)**: Up to 10 products.
   - **Pro (£3/month)**: 11-100 products.
   - **Enterprise (£5/month)**: Unlimited products (100+).
   - Each additional branch is charged £1/month.

2. **Amount Calculation Logic**
   The total cost for a vendor is calculated as follows:
   - Base tier cost (Starter, Pro, Enterprise).
   - Branch count is added with the first branch already covered in the subscription.

   For example, if a vendor selects Pro and has 3 branches:
   - Base price: £3 (Pro).
   - Additional branches: £1 for each branch beyond the first, so (£3 + (3-1) x £1 = £5).

3. **Stripe Integration**
   - Use **Stripe PaymentIntent API** to securely handle payment processing.
   - **Create or retrieve a customer** in Stripe for the vendor, if necessary.
   - Process the payment and store the **payment_intent_id** for future reference.

#### d. **Edge Cases and Handling**

1. **Invalid Subscription Tier**
   - Edge Case: If a vendor selects an invalid subscription tier that does not match "starter", "pro", or "enterprise".
   - **Handling**: Return a validation error response.
     - Example error response:  
       ```json
       { "error": "Invalid subscription tier. Please choose a valid tier." }
       ```

2. **Branch Count Validation**
   - Edge Case: A vendor provides a **negative or zero branch count**.
   - **Handling**: Ensure that the branch count is always a positive integer.
     - Example error response:
       ```json
       { "error": "Branch count must be a positive integer." }
       ```

3. **Payment Failure**
   - Edge Case: Payment fails due to issues like insufficient funds, network problems, or incorrect card information.
   - **Handling**: Log the payment failure, notify the vendor, and allow retry attempts.
     - Example error response:  
       ```json
       { "error": "Payment failed. Please try again or contact support." }
       ```

4. **Duplicate Payment Intent**
   - Edge Case: A duplicate payment intent ID is submitted.
   - **Handling**: Ensure that payment intent IDs are unique for each payment.
     - Example error response:  
       ```json
       { "error": "Duplicate payment detected. Please try again." }
       ```

5. **Incorrect Branch Count Calculation**
   - Edge Case: Incorrect pricing calculation due to improper application of branch count.
   - **Handling**: Correctly apply the branch count-based pricing logic, ensuring the additional branches are added correctly.
     - Example calculation error response:
       ```json
       { "error": "Incorrect branch count calculation. Please contact support." }
       ```

6. **Expired or Invalid Stripe API Keys**
   - Edge Case: Stripe API keys are expired or invalid.
   - **Handling**: Return an error indicating the Stripe API issue.
     - Example error response:
       ```json
       { "error": "Stripe API error. Please contact support." }
       ```

---

### 2. **System Design**

#### a. **Overview**

- **Vendor Registration**: Vendors register their businesses, select a subscription tier, and provide details such as name, email, and branch count.
- **Payment Processing**: Payment is processed securely via Stripe, and the payment information is stored in the database.
- **Subscription Management**: Vendors are associated with a subscription tier and the number of branches they have.
- **API Integration**: Multiple endpoints handle vendor registration, payment processing, and fetching payment records.

#### b. **Key Components**

- **Frontend (Mobile App)**: Vendor interacts with the app to register, select subscription, and enter payment details.
- **Backend (API Server)**: Handles the processing of payments and stores vendor and payment details in the database.
- **Stripe Integration**: Manages payment processing via Stripe, including customer creation and handling payment intents.
- **Database**: Stores all vendor and payment information securely.

---

### 3. **Conclusion**

This module ensures **secure and reliable payment processing** using Stripe, which integrates seamlessly with the vendor registration and subscription system. The backend handles multiple payment-related tasks, including vendor subscription selection, amount calculation based on tiers and branches, and payment intent handling.


### **GitHub Link for Codebase & Documentation**
- [Monos Backend Payment](https://github.com/cmucheru/monos-backend-payment)

