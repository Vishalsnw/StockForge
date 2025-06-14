const Bot = require('../models/Bot');
const User = require('../models/User');

// Create a new bot (admin only)
exports.createBot = async (req, res) => {
  try {
    const { name, type, strategy } = req.body;

    // Create a user for the bot
    const user = new User({
      username: name,
      password: 'botpassword',
      isBot: true,
      balance: 1000000,
    });
    await user.save();

    const bot = new Bot({
      name,
      type,
      user: user._id,
      strategy,
      isActive: true,
    });
    await bot.save();

    res.status(201).json({ success: true, bot });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// List all bots
exports.getAllBots = async (req, res) => {
  try {
    const bots = await Bot.find().populate('user', 'username');
    res.json({ success: true, bots });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Activate/Deactivate a bot
exports.toggleBotActive = async (req, res) => {
  try {
    const { botId } = req.body;
    const bot = await Bot.findById(botId);
    if (!bot) return res.status(404).json({ success: false, message: 'Bot not found.' });
    bot.isActive = !bot.isActive;
    await bot.save();
    res.json({ success: true, bot });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};