const mongoose = require('mongoose')

// EMBEDDING vs REFERENCING:
// ─────────────────────────
// Embed when:
// - Data is always accessed together
// - Data doesn't grow unbounded
// - Data belongs to parent (comments belong to deliverable)
//
// Reference when:
// - Data is accessed independently
// - Data could be shared (users across deals)
// - Data could grow very large
//

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    author: {
        type: String,        // Could be "Brand" or user name
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const DeliverableSchema = new mongoose.Schema({
     // ─────────────────────────────────────────────────────────────────────────
    // dealId: Which deal does this deliverable belong to?
    // ─────────────────────────────────────────────────────────────────────────
    dealId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Deal',           // Reference to Deal collection
        required: [true, 'Deal ID is required']
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
        // Examples: "Instagram Reel", "YouTube Video", "Story #1"
    },
    link: {
        type: String,
        trim: true
        // Could be Google Drive link, Instagram URL, etc.
    },
    version: {
        type: Number,
        default: 1,
        min: 1
    },
    status: {
        type: String,
        enum: [
            'PENDING',          // Not yet submitted
            'SENT',             // Sent to brand for review
            'APPROVED',         // Brand approved ✓
            'CHANGES_REQUESTED' // Brand wants changes
        ],
        default: 'PENDING'
    },
    comments: [CommentSchema]
    }, {
    timestamps: true    // createdAt, updatedAt
}) 

const Deliverable = mongoose.model('Deliverable', DeliverableSchema);
module.exports = Deliverable;