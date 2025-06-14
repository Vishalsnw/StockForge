const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
// NOTE: For real use, add authentication middleware as needed

router.post('/create', companyController.createCompany);
router.get('/', companyController.getAllCompanies);
router.get('/:id', companyController.getCompanyById);

module.exports = router;