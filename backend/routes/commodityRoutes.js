const express = require('express');
const router = express.Router();
const commodityController = require('../controllers/commodityController');

// Create new product (commodity)
router.post('/create', commodityController.createProduct);
// List all products
router.get('/', commodityController.getAllProducts);
// Get product by id
router.get('/:id', commodityController.getProductById);

module.exports = router;