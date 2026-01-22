const Workspace = require('../models/Workspace');
const User = require('../models/User');

// @desc    Create a new workspace
// @route   POST /api/workspaces
// @access  Private
const createWorkspace = async (req, res) => {
    const { name, description } = req.body;

    try {
        const workspace = await Workspace.create({
            name,
            description,
            owner: req.user._id,
            members: [{ user: req.user._id, role: 'Owner' }]
        });

        // Add workspace to user's list
        await User.findByIdAndUpdate(req.user._id, {
            $push: { workspaces: { workspace: workspace._id, role: 'Owner' } }
        });

        res.status(201).json(workspace);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all workspaces for a user
// @route   GET /api/workspaces
// @access  Private
const getUserWorkspaces = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('workspaces.workspace');
        res.json(user.workspaces);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const Notification = require('../models/Notification');

// @desc    Invite member to workspace
// @route   POST /api/workspaces/:id/invite
// @access  Private (Owner/Admin)
const inviteMember = async (req, res) => {
    const { email, role } = req.body;
    const workspaceId = req.params.id;

    try {
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

        // Check if requester has permission (Owner or Admin)
        const requester = workspace.members.find(m => m.user.toString() === req.user._id.toString());
        if (!requester || (requester.role !== 'Owner' && requester.role !== 'Admin')) {
            return res.status(403).json({ message: 'Not authorized to invite members' });
        }

        const userToInvite = await User.findOne({ email: email.toLowerCase() });
        if (!userToInvite) return res.status(404).json({ message: 'User not found. They must register first.' });

        // Check if already a member
        const isMember = workspace.members.find(m => m.user.toString() === userToInvite._id.toString());
        if (isMember) return res.status(400).json({ message: 'User is already a member' });

        // Add to workspace
        workspace.members.push({ user: userToInvite._id, role: role || 'Member' });
        await workspace.save();

        // Add to user's workspaces safely
        await User.findByIdAndUpdate(userToInvite._id, {
            $push: { workspaces: { workspace: workspaceId, role: role || 'Member' } }
        });

        // Create Notification
        await Notification.create({
            user: userToInvite._id,
            message: `${req.user.name} invited you to join the workspace: ${workspace.name}`,
            type: 'workspace_invite',
            link: `/workspace/${workspaceId}`
        });

        res.json({ message: 'Member invited successfully', workspace });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all members of a workspace
const getWorkspaceMembers = async (req, res) => {
    try {
        const workspace = await Workspace.findById(req.params.id).populate('members.user', 'name email avatar');
        if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
        res.json(workspace.members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createWorkspace,
    getUserWorkspaces,
    inviteMember,
    getWorkspaceMembers
};
