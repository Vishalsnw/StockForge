const Company = require('../models/Company');
const User = require('../models/User');

exports.createCompany = async (req, res) => {
  try {
    const { name, sector, description, logoUrl } = req.body;
    const owner = req.user._id;
    const company = new Company({ name, sector, description, logoUrl, owner });
    await company.save();

    // Add company to user
    await User.findByIdAndUpdate(owner, { $push: { companies: company._id } });

    res.status(201).json({ success: true, company });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate('owner', 'username');
    res.json({ success: true, companies });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate('owner', 'username')
      .populate('products');
    if (!company) return res.status(404).json({ success: false, message: 'Company not found.' });
    res.json({ success: true, company });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};