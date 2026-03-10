const express = require('express');
const Deliverable = require('../models/Deliverable');
const Deal = require('../models/Deal');
const auth = require('../middlewares/auth');


const router = express.Router();

router.post('/deals/:dealId/deliverables', auth, async (req,res) => {
    try{
        const deal = await Deal.findById(req.params.dealId);
        if (!deal) {
            return res.status(404).json({
                message: 'Deal not found'
            });
        }

        if(deal.userId.toString() !== req.user.id){
            return res.status(403).json({
                message: 'Not authorized to add deliverables to this deal'
            });

        }

        const { title, link } = req.body;

        if (!title) {
            return res.status(400).json({
                message: 'Title is required'
            });
        }

        const deliverable = new Deliverable({
            dealId: req.params.dealId,
            title,
            link
            // version defaults to 1
            // status defaults to 'PENDING'
        });

        await deliverable.save();

        res.status(201).json(deliverable);

    }
    catch(err){
        console.error('Create deliverable error:', err.message);
        res.status(500).json({
            message: 'Server error while creating deliverable'
        });

    }
});

router.get('/deals/:dealId/deliverables', auth, async (req, res) => {
    try {
        // Verify deal exists and belongs to user
        const deal = await Deal.findById(req.params.dealId);

        if (!deal) {
            return res.status(404).json({
                message: 'Deal not found'
            });
        }

        if (deal.userId.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'Not authorized to view deliverables for this deal'
            });
        }

        // Get all deliverables for this deal
        const deliverables = await Deliverable.find({ 
            dealId: req.params.dealId 
        }).sort({ createdAt: -1 });

        res.json(deliverables);

    } catch (err) {
        console.error('Get deliverables error:', err.message);
        res.status(500).json({
            message: 'Server error while fetching deliverables'
        });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const deliverable = await Deliverable.findById(req.params.id);

        if (!deliverable) {
            return res.status(404).json({
                message: 'Deliverable not found'
            });
        }

        // Get the parent deal to check ownership
        const deal = await Deal.findById(deliverable.dealId);

        if (deal.userId.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'Not authorized to view this deliverable'
            });
        }

        res.json(deliverable);

    } catch (err) {
        console.error('Get deliverable error:', err.message);
        res.status(500).json({
            message: 'Server error while fetching deliverable'
        });
    }
});

router.patch('/:id', auth, async (req, res) => {
    try {
        let deliverable = await Deliverable.findById(req.params.id);

        if (!deliverable) {
            return res.status(404).json({
                message: 'Deliverable not found'
            });
        }

        // Check ownership via parent deal
        const deal = await Deal.findById(deliverable.dealId);

        if (deal.userId.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'Not authorized to update this deliverable'
            });
        }

        // Allowed fields to update
        const allowedUpdates = ['title', 'link', 'status', 'version'];
        const updates = {};
        
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        deliverable = await Deliverable.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        res.json(deliverable);

    } catch (err) {
        console.error('Update deliverable error:', err.message);
        res.status(500).json({
            message: 'Server error while updating deliverable'
        });
    }
});


router.delete('/:id', auth, async (req, res) => {
    try {
        const deliverable = await Deliverable.findById(req.params.id);

        if (!deliverable) {
            return res.status(404).json({
                message: 'Deliverable not found'
            });
        }

        // Check ownership via parent deal
        const deal = await Deal.findById(deliverable.dealId);

        if (deal.userId.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'Not authorized to delete this deliverable'
            });
        }

        await Deliverable.findByIdAndDelete(req.params.id);

        res.json({
            message: 'Deliverable deleted successfully',
            deliverable
        });

    } catch (err) {
        console.error('Delete deliverable error:', err.message);
        res.status(500).json({
            message: 'Server error while deleting deliverable'
        });
    }
});


router.post('/:id/comments', auth, async (req, res) => {
    try {
        const deliverable = await Deliverable.findById(req.params.id);

        if (!deliverable) {
            return res.status(404).json({
                message: 'Deliverable not found'
            });
        }

        // Get deal to check ownership
        const deal = await Deal.findById(deliverable.dealId);

        if (deal.userId.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'Not authorized to comment on this deliverable'
            });
        }

        const { text, author } = req.body;

        if (!text || !author) {
            return res.status(400).json({
                message: 'Text and author are required'
            });
        }

        // Add comment to the comments array (embedded subdocument)
        deliverable.comments.push({ text, author });
        await deliverable.save();

        res.status(201).json(deliverable);

    } catch (err) {
        console.error('Add comment error:', err.message);
        res.status(500).json({
            message: 'Server error while adding comment'
        });
    }
});

module.exports = router;