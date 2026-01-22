const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a board name'],
        trim: true
    },
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    visibility: {
        type: String,
        enum: ['private', 'team'],
        default: 'team'
    },
    lists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Board', boardSchema);
