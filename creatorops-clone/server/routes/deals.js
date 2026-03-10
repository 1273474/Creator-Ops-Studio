const express = require('express');
const Deal = require('../models/Deal');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
    try {
        const { brandName, brandEmail, value, dueDate, notes } = req.body;
        if (!brandName) {
            return res.status(400).json({
                message: 'Brand name is required'
            });
        }

        const deal = new Deal({
            userId: req.user.id,  // From JWT token via auth middleware
            brandName,
            brandEmail,
            value,
            dueDate,
            notes
        });

        await deal.save();

        res.status(201).json(deal);

    } catch (err) {
        console.error('Create deal error:', err.message);
        console.error('Stack:', err.stack);
        res.status(500).json({
            message: 'Server error while creating deal',
            error: err.message
        });

    }

})

router.get('/', auth, async (req, res) => {
    try {
        const query = { userId: req.user.id };
        const deals = await Deal.find(query).sort({ createdAt: -1 });
        res.json(deals);


    } catch (err) {
        console.error('Get deals error:', err.message);
        res.status(500).json({
            message: 'Server error while fetching deals'
        });

    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id);
        // Check if deal exists
        if (!deal) {
            return res.status(404).json({
                message: 'Deal not found'
            });
        }
        //Authorization

        if (deal.userId.toString() != req.user.id) {
            return res.status(403).json({
                message: 'Not authorized to view this deal'
            });
        }

        res.json(deal);


    }
    catch (err) {
        console.error('Get deal error:', err.message);

        // Handle invalid MongoDB ObjectId format
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                message: 'Deal not found'
            });
        }

        res.status(500).json({
            message: 'Server error while fetching deal'
        });

    }
});

router.patch('/:id', auth, async (req, res) => {
    try {
        // Find the deal first
        let deal = await Deal.findById(req.params.id);

        // Check if deal exists
        if (!deal) {
            return res.status(404).json({
                message: 'Deal not found'
            });
        }

        // AUTHORIZATION: Check ownership
        if (deal.userId.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'Not authorized to update this deal'
            });
        }

        // Fields that CAN be updated
        const allowedUpdates = ['brandName', 'brandEmail', 'value', 'dueDate', 'status', 'notes'];

        // Build update object with only allowed fields
        const updates = {};
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        // Perform update
        // { new: true } returns the updated document instead of the old one
        deal = await Deal.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        res.json(deal);

    } catch (err) {
        console.error('Update deal error:', err.message);

        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                message: 'Deal not found'
            });
        }

        res.status(500).json({
            message: 'Server error while updating deal'
        });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id);

        // Check if deal exists
        if (!deal) {
            return res.status(404).json({
                message: 'Deal not found'
            });
        }

        // AUTHORIZATION: Check ownership
        if (deal.userId.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'Not authorized to delete this deal'
            });
        }

        // Delete the deal
        await Deal.findByIdAndDelete(req.params.id);

        res.json({
            message: 'Deal deleted successfully',
            deal  // Return the deleted deal for confirmation
        });

    } catch (err) {
        console.error('Delete deal error:', err.message);

        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                message: 'Deal not found'
            });
        }

        res.status(500).json({
            message: 'Server error while deleting deal'
        });
    }
});

module.exports = router;