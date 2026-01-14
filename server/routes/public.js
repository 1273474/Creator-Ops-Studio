const express = require('express');
const router = express.Router();
const Deal = require('../models/Deal');
const Deliverable = require('../models/Deliverable');

// @route   GET api/public/deals/:token
// @desc    Get deal by shareToken (Public)
// @access  Public
router.get('/deals/:token', async (req, res) => {
    try {
        const deal = await Deal.findOne({ shareToken: req.params.token });

        if (!deal) {
            return res.status(404).json({ msg: 'Deal not found or invalid link' });
        }

        const deliverables = await Deliverable.find({ dealId: deal._id }).sort({ date: 1 });

        res.json({ deal, deliverables });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PATCH api/public/deliverables/:id/status
// @desc    Update deliverable status (Public - Brand action)
// @access  Public
router.patch('/deliverables/:id/status', async (req, res) => {
    const { status, comment } = req.body;

    // Validate status
    const validStatuses = ['APPROVED', 'CHANGES_REQUESTED'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ msg: 'Invalid status for brand action' });
    }

    try {
        const updateObj = {
            $set: { status }
        };

        // If comment provided, add it
        if (comment) {
            const newComment = {
                text: comment,
                authorRole: 'BRAND',
                createdAt: new Date()
            };
            updateObj.$push = { comments: { $each: [newComment], $position: 0 } };
        }

        const deliverable = await Deliverable.findByIdAndUpdate(
            req.params.id,
            updateObj,
            { new: true }
        );

        if (!deliverable) {
            return res.status(404).json({ msg: 'Deliverable not found' });
        }

        res.json(deliverable);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
