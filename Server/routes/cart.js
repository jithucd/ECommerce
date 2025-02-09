const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Add to cart (protected route)
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    // Validate input
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find existing cart for user
    let order = await Order.findOne({
      user: req.user.id,
      status: 'pending'
    }).populate('items.product');

    // Create new cart if none exists
    if (!order) {
      order = new Order({
        user: req.user.id,
        items: [],
        total: 0,
        status: 'pending'
      });
    }

    // Check if product already in cart
    const existingItem = order.items.find(item => 
      item.product._id.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      order.items.push({ product: productId, quantity });
    }

    // Calculate total
    order.total = order.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    await order.save();
    res.json(order);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
// routes/cart.js
router.delete('/:itemId', auth, async (req, res) => {
    try {
      const order = await Order.findOne({
        user: req.user.id,
        status: 'pending'
      });
  
      if (!order) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      // Remove the item from the cart
      order.items = order.items.filter(
        (item) => item.product.toString() !== req.params.itemId
      );
  
      // Recalculate the total
      order.total = order.items.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity);
      }, 0);
  
      await order.save();
      res.json(order);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error removing item from cart' });
    }
  });
module.exports = router;