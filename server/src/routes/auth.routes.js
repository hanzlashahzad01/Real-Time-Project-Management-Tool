const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getUserProfile, updateProfile, removeAvatar, updatePassword } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateProfile);
router.delete('/profile/avatar', protect, removeAvatar);
router.put('/update-password', protect, updatePassword);

module.exports = router;
