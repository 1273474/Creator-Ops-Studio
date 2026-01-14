const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Deliverable = require('../models/Deliverable');
const Deal = require('../models/Deal');

// @route   PATCH api/deliverables/:id
// @desc    Update deliverable (link, title, status, version)
// @access  Private
router.patch('/:id', auth, async (req, res) => {
    const { title, link, status, version } = req.body;

    try {
        let deliverable = await Deliverable.findById(req.params.id);

        if (!deliverable) {
            return res.status(404).json({ msg: 'Deliverable not found' });
        }

        // Check ownership via Deal
        const deal = await Deal.findById(deliverable.dealId);
        if (!deal || deal.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // Build update object
        const updateFields = {};
        if (title) updateFields.title = title;
        if (link) updateFields.link = link;
        if (status) updateFields.status = status;
        if (version) updateFields.version = version;

        const updatedDeliverable = await Deliverable.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true }
        );

        // Auto-update Deal status if sending to brand
        if (status === 'SENT') {
            await Deal.findByIdAndUpdate(deal._id, { status: 'SENT_FOR_APPROVAL' });
        }

        res.json(updatedDeliverable);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/deliverables/:id
// @desc    Delete deliverable
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const deliverable = await Deliverable.findById(req.params.id);

        if (!deliverable) {
            return res.status(404).json({ msg: 'Deliverable not found' });
        }

        const deal = await Deal.findById(deliverable.dealId);
        if (!deal || deal.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Deliverable.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Deliverable removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/deliverables/:id/comments
// @desc    Add a comment to a deliverable (Creator)
// @access  Private
router.post('/:id/comments', auth, async (req, res) => {
    const { text } = req.body;

    try {
        const deliverable = await Deliverable.findById(req.params.id);

        if (!deliverable) {
            return res.status(404).json({ msg: 'Deliverable not found' });
        }

        // Check ownership
        const deal = await Deal.findById(deliverable.dealId);
        if (!deal || deal.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const newComment = {
            text,
            authorRole: 'CREATOR',
            createdAt: new Date()
        };

        deliverable.comments.unshift(newComment);
        await deliverable.save();

        res.json(deliverable);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
