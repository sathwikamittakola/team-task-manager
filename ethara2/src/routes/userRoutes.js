const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.use(protect);
router.use(authorize('Admin'));

router.get('/', getUsers);
router.put('/:id/role', updateUserRole);

module.exports = router;
