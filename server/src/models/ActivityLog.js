const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true
    },
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board'
    },
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace'
    },
    card: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card'
    },
    details: String
}, {
    timestamps: true
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
