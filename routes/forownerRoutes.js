const  {getAllProfiles,createProfile,getProfileById} = require('../controllers/forownerController.js');
const  express = require('express');
const router = express.Router();
router.get('/', getAllProfiles);
router.get('/:id', getProfileById);
router.post('/', createProfile);
module.exports = router;
