const  {createProfile,getAllProfiles,getProfileById} = require('../controllers/foragentController.js');
const  express = require('express');
const router = express.Router();
router.get('/', getAllProfiles);
router.get('/:id', getProfileById);
router.post('/', createProfile);
module.exports = router;