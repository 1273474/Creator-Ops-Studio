const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middlewares/auth');

const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }

    );
};

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Please provide name, email, and password'
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists with this email'
            });
        }
        const user = new User({
            name,
            email,
            password  // Will be hashed by pre-save hook!
        });

        await user.save();

        const token = generateToken(user._id);
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    }
    catch (err) {
        console.error('Register error:', err.message);
        console.error('Stack:', err.stack);
        res.status(500).json({
            message: 'Server error during registration',
            error: err.message
        });

    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: 'Please provide email and password'
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            // SECURITY: Don't reveal whether email exists or not
            // Same message for "email not found" and "wrong password"
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        const token = generateToken(user._id);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    }
    catch (err) {
        console.error('Login error:', err);
        res.status(500).json({
            message: 'Server error during login'
        });

    }
});

router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.json(user);

    }
    catch (err) {
        console.error('Get user error:', err);
        res.status(500).json({
            message: 'Server error'
        });
    }



})


module.exports = router;
