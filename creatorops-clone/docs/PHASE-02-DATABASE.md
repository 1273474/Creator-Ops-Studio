# 🍃 PHASE 2: Database Layer (MongoDB + Mongoose)

> **Goal**: Connect to MongoDB Atlas and create User, Deal, Deliverable models with complete understanding.

---

## 📚 THE BIG PICTURE: Why Do We Need a Database?

### The Problem Without a Database

In Phase 1, we built a server. But where does data go?

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    WITHOUT A DATABASE                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   User creates a deal →  Server receives it  → Stores in memory              │
│                                                     │                         │
│                                    Server restarts ─┘                         │
│                                           │                                   │
│                                           ▼                                   │
│                                    ❌ DATA LOST!                              │
│                                                                               │
│   Variables in code = TEMPORARY (lives only while program runs)              │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### The Solution: A Database

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    WITH A DATABASE                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   User creates a deal → Server receives it → Stores in DATABASE              │
│                                                     │                         │
│                                    Server restarts ─┘                         │
│                                           │                                   │
│                                           ▼                                   │
│                                    ✅ DATA SAFE!                              │
│                                                                               │
│   Database = PERMANENT storage (lives forever, survives restarts)            │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### What is a Database?

**Database** = Organized collection of data that can be:
- **Stored** permanently on disk
- **Queried** (find specific data quickly)
- **Modified** (create, update, delete)
- **Shared** between multiple users/servers

---

## 📚 CONCEPT 1: SQL vs NoSQL

There are two main types of databases. This is one of the most important concepts!

### SQL Databases (Relational)

**Examples**: PostgreSQL, MySQL, SQLite, Oracle

Think of SQL databases like an **Excel spreadsheet**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SQL DATABASE (PostgreSQL)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   USERS TABLE                                                                │
│   ┌────────┬──────────┬───────────────────┬──────────────────┐              │
│   │ id     │ name     │ email             │ created_at       │              │
│   ├────────┼──────────┼───────────────────┼──────────────────┤              │
│   │ 1      │ Ravi     │ ravi@example.com  │ 2024-01-15       │              │
│   │ 2      │ John     │ john@example.com  │ 2024-01-16       │              │
│   └────────┴──────────┴───────────────────┴──────────────────┘              │
│                                                                               │
│   DEALS TABLE                                                                │
│   ┌────────┬─────────┬──────────┬────────┬─────────────────────┐            │
│   │ id     │ user_id │ brand    │ value  │ status              │            │
│   ├────────┼─────────┼──────────┼────────┼─────────────────────┤            │
│   │ 1      │ 1       │ Nike     │ 5000   │ CONFIRMED           │            │
│   │ 2      │ 1       │ Adidas   │ 3000   │ PENDING             │            │
│   └────────┴─────────┴──────────┴────────┴─────────────────────┘            │
│                          │                                                   │
│                          └── Foreign Key (links to users.id)                │
│                                                                               │
│   RULES:                                                                     │
│   • Fixed schema (columns defined upfront)                                   │
│   • Every row has SAME columns                                               │
│   • Relationships via Foreign Keys                                           │
│   • Query using SQL language                                                 │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### NoSQL Databases (Document-based)

**Examples**: MongoDB, Firestore, CouchDB

Think of NoSQL databases like a **folder of JSON files**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NoSQL DATABASE (MongoDB)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   USERS COLLECTION                                                           │
│   ┌─────────────────────────────────────────────────────────────────┐       │
│   │ {                                                                │       │
│   │   "_id": ObjectId("507f1f..."),                                  │       │
│   │   "name": "Ravi",                                                │       │
│   │   "email": "ravi@example.com",                                   │       │
│   │   "createdAt": ISODate("2024-01-15")                             │       │
│   │ }                                                                │       │
│   └─────────────────────────────────────────────────────────────────┘       │
│   ┌─────────────────────────────────────────────────────────────────┐       │
│   │ {                                                                │       │
│   │   "_id": ObjectId("507f2a..."),                                  │       │
│   │   "name": "John",                                                │       │
│   │   "email": "john@example.com",                                   │       │
│   │   "phone": "+91 9876543210"  ← Different fields OK!              │       │
│   │ }                                                                │       │
│   └─────────────────────────────────────────────────────────────────┘       │
│                                                                               │
│   DEALS COLLECTION                                                           │
│   ┌─────────────────────────────────────────────────────────────────┐       │
│   │ {                                                                │       │
│   │   "_id": ObjectId("508a1b..."),                                  │       │
│   │   "userId": ObjectId("507f1f..."),   ← Reference to user         │       │
│   │   "brand": "Nike",                                               │       │
│   │   "value": 5000,                                                 │       │
│   │   "status": "CONFIRMED",                                         │       │
│   │   "deliverables": [                  ← Nested array OK!          │       │
│   │     { "title": "Instagram Post", "status": "PENDING" }           │       │
│   │   ]                                                              │       │
│   │ }                                                                │       │
│   └─────────────────────────────────────────────────────────────────┘       │
│                                                                               │
│   RULES:                                                                     │
│   • Flexible schema (documents can vary)                                     │
│   • Documents are JSON-like (BSON)                                           │
│   • Can nest objects and arrays                                              │
│   • Query using JavaScript-like syntax                                       │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Side-by-Side Comparison

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SQL vs NoSQL COMPARISON                               │
├─────────────────────────┬───────────────────────────────────────────────────┤
│        SQL              │                  NoSQL                             │
├─────────────────────────┼───────────────────────────────────────────────────┤
│ Tables with rows        │ Collections with documents                        │
│ Fixed schema            │ Flexible schema                                   │
│ Relationships (JOINs)   │ Embedded documents or references                  │
│ Structured data         │ Semi-structured/unstructured                      │
│ Vertical scaling        │ Horizontal scaling                                │
│ ACID transactions       │ Eventual consistency (usually)                    │
│ SQL language            │ Query using objects                               │
├─────────────────────────┼───────────────────────────────────────────────────┤
│ BEST FOR:               │ BEST FOR:                                         │
│ • Banking, finance      │ • User profiles                                   │
│ • Complex relationships │ • Content management                              │
│ • Data integrity        │ • Real-time analytics                             │
│ • Reporting             │ • Rapid development                               │
└─────────────────────────┴───────────────────────────────────────────────────┘
```

### Why MongoDB for CreatorOps?

1. **JavaScript everywhere** - Data is JSON, code is JavaScript
2. **Flexible schema** - Can add fields without migrations
3. **Fast development** - No tables to define upfront
4. **Natural fit for MERN** - M in MERN!
5. **Scales easily** - Cloud-hosted on MongoDB Atlas

---

## 📚 CONCEPT 2: MongoDB Terminology

Before we write code, let's learn the vocabulary:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      MONGODB TERMINOLOGY                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   SQL Term          →     MongoDB Term         →     Analogy                 │
│   ────────────────────────────────────────────────────────────────────────   │
│   Database          →     Database             →     Filing Cabinet          │
│   Table             →     Collection           →     Folder                  │
│   Row               →     Document             →     File/Paper              │
│   Column            →     Field                →     Field on a form         │
│   Primary Key       →     _id                  →     Unique ID number        │
│   Foreign Key       →     Reference (ObjectId) →     "See file #123"         │
│   JOIN              →     $lookup              →     Combine folders         │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Visual Example

```
MongoDB Atlas (Cloud)
    │
    └── creatorops (Database)
            │
            ├── users (Collection)
            │     ├── { _id: "a1", name: "Ravi", ... }  (Document)
            │     └── { _id: "a2", name: "John", ... }  (Document)
            │
            ├── deals (Collection)
            │     ├── { _id: "b1", brandName: "Nike", ... }
            │     └── { _id: "b2", brandName: "Adidas", ... }
            │
            └── deliverables (Collection)
                  ├── { _id: "c1", title: "Post 1", ... }
                  └── { _id: "c2", title: "Story", ... }
```

### The _id Field

Every MongoDB document has a unique `_id`:

```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  //                │         │       │
  //                │         │       └── Counter (3 bytes) - unique per process
  //                │         └────────── Machine + Process ID (5 bytes)
  //                └─────────────────── Timestamp (4 bytes) - when created
  
  "name": "Ravi"
}
```

**Why ObjectId?**
- Globally unique without coordination
- Sortable by creation time
- 12 bytes (efficient)
- Auto-generated by MongoDB

---

## 📚 CONCEPT 3: What is Mongoose?

### Raw MongoDB Driver vs Mongoose

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     RAW MONGODB DRIVER vs MONGOOSE                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   Raw MongoDB Driver:           Mongoose:                                    │
│   ────────────────────          ─────────                                    │
│   • No structure enforcement    • Schema validation                          │
│   • Basic CRUD operations       • Rich query API                             │
│   • No type checking            • Type casting                               │
│   • Manual everything           • Middleware hooks                           │
│                                 • Virtual properties                         │
│                                 • Population (loading references)            │
│                                                                               │
│   Think of it like:                                                          │
│   • MongoDB Driver = Manual transmission car                                 │
│   • Mongoose = Automatic transmission car                                    │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### What Mongoose Provides

1. **Schemas** - Define structure for your documents
2. **Models** - JavaScript classes for database operations
3. **Validation** - Ensure data is correct before saving
4. **Middleware** - Run code before/after operations
5. **Query Building** - Chainable, readable queries

---

## 📚 CONCEPT 4: Mongoose Schema Types

A Schema defines what fields a document can have:

```javascript
const mongoose = require('mongoose');

// Schema = Structure definition
const userSchema = new mongoose.Schema({
    // String type
    name: {
        type: String,        // The data type
        required: true,      // Must be provided
        trim: true           // Remove whitespace
    },
    
    // String with validation
    email: {
        type: String,
        required: true,
        unique: true,        // No duplicates allowed
        lowercase: true      // Convert to lowercase
    },
    
    // Number type
    age: {
        type: Number,
        min: 0,              // Minimum value
        max: 120             // Maximum value
    },
    
    // Enum (limited options)
    role: {
        type: String,
        enum: ['CREATOR', 'ADMIN'],  // Only these values allowed
        default: 'CREATOR'            // Default if not provided
    },
    
    // Date type
    createdAt: {
        type: Date,
        default: Date.now    // Function called when creating
    },
    
    // Reference to another collection
    companyId: {
        type: mongoose.Schema.Types.ObjectId,  // Special type
        ref: 'Company'                          // Which collection
    },
    
    // Array of strings
    skills: [String],
    
    // Array of objects
    addresses: [{
        street: String,
        city: String,
        zipCode: String
    }]
});

// Model = Interface to database
const User = mongoose.model('User', userSchema);
//                           │        │
//                           │        └── The schema to use
//                           └─────────── Collection name (will be "users")
```

### Schema Types Reference

| Type | Example | Notes |
|------|---------|-------|
| `String` | `"Hello"` | Text data |
| `Number` | `42`, `3.14` | Integers and floats |
| `Boolean` | `true`, `false` | True/false |
| `Date` | `new Date()` | Date and time |
| `ObjectId` | `ObjectId("...")` | Reference to another doc |
| `Array` | `[1, 2, 3]` | List of values |
| `Mixed` | `anything` | Any type (avoid if possible) |
| `Buffer` | Binary data | For files, images |

---

## ⏸️ CONCEPTS CHECKPOINT

Before we write the models, make sure you understand:

1. **SQL vs NoSQL** - Key differences
2. **MongoDB terminology** - Collections, Documents, Fields
3. **Mongoose** - Why we use it over raw MongoDB
4. **Schemas** - How to define structure

**Questions to ask yourself:**
- Why is MongoDB a good fit for MERN stack?
- What is the difference between a Collection and a Document?
- Why do we use Mongoose instead of the raw MongoDB driver?

---

## 🔨 BUILD TIME: Let's Create the Database Layer!

Now YOU will write the code. I'll explain everything, you type it.

---

## Step 2.1: Set Up MongoDB Atlas

MongoDB Atlas = Free cloud-hosted MongoDB database

### Instructions:

1. **Go to**: https://www.mongodb.com/atlas
2. **Sign up** (free account)
3. **Create a Cluster** (M0 free tier)
4. **Set up Database Access**:
   - Create user with password
   - Remember these credentials!
5. **Set up Network Access**:
   - Add IP: `0.0.0.0/0` (allow all - for development)
6. **Get Connection String**:
   - Click "Connect" → "Connect your application"
   - Copy the connection string

Your connection string looks like:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/creatorops?retryWrites=true&w=majority
                │         │                    │                │
                │         │                    │                └── Database name
                │         │                    └─────────────────── Your cluster
                │         └──────────────────────────────────────── Your password
                └────────────────────────────────────────────────── Your username
```

### Update Your .env File

Open `creatorops-clone/server/.env` and update:

```env
# Replace with YOUR actual connection string
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/creatorops?retryWrites=true&w=majority
```

---

## Step 2.2: Update server.js to Connect to MongoDB

Open your `server.js` and **add this code after the dotenv.config() line**:

```javascript
// ─────────────────────────────────────────────────────────────────────────────
// SECTION: DATABASE CONNECTION
// ─────────────────────────────────────────────────────────────────────────────
//
// mongoose.connect() = Connect to MongoDB
// It returns a Promise, so we use .then() and .catch()
//
// WHY async connection?
// - Database might be across the world (MongoDB Atlas)
// - Connection takes time (network latency)
// - We don't want to block the entire program waiting
//

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // This runs if connection succeeds
        console.log('✅ MongoDB Connected Successfully!');
    })
    .catch((err) => {
        // This runs if connection fails
        console.error('❌ MongoDB Connection Error:', err.message);
        
        // Exit the process with failure code
        // Why exit? Because without database, our app can't do anything useful
        process.exit(1);
    });

// ─────────────────────────────────────────────────────────────────────────────
// EXPLANATION: Why process.exit(1)?
// ─────────────────────────────────────────────────────────────────────────────
//
// process.exit(code) = Stop the Node.js process
//
// Exit codes:
// - 0 = Success (normal exit)
// - 1 = Failure (something went wrong)
//
// If we can't connect to database, the server is useless.
// Better to crash loudly than run silently broken!
//
```

---

## Step 2.3: Create the models/ Folder

Create the folder structure:

```bash
cd creatorops-clone/server
mkdir models
```

You'll create 3 files:
```
models/
├── User.js
├── Deal.js
└── Deliverable.js
```

---

## Step 2.4: Create User Model

Create file: `models/User.js`

**Type this code yourself:**

```javascript
// ═══════════════════════════════════════════════════════════════════════════════
// 👤 User Model
// ═══════════════════════════════════════════════════════════════════════════════
//
// This model represents a user in our application.
// A user is a content creator who manages brand deals.
//
// ═══════════════════════════════════════════════════════════════════════════════

const mongoose = require('mongoose');

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMA DEFINITION
// ─────────────────────────────────────────────────────────────────────────────
//
// Schema = Blueprint for documents in a collection
// It defines:
// - What fields exist
// - What type each field is
// - Validation rules
// - Default values
//

const UserSchema = new mongoose.Schema({
    
    // ─────────────────────────────────────────────────────────────────────────
    // name: The user's display name
    // ─────────────────────────────────────────────────────────────────────────
    name: {
        type: String,           // Data type: text
        required: [true, 'Name is required'],  // Must be provided
        //          └── Custom error message
        trim: true,             // Remove whitespace from start/end
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    
    // ─────────────────────────────────────────────────────────────────────────
    // email: User's email (used for login)
    // ─────────────────────────────────────────────────────────────────────────
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
    
    // ─────────────────────────────────────────────────────────────────────────
    // password: Hashed password (NEVER store plain text!)
    // ─────────────────────────────────────────────────────────────────────────
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
        // NOTE: We'll hash this in Phase 3 (Authentication)
        // The actual stored value will be something like:
        // "$2b$10$X4kv2..."  (bcrypt hash)
    },
    
    // ─────────────────────────────────────────────────────────────────────────
    // role: What type of user (for future features)
    // ─────────────────────────────────────────────────────────────────────────
    role: {
        type: String,
        enum: ['CREATOR', 'ADMIN'],  // Only these values allowed
        //      └── If someone tries to set role: 'SUPERUSER', it fails
        default: 'CREATOR'           // If not specified, use this
    },
    
    // ─────────────────────────────────────────────────────────────────────────
    // createdAt: When the user registered
    // ─────────────────────────────────────────────────────────────────────────
    createdAt: {
        type: Date,
        default: Date.now    // Function! Called when document is created
        //       └── Automatically sets to current date/time
    }
    
});

// ─────────────────────────────────────────────────────────────────────────────
// CREATE THE MODEL
// ─────────────────────────────────────────────────────────────────────────────
//
// mongoose.model(name, schema)
//
// - name: 'User' → Collection will be 'users' (lowercase, pluralized)
// - schema: The schema we defined above
//
// Returns a Model class that we can use to:
// - Create documents: new User({...})
// - Query documents: User.find({...})
// - Update documents: User.updateOne({...})
// - Delete documents: User.deleteOne({...})
//

const User = mongoose.model('User', UserSchema);

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT THE MODEL
// ─────────────────────────────────────────────────────────────────────────────
//
// module.exports = Make this available to other files
// When another file does: const User = require('./models/User')
// They get this User model
//

module.exports = User;
```

---

## Step 2.5: Create Deal Model

Create file: `models/Deal.js`

**Type this code yourself:**

```javascript
// ═══════════════════════════════════════════════════════════════════════════════
// 💼 Deal Model
// ═══════════════════════════════════════════════════════════════════════════════
//
// This model represents a brand deal.
// A deal is the CORE entity of CreatorOps - everything revolves around it.
//
// A deal has:
// - Brand information
// - Financial details (value, payment status)
// - Status tracking
// - A shareable link for brand approval
//
// ═══════════════════════════════════════════════════════════════════════════════

const mongoose = require('mongoose');
const crypto = require('crypto');  // Built-in Node.js module for random strings

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMA DEFINITION
// ─────────────────────────────────────────────────────────────────────────────

const DealSchema = new mongoose.Schema({
    
    // ─────────────────────────────────────────────────────────────────────────
    // userId: Who owns this deal?
    // ─────────────────────────────────────────────────────────────────────────
    userId: {
        type: mongoose.Schema.Types.ObjectId,  // Special type for MongoDB IDs
        //     └── This is how we create RELATIONSHIPS in MongoDB
        ref: 'User',           // Which collection does this ID refer to?
        //     └── Enables "population" - loading the actual user data
        required: [true, 'User ID is required']
    },
    
    // ─────────────────────────────────────────────────────────────────────────
    // brandName: The brand this deal is with
    // ─────────────────────────────────────────────────────────────────────────
    brandName: {
        type: String,
        required: [true, 'Brand name is required'],
        trim: true
    },
    
    // ─────────────────────────────────────────────────────────────────────────
    // brandEmail: Contact email for the brand
    // ─────────────────────────────────────────────────────────────────────────
    brandEmail: {
        type: String,
        trim: true,
        lowercase: true
        // Not required - might not always have it
    },
    
    // ─────────────────────────────────────────────────────────────────────────
    // value: How much is this deal worth?
    // ─────────────────────────────────────────────────────────────────────────
    value: {
        type: Number,
        default: 0,
        min: [0, 'Deal value cannot be negative']
    },
    
    // ─────────────────────────────────────────────────────────────────────────
    // dueDate: When is the content due?
    // ─────────────────────────────────────────────────────────────────────────
    dueDate: {
        type: Date
        // Not required - might be open-ended
    },
    
    // ─────────────────────────────────────────────────────────────────────────
    // status: Where is this deal in the workflow?
    // ─────────────────────────────────────────────────────────────────────────
    status: {
        type: String,
        enum: [
            'CONFIRMED',        // Deal is confirmed, starting work
            'IN_PRODUCTION',    // Creating content
            'SENT_FOR_APPROVAL',// Waiting for brand feedback
            'POSTED',           // Content is live
            'PAYMENT_PENDING',  // Done, waiting for payment
            'PAID'              // Complete!
        ],
        default: 'CONFIRMED'
    },
    
    // ─────────────────────────────────────────────────────────────────────────
    // shareToken: Unique token for brand approval link
    // ─────────────────────────────────────────────────────────────────────────
    shareToken: {
        type: String,
        unique: true
        // We'll generate this automatically (see pre-save hook below)
    },
    
    // ─────────────────────────────────────────────────────────────────────────
    // notes: Any additional notes about the deal
    // ─────────────────────────────────────────────────────────────────────────
    notes: {
        type: String,
        maxlength: [1000, 'Notes cannot exceed 1000 characters']
    }
    
}, {
    // ─────────────────────────────────────────────────────────────────────────
    // SCHEMA OPTIONS
    // ─────────────────────────────────────────────────────────────────────────
    timestamps: true    // Automatically add createdAt and updatedAt fields
    //                     MongoDB handles these for us!
});

// ─────────────────────────────────────────────────────────────────────────────
// PRE-SAVE MIDDLEWARE (Hook)
// ─────────────────────────────────────────────────────────────────────────────
//
// pre('save') = Run this function BEFORE saving to database
//
// Use cases:
// - Generate default values
// - Validate complex logic
// - Transform data
// - Hash passwords
//
// 'this' = the document being saved
// 'next' = function to call to continue (like middleware!)
//

DealSchema.pre('save', function(next) {
    // Generate shareToken if it doesn't exist
    if (!this.shareToken) {
        // crypto.randomBytes(16) = Generate 16 random bytes
        // .toString('hex') = Convert to hexadecimal string (32 characters)
        this.shareToken = crypto.randomBytes(16).toString('hex');
        // Result: something like "a3f8b2c4d5e6f7a8b9c0d1e2f3a4b5c6"
    }
    
    // Continue to save
    next();
});

// ─────────────────────────────────────────────────────────────────────────────
// CREATE AND EXPORT THE MODEL
// ─────────────────────────────────────────────────────────────────────────────

const Deal = mongoose.model('Deal', DealSchema);
module.exports = Deal;
```

---

## Step 2.6: Create Deliverable Model

Create file: `models/Deliverable.js`

**Type this code yourself:**

```javascript
// ═══════════════════════════════════════════════════════════════════════════════
// 📦 Deliverable Model
// ═══════════════════════════════════════════════════════════════════════════════
//
// A Deliverable is a piece of content created for a Deal.
// For example:
// - 1 Instagram Reel
// - 1 YouTube Video
// - 2 Instagram Stories
//
// Each deliverable can have:
// - A link to the content
// - Multiple versions
// - Approval status
// - Comments from the brand
//
// ═══════════════════════════════════════════════════════════════════════════════

const mongoose = require('mongoose');

// ─────────────────────────────────────────────────────────────────────────────
// EMBEDDED SUB-SCHEMA: Comments
// ─────────────────────────────────────────────────────────────────────────────
//
// Instead of creating a separate Comments collection, we embed comments
// directly inside the Deliverable document.
//
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
// Note: We DON'T create a model for Comment
// It's embedded, not a separate collection

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCHEMA: Deliverable
// ─────────────────────────────────────────────────────────────────────────────

const DeliverableSchema = new mongoose.Schema({
    
    // ─────────────────────────────────────────────────────────────────────────
    // dealId: Which deal does this deliverable belong to?
    // ─────────────────────────────────────────────────────────────────────────
    dealId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Deal',           // Reference to Deal collection
        required: [true, 'Deal ID is required']
    },
    
    // ─────────────────────────────────────────────────────────────────────────
    // title: What is this deliverable?
    // ─────────────────────────────────────────────────────────────────────────
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
        // Examples: "Instagram Reel", "YouTube Video", "Story #1"
    },
    
    // ─────────────────────────────────────────────────────────────────────────
    // link: URL to the content (draft or published)
    // ─────────────────────────────────────────────────────────────────────────
    link: {
        type: String,
        trim: true
        // Could be Google Drive link, Instagram URL, etc.
    },
    
    // ─────────────────────────────────────────────────────────────────────────
    // version: Track revisions (v1, v2, v3...)
    // ─────────────────────────────────────────────────────────────────────────
    version: {
        type: Number,
        default: 1,
        min: 1
    },
    
    // ─────────────────────────────────────────────────────────────────────────
    // status: Approval status of this deliverable
    // ─────────────────────────────────────────────────────────────────────────
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
    
    // ─────────────────────────────────────────────────────────────────────────
    // comments: Array of embedded comments
    // ─────────────────────────────────────────────────────────────────────────
    comments: [CommentSchema]   // Array of embedded documents
    //         └── Uses the sub-schema we defined above
    
}, {
    timestamps: true    // createdAt, updatedAt
});

// ─────────────────────────────────────────────────────────────────────────────
// CREATE AND EXPORT THE MODEL
// ─────────────────────────────────────────────────────────────────────────────

const Deliverable = mongoose.model('Deliverable', DeliverableSchema);
module.exports = Deliverable;
```

---

## Step 2.7: Test Your Connection

After you've written all the models, start your server:

```bash
cd creatorops-clone/server
npm run dev
```

If everything is correct, you should see:
```
✅ MongoDB Connected Successfully!
🚀 CreatorOps Clone Server Started!
```

If you see an error:
- Check your MONGO_URI in .env
- Make sure you replaced username, password, and cluster name
- Make sure your IP is whitelisted in MongoDB Atlas

---

## ✅ VERIFICATION CHECKPOINT

Before moving on, verify:

1. [ ] MongoDB Atlas account created
2. [ ] Connection string added to .env
3. [ ] server.js updated with mongoose.connect()
4. [ ] models/User.js created
5. [ ] models/Deal.js created  
6. [ ] models/Deliverable.js created
7. [ ] Server starts without errors
8. [ ] Console shows "MongoDB Connected Successfully!"

---

## 📝 PHASE 2: Complete Revision Notes

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                    PHASE 2: DATABASE - REVISION NOTES                          ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                                ║
║  WHY DATABASE?                                                                 ║
║  ─────────────                                                                 ║
║  • Without DB: Data lost on restart (temporary)                                ║
║  • With DB: Data persists forever (permanent)                                  ║
║                                                                                ║
║  SQL vs NoSQL                                                                  ║
║  ────────────                                                                  ║
║  SQL (PostgreSQL, MySQL):              NoSQL (MongoDB):                        ║
║  • Tables with rows                    • Collections with documents            ║
║  • Fixed schema                        • Flexible schema                       ║
║  • JOINs for relationships             • References or embedding              ║
║  • Vertical scaling                    • Horizontal scaling                   ║
║                                                                                ║
║  MONGODB TERMINOLOGY                                                           ║
║  ───────────────────                                                           ║
║  • Database → Collection → Document → Field                                    ║
║  • Document = JSON-like object with _id                                        ║
║  • _id = Auto-generated unique identifier (ObjectId)                           ║
║                                                                                ║
║  MONGOOSE                                                                      ║
║  ────────                                                                      ║
║  • ODM = Object Document Mapper                                                ║
║  • Adds structure to schemaless MongoDB                                        ║
║  • Provides: Schemas, Models, Validation, Middleware                           ║
║                                                                                ║
║  SCHEMA TYPES                                                                  ║
║  ────────────                                                                  ║
║  • String, Number, Boolean, Date                                               ║
║  • ObjectId (with ref for relationships)                                       ║
║  • Array, Mixed                                                                ║
║                                                                                ║
║  SCHEMA OPTIONS                                                                ║
║  ──────────────                                                                ║
║  • required: [true, 'error message']                                           ║
║  • unique: true (creates index)                                                ║
║  • enum: ['VALUE1', 'VALUE2'] (limited options)                                ║
║  • default: value or function                                                  ║
║  • trim, lowercase, min, max, minlength, maxlength                             ║
║                                                                                ║
║  RELATIONSHIPS                                                                 ║
║  ─────────────                                                                 ║
║  • Reference: { type: ObjectId, ref: 'ModelName' }                             ║
║  • Embedding: [SubSchema] inside parent                                        ║
║  • Embed for: always accessed together, bounded data                           ║
║  • Reference for: independent access, shared data                              ║
║                                                                                ║
║  PRE-SAVE MIDDLEWARE                                                           ║
║  ───────────────────                                                           ║
║  • schema.pre('save', function(next) { ... })                                  ║
║  • Runs BEFORE saving to database                                              ║
║  • 'this' = the document being saved                                           ║
║  • Must call next() to continue                                                ║
║                                                                                ║
║  OUR MODELS                                                                    ║
║  ──────────                                                                    ║
║  • User: name, email, password, role, createdAt                                ║
║  • Deal: userId (ref), brandName, value, status, shareToken                    ║
║  • Deliverable: dealId (ref), title, link, status, comments[]                  ║
║                                                                                ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

---

## ❓ Interview Questions

### 1. "What's the difference between SQL and NoSQL databases?"

> **Answer**: SQL databases are relational with fixed schemas, tables, and rows. They use JOIN operations and are great for complex relationships. NoSQL databases like MongoDB are document-based with flexible schemas. Documents are JSON-like and can vary in structure. NoSQL scales horizontally better and is ideal for rapid development and unstructured data.

### 2. "Why did you choose MongoDB for this project?"

> **Answer**: Three reasons: (1) JavaScript everywhere - MongoDB stores JSON-like documents, making it natural with Node.js, (2) Flexible schema - I can add fields without migrations, perfect for rapid development, (3) MERN stack - MongoDB is the M in MERN, designed to work seamlessly with Express, React, and Node.

### 3. "What is Mongoose and why use it?"

> **Answer**: Mongoose is an ODM (Object Document Mapper) for MongoDB. While MongoDB is schemaless, Mongoose adds schema validation, type casting, middleware hooks, and a rich query API. It's like adding guard rails to MongoDB - you get the flexibility of NoSQL with the structure and validation of an ORM.

### 4. "Explain embedding vs referencing in MongoDB"

> **Answer**: Embedding stores related data inside the parent document (like comments inside a post). Referencing stores only the ID and loads related data separately (like userId in a deal). I embed when data is always accessed together and won't grow unbounded. I reference when data is shared across documents or accessed independently.

### 5. "What is a pre-save hook in Mongoose?"

> **Answer**: Pre-save hooks are middleware that run before a document is saved to the database. They're useful for generating default values (like our shareToken), data transformation, validation, or password hashing. The hook receives a `next` function that must be called to continue saving.

---

## 🎉 PHASE 2 COMPLETE!

**You have learned:**
- ✅ SQL vs NoSQL databases
- ✅ MongoDB terminology
- ✅ What Mongoose provides
- ✅ Schema types and validation
- ✅ Relationships (embedding vs referencing)
- ✅ Pre-save middleware

**You have built:**
- ✅ MongoDB Atlas database
- ✅ User model
- ✅ Deal model with pre-save hook
- ✅ Deliverable model with embedded comments

---

## 🔜 NEXT: Phase 3 - Authentication

In Phase 3, you will:
- Hash passwords with bcrypt
- Create JWT tokens
- Build login and register endpoints
- Create auth middleware

**When your server shows "MongoDB Connected Successfully!", say "START PHASE 3"!**

