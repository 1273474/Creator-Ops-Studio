const mongoose = require('mongoose');
const crypto = require('crypto');

const DealSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    brandName: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    shareToken: {
        type: String,
        unique: true,
    },
    status: {
        type: String,
        enum: [
            'CONFIRMED',
            'IN_PRODUCTION',
            'SENT_FOR_APPROVAL',
            'POSTED',
            'PAYMENT_PENDING',
            'PAID'
        ],
        default: 'CONFIRMED',
    },
}, { timestamps: true });

// Generate shareToken automatically before saving if it doesn't exist
DealSchema.pre('save', function (next) {
    if (!this.shareToken) {
        this.shareToken = crypto.randomBytes(16).toString('hex');
    }
    next();
});

module.exports = mongoose.model('Deal', DealSchema);
