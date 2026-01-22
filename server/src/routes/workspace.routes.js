const express = require('express');
const router = express.Router();
const { createWorkspace, getUserWorkspaces, inviteMember, getWorkspaceMembers } = require('../controllers/workspace.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, createWorkspace);
router.get('/', protect, getUserWorkspaces);
router.post('/:id/invite', protect, inviteMember);
router.get('/:id/members', protect, getWorkspaceMembers);

module.exports = router;
