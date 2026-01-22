const ActivityLog = require('../models/ActivityLog');

const logActivity = async ({ user, action, board, workspace, card, details }) => {
    try {
        await ActivityLog.create({
            user,
            action,
            board,
            workspace,
            card,
            details
        });
    } catch (error) {
        console.error('Activity Log Error:', error);
    }
};

module.exports = logActivity;
