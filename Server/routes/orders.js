const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
// const Joi = require('joi');

// // Validation schema
// const orderSchema = Joi.object({
//   products: Joi.array().items(Joi.string().required()).required(),
//   total: Joi.number().required()
// });

router.post('/api/cart/add', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json(order);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: 'Error creating order' });
  }
});
// Fetch all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('products'); // Populate the products field
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});
// routes/orders.js
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id, status: 'pending' })
      .populate('items.product');
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching cart' });
  }
});
module.exports = router;