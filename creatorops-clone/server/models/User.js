const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    name: {
        type: String,           // Data type: text
        required: [true, 'Name is required'],  // Must be provided
        //          └── Custom error message
        trim: true,             // Remove whitespace from start/end
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,           // No two users can have same email
        //                         Creates a unique INDEX in MongoDB
        lowercase: true,        // Convert to lowercase before saving
        //                         "Ravi@Email.com" → "ravi@email.com"
        trim: true,
        match: [
            /^\S+@\S+\.\S+$/,   // Regex pattern for email
            'Please enter a valid email'
        ]
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
        type: String,
        enum: ['CREATOR', 'ADMIN'],  // Only these values allowed
        default: 'CREATOR'           // If not specified, use this
    },
    createdAt: {
        type: Date,
        default: Date.now    // Function! Called when document is created
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// PRE-SAVE HOOK: Hash password before saving
// ─────────────────────────────────────────────────────────────────────────────
// MUST be BEFORE mongoose.model() call!
// NOTE: With async functions, DON'T use next() - Mongoose handles it via promises!

userSchema.pre('save', async function () {
    // Skip if password wasn't modified
    if (!this.isModified('password')) {
        return;
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


// ─────────────────────────────────────────────────────────────────────────────
// INSTANCE METHOD: Compare passwords
// ─────────────────────────────────────────────────────────────────────────────
// MUST be BEFORE mongoose.model() call!

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// ─────────────────────────────────────────────────────────────────────────────
// CREATE AND EXPORT MODEL
// ─────────────────────────────────────────────────────────────────────────────
// mongoose.model() MUST come AFTER all schema modifications!

const User = mongoose.model('User', userSchema);
module.exports = User;
