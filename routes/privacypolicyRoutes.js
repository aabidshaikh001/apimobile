const express = require('express');
const router = express.Router();
const {
    createPrivacypolicy,
    getAllPrivacypolicy
} = require('../controllers/privacypolicyController');

// POST - Create privacy policy
router.post('/', createPrivacypolicy);

// GET - Get all privacy policies
router.get('/', getAllPrivacypolicy);

module.exports = router;
