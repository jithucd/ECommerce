const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/ecommerce-site', { useNewUrlParser: true, useUnifiedTopology: true });

const productRouter = require('./routes/products.js');
const userRouter = require('./routes/users.js');
const orderRouter = require('./routes/orders.js');

app.use(express.json());
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

app.listen(3001, () => {
  console.log('Server listening on port 3001');
});