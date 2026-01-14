const mongoose = require('mongoose');

const DeliverableSchema = new mongoose.Schema({
    dealId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Deal',
        required: true,
    },
    title: {
        type: String,
        required: true,
        // e.g. "Reel Draft 1"
    },
    link: {
        type: String,
        required: false,
    },
    version: {
        type: Number,
        default: 1,
    },
    status: {
        type: String,
        enum: ['DRAFT', 'SENT', 'APPROVED', 'CHANGES_REQUESTED'],
        default: 'DRAFT',
    },
    comments: [{
        text: String,
        authorRole: { type: String, enum: ['CREATOR', 'BRAND'] },
        createdAt: { type: Date, default: Date.now }
    }],
}, { timestamps: true });

module.exports = mongoose.model('Deliverable', DeliverableSchema);
