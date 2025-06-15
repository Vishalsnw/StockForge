const express = require('express');
const router = express.Router();

// Dummy IPO Data (Aap chahe toh yahan database se data la sakte hain)
const ipoList = [
  {
    id: 1,
    name: "ABC Ltd",
    openDate: "2025-06-20",
    closeDate: "2025-06-24",
    priceBand: "₹100-₹120"
  },
  {
    id: 2,
    name: "XYZ Corp",
    openDate: "2025-07-01",
    closeDate: "2025-07-05",
    priceBand: "₹200-₹240"
  }
];

// GET all IPOs
router.get('/', (req, res) => {
  res.json(ipoList);
});

// GET a single IPO by ID
router.get('/:id', (req, res) => {
  const ipo = ipoList.find(item => item.id == req.params.id);
  if (ipo) {
    res.json(ipo);
  } else {
    res.status(404).json({ error: "IPO not found" });
  }
});

module.exports = router;
