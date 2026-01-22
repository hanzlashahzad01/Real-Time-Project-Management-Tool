const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['card_assigned', 'comment_added', 'workspace_invite', 'board_update', 'user_status'],
        default: 'board_update'
    },
    read: {
        type: Boolean,
        default: false
    },
    link: {
        type: String // Optional URL to navigate to
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', notificationSchema);
