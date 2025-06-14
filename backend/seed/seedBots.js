const mongoose = require('mongoose');
const User = require('../models/User');
const Bot = require('../models/Bot');

const botDefinitions = [
  { name: 'MarketMakerBot1', type: 'market_maker', strategy: { minOrder: 10, maxOrder: 200 } },
  { name: 'RandomTraderBot1', type: 'random_trader', strategy: { minOrder: 5, maxOrder: 100 } },
  { name: 'MarketMakerBot2', type: 'market_maker', strategy: { minOrder: 20, maxOrder: 500 } }
];

async function seedBots() {
  for (const def of botDefinitions) {
    // Create a bot user
    const user = new User({
      username: def.name,
      password: 'botpassword',
      isBot: true,
      balance: 1000000,
    });
    await user.save();

    // Create the bot
    const bot = new Bot({
      name: def.name,
      type: def.type,
      user: user._id,
      strategy: def.strategy,
      isActive: true,
    });
    await bot.save();

    console.log(`Seeded bot: ${def.name}`);
  }
}

module.exports = seedBots;

if (require.main === module) {
  require('../config');
  seedBots().then(() => {
    console.log('Bots seeded!');
    mongoose.disconnect();
  });
}