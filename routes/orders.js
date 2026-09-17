const router = require('express').Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const requireAuth = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const { emit } = require('../socket');

// req.body.items = [{ productId, qty }, ...]
router.post('/', requireAuth, async (req, res) => {
  const items = [];
  let total = 0;

  for (const { productId, qty } of req.body.items) {
    const product = await Product.findById(productId);

    items.push({
      product: product._id,
      name: product.name,
      price: product.price,
      qty
    });

    total += product.price * qty;
    product.stock -= qty;
    await product.save();
  }

  const order = await Order.create({
    user: req.user.userId,
    items,
    total
  });
  emit('orderPlaced', { orderId: order._id, total: order.total });

  res.status(201).json(order);
});

router.get('/', requireAuth, async (req, res) => {
  res.json(await Order.find({ user: req.user.userId }));
});

module.exports = router;