// ═══════════════════════════════════════════════════════════════════════════════
// 🏗️ CreatorOps Clone - server.js
// ═══════════════════════════════════════════════════════════════════════════════
//
// This is the ENTRY POINT of your backend.
// When you run "node server.js", this file executes first.
//
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1: IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
// 
// require() = Node.js way to import packages/modules
// Similar to "import" in ES6, but CommonJS style (Node.js default)
//
// Why different from React's "import"?
// - React uses ES Modules (import/export)
// - Node.js traditionally uses CommonJS (require/module.exports)
// - Both are ways to share code between files
//

// Express: The web framework that handles HTTP requests
// Think of it as the "waiter" in our restaurant analogy
const express = require('express');

// Mongoose: ODM (Object Document Mapper) for MongoDB
// It translates between JavaScript objects and MongoDB documents
// We'll use this in Phase 2
const mongoose = require('mongoose');

// CORS: Cross-Origin Resource Sharing
// Allows your React app (localhost:5173) to call this API (localhost:5001)
// Without this, browsers block the request for security
const cors = require('cors');

// Helmet: Security middleware
// Automatically sets HTTP headers to protect against common attacks
// Like putting a helmet on your server 🪖
const helmet = require('helmet');

// dotenv: Loads environment variables from .env file
// Keeps secrets (passwords, API keys) out of your code
// NEVER commit .env to GitHub!
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth');
const dealRoutes = require('./routes/deals');
const deliverableRoutes = require('./routes/deliverables');

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2: CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

// Load environment variables from .env file into process.env
// After this line, you can access process.env.MONGO_URI, process.env.PORT, etc.
dotenv.config();

// Create the Express application
// This 'app' object is your entire server
// All routes and middleware attach to this
const app = express();

// Get port from environment variable, or default to 5001
// process.env = object containing all environment variables
// || = "if undefined/null, use the value on the right"
const PORT = process.env.PORT || 5001;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3: MIDDLEWARE
// ─────────────────────────────────────────────────────────────────────────────
//
// Middleware = Functions that run BETWEEN receiving a request and sending response
// 
// Think of it like airport security:
//   Passenger → [Security Check] → [Passport Check] → [Gate] → Plane
//   Request   → [express.json()] → [cors()]         → [Route] → Response
//
// app.use() = "Apply this middleware to ALL requests"
// ORDER MATTERS! They run in the order you write them.
//

// express.json() - Parse JSON bodies
// When frontend sends: { "brandName": "Nike" }
// This middleware makes it available as: req.body.brandName
// WITHOUT this, req.body is undefined!
app.use(express.json());

// cors() - Allow cross-origin requests
// Frontend (5173/Vercel) → Backend (5001/Render) = different "origins"
app.use(cors({
    origin: [
        'http://localhost:5173', // Local frontend
        'https://creator-ops-studio.vercel.app' // Vercel production frontend
    ],
    credentials: true
}));

// helmet() - Add security headers
// Protects against:
// - XSS (Cross-Site Scripting)
// - Clickjacking
// - And other common attacks
// One line, 15+ security headers added automatically
app.use(helmet());

app.use('/api/deals', dealRoutes);
app.use('/api', deliverableRoutes);
app.use('/api/deliverables', deliverableRoutes);

// Custom logging middleware
// This is a middleware WE wrote, not from a package
// (req, res, next) = the three parameters every middleware gets
//   req = request object (what client sent)
//   res = response object (what we'll send back)
//   next = function to call the next middleware
app.use((req, res, next) => {
    // Log every request with timestamp, method, and URL
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

    // CRITICAL: Must call next() to continue to the next middleware/route
    // If you forget next(), the request hangs forever!
    next();
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4: DATABASE CONNECTION (Will be replaced in Phase 2)
// ─────────────────────────────────────────────────────────────────────────────
//
// For now, we'll skip database connection
// We'll add this in Phase 2 when we learn MongoDB
//

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Connected Successfully!')
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    })

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5: ROUTES
// ─────────────────────────────────────────────────────────────────────────────
//
// Routes = URL patterns that trigger specific functions
//
// Anatomy of a route:
//   app.METHOD(PATH, HANDLER)
//   │    │       │      │
//   │    │       │      └── Function to run when matched
//   │    │       └────────── URL path to match
//   │    └─────────────────── HTTP method (get, post, patch, delete)
//   └──────────────────────── Express app object
//

// Root route - just to test the server is running
// app.get() = handle GET requests
// '/' = the root URL (localhost:5001/)
// (req, res) = request and response objects
app.get('/', (req, res) => {
    // res.json() = send JSON response
    // Also automatically sets Content-Type: application/json header
    res.json({
        message: 'Welcome to CreatorOps Clone API! 🎉',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            api: '/api (coming soon)'
        }
    });
});

// Health check endpoint
// Common pattern: a simple endpoint to verify server is running
// Used by:
// - Deployment platforms to check if app is alive
// - Load balancers to check server health
// - Your own debugging
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

// Example route to demonstrate route parameters
// :name is a "route parameter" - a dynamic part of the URL
// When someone visits /hello/John, name = "John"
app.get('/hello/:name', (req, res) => {
    // req.params = object containing all route parameters
    // If URL is /hello/John, req.params = { name: "John" }
    const { name } = req.params;

    res.json({
        message: `Hello, ${name}! 👋`,
        explanation: 'This demonstrates route parameters'
    });
});

// Example POST route to demonstrate receiving data
// POST = used when CLIENT sends DATA to server
app.post('/echo', (req, res) => {
    // req.body = the JSON data sent by client
    // Only works because we added express.json() middleware above!
    console.log('Received data:', req.body);

    // Echo back whatever was sent
    res.json({
        received: req.body,
        message: 'You sent this data to the server'
    });
});


app.use('/api/auth', authRoutes);

// Deals routes - /api/deals
app.use('/api/deals', dealRoutes);

// Deliverables routes
// Nested routes like /api/deals/:dealId/deliverables
// And direct routes like /api/deliverables/:id
app.use('/api', deliverableRoutes);
app.use('/api/deliverables', deliverableRoutes);

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6: START SERVER
// ─────────────────────────────────────────────────────────────────────────────
//
// app.listen() = Start the server and listen for connections
// This should ALWAYS be at the BOTTOM of the file
// Because we want all middleware and routes set up BEFORE we start listening
//

app.listen(PORT, () => {
    // This callback runs once the server starts successfully
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('🚀 CreatorOps Clone Server Started!');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`   Local:    http://localhost:${PORT}`);
    console.log(`   Health:   http://localhost:${PORT}/health`);
    console.log('');
    console.log('   Press Ctrl+C to stop the server');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('');
});

// ═══════════════════════════════════════════════════════════════════════════════
// END OF FILE
// ═══════════════════════════════════════════════════════════════════════════════
//
// WHAT'S NEXT?
// 
// Phase 2: Database Layer
// - Connect to MongoDB Atlas
// - Create User, Deal, Deliverable models
//
// ═══════════════════════════════════════════════════════════════════════════════
