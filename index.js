const express = require('express');
const app = express();
const port = 3000;

const sequelize = require('./config/db.config'); // Import Sequelize configuration
const paymentRoutes = require('./routes/payment.routes');
const vendorRoutes = require('./routes/vendor.routes');
const stripeWebhookRoutes = require('./routes/stripe-webhook.routes');

require('dotenv').config(); // Load environment variables

app.use(express.json());

// Sync Sequelize models
sequelize.sync().then(() => {
    console.log('Database synced.');
}).catch(err => {
    console.error('Unable to sync database:', err);
});

// Use routes
app.use('/payment', paymentRoutes);
app.use('/vendor',vendorRoutes);
//app.use('/webhooks',stripeWebhookRoutes);



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
