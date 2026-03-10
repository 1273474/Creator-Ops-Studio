# 🔧 Phase 4: CRUD API - Building Deal & Deliverable Routes

> **Goal**: Build the complete API for creating, reading, updating, and deleting Deals and Deliverables.

---

## 📖 THEORY FIRST: Understanding REST & CRUD

Before writing code, let's understand what we're building and why.

---

## 🎭 Chapter 1: The API Story

### What is an API?

Imagine a restaurant:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           THE RESTAURANT                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   👤 Customer                  👔 Waiter                   👨‍🍳 Kitchen         │
│   (Frontend)                   (API)                       (Database)        │
│                                                                               │
│   "I want a burger"    →    Takes order    →    Makes burger                 │
│                                                                               │
│   Receives burger      ←    Delivers food  ←    Prepares food                │
│                                                                               │
│   ─────────────────────────────────────────────────────────────────────────  │
│                                                                               │
│   The CUSTOMER never enters the KITCHEN directly.                            │
│   The WAITER is the middleman who:                                           │
│     • Takes requests                                                          │
│     • Validates orders (no imaginary dishes!)                                │
│     • Delivers responses                                                      │
│                                                                               │
│   YOUR API IS THE WAITER! 🎯                                                 │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Why Can't Frontend Access Database Directly?

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     WHY NOT DIRECT DATABASE ACCESS?                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   ❌ DANGEROUS: Frontend → Database                                          │
│   ───────────────────────────────────                                         │
│   • Database credentials exposed in browser (F12 = game over)               │
│   • Anyone can delete all data                                               │
│   • No validation - store anything                                           │
│   • No authorization - access any user's data                                │
│                                                                               │
│   ✅ SAFE: Frontend → API → Database                                         │
│   ─────────────────────────────────────                                       │
│   • Credentials hidden on server                                             │
│   • API validates every request                                              │
│   • API checks authorization                                                  │
│   • API controls what operations are allowed                                 │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📬 Chapter 2: Understanding CRUD Operations

### What is CRUD?

CRUD = the 4 fundamental database operations:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           C R U D                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   Letter   Operation    HTTP Method   Example                                │
│   ──────   ─────────    ───────────   ───────                                │
│     C      Create       POST          Create a new deal                      │
│     R      Read         GET           Get all deals / Get one deal           │
│     U      Update       PUT/PATCH     Update deal status                     │
│     D      Delete       DELETE        Delete a deal                          │
│                                                                               │
│   ─────────────────────────────────────────────────────────────────────────  │
│                                                                               │
│   Every app you use does these 4 things:                                     │
│                                                                               │
│   Instagram:                                                                  │
│   • C → Upload a photo                                                        │
│   • R → View your feed                                                        │
│   • U → Edit caption                                                          │
│   • D → Delete a post                                                         │
│                                                                               │
│   CreatorOps:                                                                 │
│   • C → Create a brand deal                                                   │
│   • R → View all your deals                                                   │
│   • U → Update deal status                                                    │
│   • D → Delete a deal                                                         │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🌐 Chapter 3: REST - The Standard Way to Build APIs

### What is REST?

REST = **RE**presentational **S**tate **T**ransfer

It's a set of rules for building APIs. Here's what it means:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        REST PRINCIPLES                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   1. RESOURCES have URLs                                                      │
│   ──────────────────────                                                      │
│   Everything is a "resource" (Deal, User, Deliverable)                       │
│   Each resource has its own URL:                                              │
│                                                                               │
│   /api/deals         → All deals                                              │
│   /api/deals/123     → Deal with ID 123                                       │
│   /api/users         → All users                                              │
│   /api/users/456     → User with ID 456                                       │
│                                                                               │
│   2. HTTP METHODS define the action                                          │
│   ─────────────────────────────────                                           │
│   Same URL, different method = different action:                              │
│                                                                               │
│   GET    /api/deals     → Read all deals                                      │
│   POST   /api/deals     → Create new deal                                     │
│   GET    /api/deals/123 → Read deal 123                                       │
│   PATCH  /api/deals/123 → Update deal 123                                     │
│   DELETE /api/deals/123 → Delete deal 123                                     │
│                                                                               │
│   3. STATELESS - Each request is independent                                 │
│   ──────────────────────────────────────────                                  │
│   Server doesn't remember previous requests.                                  │
│   Each request must contain ALL needed info (like JWT token).                │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### HTTP Methods Explained

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        HTTP METHODS DEEP DIVE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   GET - "Give me data"                                                        │
│   ────────────────────                                                        │
│   • SAFE: Doesn't change anything                                             │
│   • Can be cached                                                             │
│   • Parameters in URL: /deals?status=PENDING                                  │
│   • No body (most browsers)                                                   │
│                                                                               │
│   POST - "Create something new"                                               │
│   ─────────────────────────────                                               │
│   • NOT safe: Creates new data                                                │
│   • Data in request BODY (JSON)                                               │
│   • Returns 201 Created on success                                            │
│                                                                               │
│   PUT - "Replace entirely"                                                    │
│   ────────────────────────                                                    │
│   • Replaces the WHOLE resource                                               │
│   • Must send ALL fields                                                      │
│   • Rarely used in practice                                                   │
│                                                                               │
│   PATCH - "Update partially"                                                  │
│   ──────────────────────────                                                  │
│   • Updates ONLY fields you send                                              │
│   • More practical than PUT                                                   │
│   • Example: Only update status, not entire deal                              │
│                                                                               │
│   DELETE - "Remove it"                                                        │
│   ────────────────────                                                        │
│   • Removes the resource                                                      │
│   • Usually returns 204 No Content                                            │
│   • Or 200 with deleted resource                                              │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### PUT vs PATCH - The Key Difference

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PUT vs PATCH                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   Current Deal in Database:                                                   │
│   {                                                                           │
│       brandName: "Nike",                                                      │
│       value: 5000,                                                            │
│       status: "PENDING"                                                       │
│   }                                                                           │
│                                                                               │
│   ─────────────────────────────────────────────────────────────────────────  │
│                                                                               │
│   PUT /api/deals/123                                                          │
│   Body: { status: "APPROVED" }                                                │
│                                                                               │
│   Result: { status: "APPROVED" } ← brandName and value GONE!                 │
│   (Replaced entire object with what you sent)                                │
│                                                                               │
│   ─────────────────────────────────────────────────────────────────────────  │
│                                                                               │
│   PATCH /api/deals/123                                                        │
│   Body: { status: "APPROVED" }                                                │
│                                                                               │
│   Result: {                                                                   │
│       brandName: "Nike",      ← Still here!                                  │
│       value: 5000,            ← Still here!                                  │
│       status: "APPROVED"      ← Updated!                                     │
│   }                                                                           │
│                                                                               │
│   ─────────────────────────────────────────────────────────────────────────  │
│                                                                               │
│   👉 WE USE PATCH for updates (more practical)                               │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛤️ Chapter 4: Designing Our API Routes

### Route Naming Conventions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     ROUTE NAMING BEST PRACTICES                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   ✅ DO:                                                                      │
│   • Use plural nouns: /deals, /users, /deliverables                          │
│   • Use lowercase: /api/deals not /api/Deals                                 │
│   • Use hyphens for multi-word: /brand-deals not /brandDeals                │
│   • Nest related resources: /deals/:dealId/deliverables                      │
│                                                                               │
│   ❌ DON'T:                                                                   │
│   • Use verbs: /createDeal, /getDeal, /deleteDeal                            │
│   • Use actions in URL: /deals/delete/123                                    │
│   • Mix cases: /API/Deals                                                     │
│                                                                               │
│   ─────────────────────────────────────────────────────────────────────────  │
│                                                                               │
│   WHY?                                                                        │
│   The HTTP METHOD tells you the action.                                       │
│   The URL tells you the resource.                                             │
│                                                                               │
│   POST /createDeal  ← Redundant! POST already means create.                  │
│   POST /deals       ← Clean! POST to deals = create a deal.                  │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Our Complete API Design

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CREATOROPS API ROUTES                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   🔐 AUTH ROUTES (Phase 3 - Done!)                                           │
│   ─────────────────────────────────                                           │
│   POST   /api/auth/register   → Create account                               │
│   POST   /api/auth/login      → Get token                                    │
│   GET    /api/auth/me         → Get current user                             │
│                                                                               │
│   💼 DEAL ROUTES (Phase 4)                                                   │
│   ────────────────────────                                                    │
│   POST   /api/deals           → Create new deal          🔒 Auth Required    │
│   GET    /api/deals           → Get all MY deals         🔒 Auth Required    │
│   GET    /api/deals/:id       → Get one deal             🔒 Auth Required    │
│   PATCH  /api/deals/:id       → Update deal              🔒 Auth Required    │
│   DELETE /api/deals/:id       → Delete deal              🔒 Auth Required    │
│                                                                               │
│   📦 DELIVERABLE ROUTES (Phase 4)                                            │
│   ───────────────────────────────                                             │
│   POST   /api/deals/:dealId/deliverables   → Create deliverable             │
│   GET    /api/deals/:dealId/deliverables   → Get all deliverables           │
│   GET    /api/deliverables/:id             → Get one deliverable            │
│   PATCH  /api/deliverables/:id             → Update deliverable             │
│   DELETE /api/deliverables/:id             → Delete deliverable             │
│                                                                               │
│   🔗 SHARE ROUTES (Public - No Auth)                                         │
│   ──────────────────────────────────                                          │
│   GET    /api/share/:shareToken   → Brand views deal (no login)              │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔒 Chapter 5: Authorization - Who Can Access What?

### Authentication vs Authorization (Again!)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   AuthN vs AuthZ in CRUD                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   AUTHENTICATION (Phase 3 ✅)                                                 │
│   "WHO are you?"                                                              │
│   • Verify JWT token                                                          │
│   • Get user ID from token                                                    │
│   • Attach to req.user                                                        │
│                                                                               │
│   ─────────────────────────────────────────────────────────────────────────  │
│                                                                               │
│   AUTHORIZATION (Phase 4 - Now!)                                             │
│   "Are you ALLOWED to do this?"                                               │
│                                                                               │
│   Scenario:                                                                   │
│   • Ravi creates Deal #123                                                    │
│   • Priya tries: DELETE /api/deals/123                                        │
│                                                                               │
│   ❌ WRONG: Priya can delete Ravi's deal!                                    │
│   ✅ CORRECT: Check if deal.userId === req.user.id                           │
│                                                                               │
│   ─────────────────────────────────────────────────────────────────────────  │
│                                                                               │
│   RULE: Users can only CRUD their OWN data!                                  │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Chapter 6: HTTP Status Codes

Every response needs an appropriate status code:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       HTTP STATUS CODES                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   2XX SUCCESS                                                                 │
│   ───────────                                                                 │
│   200 OK           → General success (GET, PATCH)                            │
│   201 Created      → Resource created (POST)                                 │
│   204 No Content   → Success but nothing to return (DELETE)                  │
│                                                                               │
│   4XX CLIENT ERROR                                                            │
│   ────────────────                                                            │
│   400 Bad Request  → Invalid data sent                                       │
│   401 Unauthorized → Not logged in / Invalid token                           │
│   403 Forbidden    → Logged in but not allowed                               │
│   404 Not Found    → Resource doesn't exist                                  │
│                                                                               │
│   5XX SERVER ERROR                                                            │
│   ────────────────                                                            │
│   500 Server Error → Something crashed                                        │
│                                                                               │
│   ─────────────────────────────────────────────────────────────────────────  │
│                                                                               │
│   IMPORTANT DISTINCTION:                                                      │
│                                                                               │
│   401 → "I don't know who you are" (no token / bad token)                    │
│   403 → "I know who you are, but you can't do this" (not your deal)         │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🧠 Chapter 7: Interview Questions - REST & CRUD

**Q: "What is REST?"**
> REST is an architectural style for building APIs. It uses HTTP methods (GET, POST, PATCH, DELETE) to perform CRUD operations on resources identified by URLs. Key principles include statelessness (each request is independent) and uniform interface (consistent URL patterns).

**Q: "What's the difference between PUT and PATCH?"**
> PUT replaces the entire resource - you must send all fields. PATCH updates only the fields you send. PATCH is more practical for partial updates like changing just the status of a deal.

**Q: "What's the difference between 401 and 403?"**
> 401 (Unauthorized) means "I don't know who you are" - no token or invalid token. 403 (Forbidden) means "I know who you are, but you're not allowed to do this" - like trying to access someone else's data.

**Q: "Why use /deals instead of /getDeal or /createDeal?"**
> In REST, the URL identifies the resource and the HTTP method defines the action. GET /deals = read deals, POST /deals = create deal. This is cleaner and more consistent than putting verbs in URLs.

**Q: "What is authorization in the context of CRUD?"**
> Authorization ensures users can only access their own data. After authentication verifies WHO the user is, authorization checks if they're ALLOWED to perform the specific action (like deleting a deal they own).

---

## 🔨 BUILD TIME: Let's Write the Code!

Now YOU will write the code. I'll explain everything, you type it.

---

## Step 4.1: Create Deals Routes

Create a new file: `routes/deals.js`

```javascript
// ═══════════════════════════════════════════════════════════════════════════════
// 📁 routes/deals.js
// ═══════════════════════════════════════════════════════════════════════════════
// This file handles all CRUD operations for Deals.
// All routes require authentication (JWT token).
// ═══════════════════════════════════════════════════════════════════════════════

const express = require('express');
const Deal = require('../models/Deal');
const auth = require('../middlewares/auth');

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// CREATE - POST /api/deals
// ─────────────────────────────────────────────────────────────────────────────
// Creates a new deal for the logged-in user
// The userId is automatically set from the JWT token (req.user.id)
// 
// Request Body: { brandName, brandEmail, value, dueDate, notes }
// Response: 201 Created with the new deal object

router.post('/', auth, async (req, res) => {
    try {
        // Extract deal data from request body
        const { brandName, brandEmail, value, dueDate, notes } = req.body;

        // Basic validation
        if (!brandName) {
            return res.status(400).json({
                message: 'Brand name is required'
            });
        }

        // Create new deal with userId from the authenticated user
        const deal = new Deal({
            userId: req.user.id,  // From JWT token via auth middleware
            brandName,
            brandEmail,
            value,
            dueDate,
            notes
            // shareToken is auto-generated by pre-save hook
            // status defaults to 'PENDING'
        });

        // Save to database
        await deal.save();

        // Return 201 Created with the new deal
        res.status(201).json(deal);

    } catch (err) {
        console.error('Create deal error:', err.message);
        res.status(500).json({
            message: 'Server error while creating deal'
        });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// READ ALL - GET /api/deals
// ─────────────────────────────────────────────────────────────────────────────
// Gets all deals for the logged-in user
// Only returns deals where deal.userId matches the authenticated user
// 
// Query params: ?status=PENDING (optional filter)
// Response: 200 OK with array of deals

router.get('/', auth, async (req, res) => {
    try {
        // Build query - always filter by userId for security
        const query = { userId: req.user.id };

        // Optional: filter by status if provided in query string
        // Example: GET /api/deals?status=PENDING
        if (req.query.status) {
            query.status = req.query.status;
        }

        // Find all deals matching query, sorted by newest first
        const deals = await Deal.find(query).sort({ createdAt: -1 });

        res.json(deals);

    } catch (err) {
        console.error('Get deals error:', err.message);
        res.status(500).json({
            message: 'Server error while fetching deals'
        });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// READ ONE - GET /api/deals/:id
// ─────────────────────────────────────────────────────────────────────────────
// Gets a single deal by ID
// Verifies the deal belongs to the authenticated user (authorization)
// 
// URL param: :id = MongoDB ObjectId
// Response: 200 OK with deal object, or 404/403

router.get('/:id', auth, async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id);

        // Check if deal exists
        if (!deal) {
            return res.status(404).json({
                message: 'Deal not found'
            });
        }

        // AUTHORIZATION: Check if deal belongs to this user
        if (deal.userId.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'Not authorized to view this deal'
            });
        }

        res.json(deal);

    } catch (err) {
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

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE - PATCH /api/deals/:id
// ─────────────────────────────────────────────────────────────────────────────
// Updates a deal (partial update - only fields provided)
// Verifies ownership before allowing update
// 
// URL param: :id = MongoDB ObjectId
// Request Body: { brandName?, value?, status?, notes?, etc. }
// Response: 200 OK with updated deal

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

// ─────────────────────────────────────────────────────────────────────────────
// DELETE - DELETE /api/deals/:id
// ─────────────────────────────────────────────────────────────────────────────
// Deletes a deal
// Verifies ownership before allowing deletion
// 
// URL param: :id = MongoDB ObjectId
// Response: 200 OK with deleted deal, or 404/403

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
```

---

## Step 4.2: Create Deliverables Routes

Create a new file: `routes/deliverables.js`

```javascript
// ═══════════════════════════════════════════════════════════════════════════════
// 📁 routes/deliverables.js
// ═══════════════════════════════════════════════════════════════════════════════
// Handles CRUD for Deliverables (content within a deal)
// Deliverables are nested under Deals for creation
// ═══════════════════════════════════════════════════════════════════════════════

const express = require('express');
const Deliverable = require('../models/Deliverable');
const Deal = require('../models/Deal');
const auth = require('../middlewares/auth');

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// CREATE - POST /api/deals/:dealId/deliverables
// ─────────────────────────────────────────────────────────────────────────────
// Creates a deliverable under a specific deal
// First verifies the deal exists and belongs to the user

router.post('/deals/:dealId/deliverables', auth, async (req, res) => {
    try {
        // First, verify the deal exists and belongs to user
        const deal = await Deal.findById(req.params.dealId);

        if (!deal) {
            return res.status(404).json({
                message: 'Deal not found'
            });
        }

        // AUTHORIZATION: Check deal ownership
        if (deal.userId.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'Not authorized to add deliverables to this deal'
            });
        }

        // Extract deliverable data
        const { title, link } = req.body;

        if (!title) {
            return res.status(400).json({
                message: 'Title is required'
            });
        }

        // Create the deliverable
        const deliverable = new Deliverable({
            dealId: req.params.dealId,
            title,
            link
            // version defaults to 1
            // status defaults to 'PENDING'
        });

        await deliverable.save();

        res.status(201).json(deliverable);

    } catch (err) {
        console.error('Create deliverable error:', err.message);
        res.status(500).json({
            message: 'Server error while creating deliverable'
        });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// READ ALL - GET /api/deals/:dealId/deliverables
// ─────────────────────────────────────────────────────────────────────────────
// Gets all deliverables for a specific deal

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

// ─────────────────────────────────────────────────────────────────────────────
// READ ONE - GET /api/deliverables/:id
// ─────────────────────────────────────────────────────────────────────────────
// Gets a single deliverable by its ID

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

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE - PATCH /api/deliverables/:id
// ─────────────────────────────────────────────────────────────────────────────
// Updates a deliverable

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

// ─────────────────────────────────────────────────────────────────────────────
// DELETE - DELETE /api/deliverables/:id
// ─────────────────────────────────────────────────────────────────────────────
// Deletes a deliverable

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

// ─────────────────────────────────────────────────────────────────────────────
// ADD COMMENT - POST /api/deliverables/:id/comments
// ─────────────────────────────────────────────────────────────────────────────
// Adds a comment to a deliverable

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
```

---

## Step 4.3: Connect Routes to Server

Update `server.js` to include the new routes:

```javascript
// Add these imports at the top (after authRoutes import)
const dealRoutes = require('./routes/deals');
const deliverableRoutes = require('./routes/deliverables');

// ... existing code ...

// Add these BEFORE the server.listen() call
// (After the auth routes)

// Deals routes - /api/deals
app.use('/api/deals', dealRoutes);

// Deliverables routes
// Some routes are nested under /api (like /api/deals/:id/deliverables)
// Some are direct (like /api/deliverables/:id)
app.use('/api', deliverableRoutes);
app.use('/api/deliverables', deliverableRoutes);
```

---

## Step 4.4: Test Your CRUD API

### Test Create Deal:
```bash
# First, get a token by logging in
TOKEN=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"finaltest@example.com","password":"password123"}' | jq -r '.token')

# Create a deal
curl -X POST http://localhost:5001/api/deals \
  -H "Content-Type: application/json" \
  -H "x-auth-token: $TOKEN" \
  -d '{"brandName":"Nike","value":5000,"notes":"Instagram post"}'
```

### Test Get All Deals:
```bash
curl http://localhost:5001/api/deals \
  -H "x-auth-token: $TOKEN"
```

### Test Update Deal:
```bash
curl -X PATCH http://localhost:5001/api/deals/YOUR_DEAL_ID \
  -H "Content-Type: application/json" \
  -H "x-auth-token: $TOKEN" \
  -d '{"status":"APPROVED"}'
```

### Test Delete Deal:
```bash
curl -X DELETE http://localhost:5001/api/deals/YOUR_DEAL_ID \
  -H "x-auth-token: $TOKEN"
```

---

## ✅ VERIFICATION CHECKPOINT

Before moving on, verify:

- [ ] Can create a deal (POST /api/deals)
- [ ] Can get all deals for logged-in user (GET /api/deals)
- [ ] Can get a single deal (GET /api/deals/:id)
- [ ] Can update a deal (PATCH /api/deals/:id)
- [ ] Can delete a deal (DELETE /api/deals/:id)
- [ ] Cannot access another user's deal (403 Forbidden)
- [ ] Deliverables CRUD works similarly

---

## 📝 REVISION NOTES

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                     PHASE 4 REVISION NOTES                                    ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                                ║
║  REST API PRINCIPLES:                                                         ║
║  • Resources identified by URLs (/deals, /users)                              ║
║  • HTTP methods define actions (GET=read, POST=create, PATCH=update)          ║
║  • Stateless - each request independent                                       ║
║                                                                                ║
║  CRUD OPERATIONS:                                                             ║
║  • C = Create = POST = 201 Created                                            ║
║  • R = Read = GET = 200 OK                                                    ║
║  • U = Update = PATCH = 200 OK (partial update)                               ║
║  • D = Delete = DELETE = 200 OK                                               ║
║                                                                                ║
║  PUT vs PATCH:                                                                ║
║  • PUT = replace entire resource (send all fields)                            ║
║  • PATCH = update partial resource (send only changed fields)                 ║
║                                                                                ║
║  AUTHORIZATION PATTERN:                                                       ║
║  1. Find the resource                                                         ║
║  2. Check if it exists (404 if not)                                           ║
║  3. Check ownership: resource.userId === req.user.id (403 if not)             ║
║  4. Perform the operation                                                     ║
║                                                                                ║
║  STATUS CODES:                                                                ║
║  • 200 = OK (general success)                                                 ║
║  • 201 = Created (POST success)                                               ║
║  • 400 = Bad Request (invalid data)                                           ║
║  • 401 = Unauthorized (no/invalid token)                                      ║
║  • 403 = Forbidden (not your resource)                                        ║
║  • 404 = Not Found                                                            ║
║  • 500 = Server Error                                                         ║
║                                                                                ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

---

**Next: Phase 5 - Frontend Setup with React + Vite** 🚀
