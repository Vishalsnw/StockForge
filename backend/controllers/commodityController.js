const Product = require('../models/Product');
const Company = require('../models/Company');

// Create new product for a company
exports.createProduct = async (req, res) => {
  try {
    const { name, description, productionCost, marketPrice, quantity, companyId } = req.body;
    const product = new Product({
      name,
      description,
      productionCost,
      marketPrice,
      quantity,
      company: companyId,
    });
    await product.save();

    // Add product to company
    await Company.findByIdAndUpdate(companyId, { $push: { products: product._id } });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// List all products (commodities)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('company', 'name');
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get product by id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('company', 'name');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};