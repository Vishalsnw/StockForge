const IPO = require('../models/IPO');
const Company = require('../models/Company');

exports.launchIPO = async (req, res) => {
  try {
    const { companyId, totalShares, sharePrice } = req.body;
    // Only allow IPO if not already listed
    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ success: false, message: 'Company not found.' });
    if (company.ipo) return res.status(400).json({ success: false, message: 'IPO already exists.' });

    const ipo = new IPO({
      company: companyId,
      totalShares,
      sharePrice,
      sharesAvailable: totalShares,
      isOpen: true,
    });
    await ipo.save();

    company.ipo = ipo._id;
    await company.save();

    res.status(201).json({ success: true, ipo });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getIPOs = async (req, res) => {
  try {
    const ipos = await IPO.find({ isOpen: true }).populate('company');
    res.json({ success: true, ipos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getIPOByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const ipo = await IPO.findOne({ company: companyId }).populate('company');
    if (!ipo) return res.status(404).json({ success: false, message: 'IPO not found.' });
    res.json({ success: true, ipo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};