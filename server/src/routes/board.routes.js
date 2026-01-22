const express = require('express');
const router = express.Router();
const { createBoard, getWorkspaceBoards, getBoardDetails, addList, deleteBoard, deleteList, updateBoard, updateList } = require('../controllers/board.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, createBoard);
router.get('/workspace/:workspaceId', protect, getWorkspaceBoards);
router.get('/:id', protect, getBoardDetails);
router.put('/:id', protect, updateBoard);
router.post('/:id/lists', protect, addList);
router.put('/:id/lists/:listId', protect, updateList);
router.delete('/:id/lists/:listId', protect, deleteList);
router.delete('/:id', protect, deleteBoard);

module.exports = router;
