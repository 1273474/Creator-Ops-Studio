const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Deal = require('../models/Deal');
const Deliverable = require('../models/Deliverable');

// @route   POST api/deals
// @desc    Create a new deal
// @access  Private
router.post('/', auth, async (req, res) => {
    const { brandName, value, dueDate } = req.body;

    try {
        const newDeal = new Deal({
            userId: req.user.id,
            brandName,
            value,
            dueDate,
        });

        const deal = await newDeal.save();
        res.json(deal);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/deals
// @desc    Get all deals for current user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const deals = await Deal.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: 'deliverables',
                    localField: '_id',
                    foreignField: 'dealId',
                    as: 'deliverables'
                }
            },
            {
                $project: {
                    brandName: 1,
                    value: 1,
                    dueDate: 1,
                    status: 1,
                    shareToken: 1,
                    createdAt: 1,
                    deliverables: {
                        $map: {
                            input: '$deliverables',
                            as: 'd',
                            in: { title: '$$d.title', status: '$$d.status' }
                        }
                    }
                }
            }
        ]);
        res.json(deals);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PATCH api/deals/:id/status
// @desc    Update deal status
// @access  Private
router.patch('/:id/status', auth, async (req, res) => {
    const { status } = req.body;

    // Validate status
    const validStatuses = [
        'CONFIRMED',
        'IN_PRODUCTION',
        'SENT_FOR_APPROVAL',
        'POSTED',
        'PAYMENT_PENDING',
        'PAID'
    ];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ msg: 'Invalid status' });
    }

    try {
        let deal = await Deal.findById(req.params.id);

        if (!deal) {
            return res.status(404).json({ msg: 'Deal not found' });
        }

        // Make sure user owns deal
        if (deal.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        deal = await Deal.findByIdAndUpdate(
            req.params.id,
            { $set: { status } },
            { new: true }
        );

        res.json(deal);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/deals/:id/deliverables
// @desc    Add a deliverable to a deal
// @access  Private
router.post('/:id/deliverables', auth, async (req, res) => {
    const { title, link, version } = req.body;

    try {
        const deal = await Deal.findById(req.params.id);

        if (!deal) {
            return res.status(404).json({ msg: 'Deal not found' });
        }

        // Make sure user owns deal
        if (deal.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const newDeliverable = new Deliverable({
            dealId: req.params.id,
            title,
            link,
            version: version || 1,
        });

        const deliverable = await newDeliverable.save();
        res.json(deliverable);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/deals/:id
// @desc    Get deal by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id);

        if (!deal) {
            return res.status(404).json({ msg: 'Deal not found' });
        }

        // Check ownership
        if (deal.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        res.json(deal);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Deal not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PATCH api/deals/:id
// @desc    Update deal details
// @access  Private
router.patch('/:id', auth, async (req, res) => {
    const { brandName, platform, value, dueDate } = req.body;

    try {
        let deal = await Deal.findById(req.params.id);

        if (!deal) {
            return res.status(404).json({ msg: 'Deal not found' });
        }

        // Check ownership
        if (deal.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        deal = await Deal.findByIdAndUpdate(
            req.params.id,
            { $set: { brandName, platform, value, dueDate } },
            { new: true }
        );

        res.json(deal);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/deals/:id/deliverables
// @desc    Get deliverables for a deal
// @access  Private
router.get('/:id/deliverables', auth, async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id);

        if (!deal) {
            return res.status(404).json({ msg: 'Deal not found' });
        }

        if (deal.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const deliverables = await Deliverable.find({ dealId: req.params.id }).sort({ date: 1 });
        res.json(deliverables);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   DELETE api/deals/:id
// @desc    Delete a deal and its deliverables
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id);

        if (!deal) {
            return res.status(404).json({ msg: 'Deal not found' });
        }

        // Check ownership
        if (deal.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // Delete associated deliverables first
        await Deliverable.deleteMany({ dealId: req.params.id });

        // Delete the deal
        await Deal.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Deal removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
