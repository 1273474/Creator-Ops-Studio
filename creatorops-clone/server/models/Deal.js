const mongoose = require('mongoose')
const crypto = require('crypto')

const DealSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,  // Special type for MongoDB IDs
        //     └── This is how we create RELATIONSHIPS in MongoDB
        ref: 'User',           // Which collection does this ID refer to?
        //     └── Enables "population" - loading the actual user data
        required: [true, 'User ID is required']
    },
    brandName: {
        type: String,
        required: [true, 'Brand name is required'],
        trim: true
    },
    brandEmail: {
        type: String,
        trim: true,
        lowercase: true
        // Not required - might not always have it
    },
    value: {
        type: Number,
        default: 0,
        min: [0, 'Deal value cannot be negative']
    },
    dueDate: {
        type: Date
        // Not required - might be open-ended
    },
    status: {
        type: String,
        enum: [
            'CONFIRMED',        // Deal is confirmed, starting work
            'IN_PRODUCTION',    // Creating content
            'SENT_FOR_APPROVAL',// Waiting for brand feedback
            'POSTED',           // Content is live
            'PAYMENT_PENDING',  // Done, waiting for payment
            'PAID'              // Complete!
        ],
        default: 'CONFIRMED'
    },
    shareToken: {
        type: String,
        unique: true
        // We'll generate this automatically (see pre-save hook below)
    },
    notes: {
        type: String,
        maxlength: [1000, 'Notes cannot exceed 1000 characters']
    }
}, {
    // ─────────────────────────────────────────────────────────────────────────
    // SCHEMA OPTIONS
    // ─────────────────────────────────────────────────────────────────────────
    timestamps: true


})

DealSchema.pre('save', function () {
    // Generate shareToken if it doesn't exist
    if (!this.shareToken) {
        // crypto.randomBytes(16) = Generate 16 random bytes
        // .toString('hex') = Convert to hexadecimal string (32 characters)
        this.shareToken = crypto.randomBytes(16).toString('hex');
        // Result: something like "a3f8b2c4d5e6f7a8b9c0d1e2f3a4b5c6"
    }
    // Mongoose 9+ doesn't use next() - just return
});

const Deal = mongoose.model('Deal', DealSchema);
module.exports = Deal;