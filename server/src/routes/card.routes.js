const express = require('express');
const router = express.Router();
const { createCard, updateCard, moveCard, addComment, deleteCard } = require('../controllers/card.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, createCard);
router.put('/:id', protect, updateCard);
router.delete('/:id', protect, deleteCard);
router.post('/move', protect, moveCard);
router.post('/:id/comments', protect, addComment);

module.exports = router;
