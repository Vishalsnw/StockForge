const mongoose = require('mongoose');
const Company = require('../models/Company');
const User = require('../models/User');

// Example company seed data
const companies = [
  { name: 'AlphaTech', sector: 'Technology', description: 'A cutting-edge tech company.' },
  { name: 'GreenFarms', sector: 'Agriculture', description: 'Organic farming and products.' },
  { name: 'SteelMakers', sector: 'Manufacturing', description: 'High-quality steel production.' }
];

async function seedCompanies() {
  // Find or create a system admin user as owner
  let owner = await User.findOne({ username: 'admin' });
  if (!owner) {
    owner = new User({ username: 'admin', password: 'admin', isBot: false, balance: 1000000 });
    await owner.save();
  }

  for (const comp of companies) {
    const company = new Company({
      ...comp,
      owner: owner._id,
      balance: 500000,
    });
    await company.save();
    console.log(`Seeded company: ${comp.name}`);
  }
}

module.exports = seedCompanies;

if (require.main === module) {
  require('../config');
  seedCompanies().then(() => {
    console.log('Companies seeded!');
    mongoose.disconnect();
  });
}