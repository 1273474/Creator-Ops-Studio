# 🔐 PHASE 3: Authentication System

> **Goal**: Build complete signup/login system with password hashing and JWT tokens. Understand every step of the authentication journey.

---

## 📖 THE STORY OF AUTHENTICATION

Let me tell you a story. It's the story of how your user goes from being a stranger to being recognized by your server.

---

## 🎭 Chapter 1: The Problem - "Who Are You?"

Imagine you're running a private club. People come to the door and say:

> "Hey, I'm Ravi. Let me in!"

**The Problem**: How do you know they're really Ravi?

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      THE AUTHENTICATION PROBLEM                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   WITHOUT AUTHENTICATION:                                                     │
│   ───────────────────────                                                     │
│                                                                               │
│   Anyone: "Hey, I'm Ravi! Show me Ravi's deals!"                             │
│   Server: "Okay! Here are all of Ravi's private deals!"                      │
│                                                                               │
│   😱 ANYONE can pretend to be ANYONE!                                        │
│                                                                               │
│   ─────────────────────────────────────────────────────────────────────────  │
│                                                                               │
│   WITH AUTHENTICATION:                                                        │
│   ────────────────────                                                        │
│                                                                               │
│   Anyone: "Hey, I'm Ravi! Show me Ravi's deals!"                             │
│   Server: "Prove it. What's the password?"                                   │
│   Anyone: "Uh... password123?"                                               │
│   Server: "Wrong! Access denied. 🚫"                                         │
│                                                                               │
│   Real Ravi: "Here's my proof: [valid token]"                                │
│   Server: "Verified! Here are your deals, Ravi. ✅"                          │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Two Concepts You Must Know:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│            AUTHENTICATION vs AUTHORIZATION                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   AUTHENTICATION (AuthN)              AUTHORIZATION (AuthZ)                  │
│   ──────────────────────              ─────────────────────                  │
│   "WHO are you?"                      "WHAT can you do?"                     │
│                                                                               │
│   • Verify identity                   • Check permissions                    │
│   • Login/signup process              • Role-based access                    │
│   • "Are you really Ravi?"            • "Can Ravi delete this?"             │
│                                                                               │
│   Examples:                           Examples:                              │
│   • Password check                    • Admin vs User roles                  │
│   • Token verification                • Owner-only actions                   │
│   • Biometric scan                    • Feature flags                        │
│                                                                               │
│   ─────────────────────────────────────────────────────────────────────────  │
│                                                                               │
│   FLOW:                                                                       │
│                                                                               │
│   Request → [Authentication] → [Authorization] → Action                      │
│              "Who is this?"    "Can they do this?"                           │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔒 Chapter 2: The Password Problem

### Why Can't We Just Store Passwords?

Imagine your database looks like this:

```
❌ TERRIBLE IDEA - Plain Text Passwords
┌──────────────────────────────────────────────────────────────┐
│ users collection                                              │
├──────────────────────────────────────────────────────────────┤
│ { name: "Ravi",  email: "ravi@x.com",  password: "ravi123"  } │
│ { name: "John",  email: "john@x.com",  password: "john456"  } │
│ { name: "Admin", email: "admin@x.com", password: "admin789" } │
└──────────────────────────────────────────────────────────────┘
```

**What happens if a hacker gets your database?**

1. They see EVERYONE'S passwords in plain text
2. People reuse passwords → Their email, bank, everything is compromised!
3. You lose your users' trust forever
4. Potential lawsuits and fines

**Real-world example**: LinkedIn breach (2012) - 6.5 million plain text passwords leaked.

### The Solution: Hashing

**Hashing** = One-way mathematical transformation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          HOW HASHING WORKS                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   INPUT (Password)          HASH FUNCTION          OUTPUT (Hash)             │
│   ────────────────          ─────────────          ──────────────            │
│                                                                               │
│   "ravi123"        ──────▶   bcrypt()   ──────▶   "$2b$10$X4kv..."          │
│                                                                               │
│   ─────────────────────────────────────────────────────────────────────────  │
│                                                                               │
│   KEY PROPERTIES:                                                             │
│                                                                               │
│   1. ONE-WAY (Cannot reverse)                                                 │
│      "$2b$10$X4kv..." ─╳─▶ "ravi123"   ❌ IMPOSSIBLE!                        │
│                                                                               │
│   2. DETERMINISTIC (Same input → Same output)                                 │
│      "ravi123" always produces the same hash                                  │
│                                                                               │
│   3. UNIQUE (Different input → Different output)                              │
│      "ravi123" → "$2b$10$X4kv..."                                            │
│      "ravi124" → "$2b$10$Yp8m..."  (completely different!)                   │
│                                                                               │
│   4. FIXED LENGTH                                                             │
│      "hi" → 60 chars                                                          │
│      "verylongpassword123456" → 60 chars                                     │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Now Our Database Looks Like:

```
✅ SECURE - Hashed Passwords
┌────────────────────────────────────────────────────────────────────────────┐
│ users collection                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│ { name: "Ravi",  password: "$2b$10$X4kv2wsHlPLM..." }  ← Can't reverse!    │
│ { name: "John",  password: "$2b$10$Yp8mN3qRtUvW..." }  ← Useless to hacker │
│ { name: "Admin", password: "$2b$10$Zq9oP4rStUvX..." }  ← Secure!           │
└────────────────────────────────────────────────────────────────────────────┘
```

**If hacker gets database**: They see useless hashes, not passwords!

---

## 🧂 Chapter 3: Salt - Making Hashes Even Stronger

### The Rainbow Table Attack

Hackers are clever. They pre-computed hashes for common passwords:

```
RAINBOW TABLE (Pre-computed hashes)
┌─────────────────────────────────────────────────────────────┐
│ password123  →  $2b$10$abc...                                │
│ 123456       →  $2b$10$def...                                │
│ qwerty       →  $2b$10$ghi...                                │
│ iloveyou     →  $2b$10$jkl...                                │
│ ... millions more ...                                        │
└─────────────────────────────────────────────────────────────┘

Hacker sees: $2b$10$abc...
Looks up in rainbow table → "password123"
💀 Password cracked!
```

### The Solution: Salt

**Salt** = Random string added to password before hashing

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          HOW SALT WORKS                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   WITHOUT SALT:                                                               │
│   ─────────────                                                               │
│   "password123" → hash → "$2b$10$abc..."                                     │
│   "password123" → hash → "$2b$10$abc..."  (SAME! Can use rainbow table)     │
│                                                                               │
│   ─────────────────────────────────────────────────────────────────────────  │
│                                                                               │
│   WITH SALT:                                                                  │
│   ──────────                                                                  │
│   Generate random salt: "x7Yp9zQw"                                           │
│                                                                               │
│   "password123" + "x7Yp9zQw" → hash → "$2b$10$x7Yp9zQw.Kj8mNpL..."           │
│                      │                                                       │
│                      └── Salt stored IN the hash!                            │
│                                                                               │
│   Same password, different salt → DIFFERENT hash!                            │
│                                                                               │
│   User 1: "password123" + salt1 → "$2b$10$aaa..."                           │
│   User 2: "password123" + salt2 → "$2b$10$bbb..."  (Different!)             │
│                                                                               │
│   Rainbow tables are now USELESS! 🎉                                         │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### bcrypt Does This Automatically!

```javascript
// bcrypt.hash(password, saltRounds)
// saltRounds = how many times to apply the algorithm (more = slower = safer)

const hash = await bcrypt.hash('password123', 10);
// Result: "$2b$10$x7Yp9zQw.Kj8mNpL..."
//           │   │  │
//           │   │  └── Salt (22 chars) + Hash
//           │   └───── Cost factor (10)
//           └──────── Algorithm version ($2b = bcrypt)
```

---

## 🎫 Chapter 4: The Token System (JWT)

### The Problem with Passwords

Do we check the password on EVERY request?

```
❌ BAD APPROACH - Password on every request

User: "GET /deals, my password is ravi123"
    → Server verifies password (slow database lookup)
    → Returns deals

User: "GET /deals/1, my password is ravi123"
    → Server verifies password AGAIN
    → Returns deal

User: "POST /deals, my password is ravi123"
    → Server verifies password AGAIN
    → Creates deal

😱 Sending password over network constantly = RISKY!
😱 Database lookup on every request = SLOW!
```

### The Solution: Login Once, Get a Token

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       TOKEN-BASED AUTHENTICATION                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   STEP 1: LOGIN (Password sent ONCE)                                         │
│   ──────────────────────────────────                                         │
│                                                                               │
│   User: "POST /login, email: ravi@x.com, password: ravi123"                  │
│                          │                                                    │
│                          ▼                                                    │
│   Server: 1. Find user by email                                              │
│           2. Compare hashed passwords                                         │
│           3. If match → Generate TOKEN                                        │
│           4. Send token back to user                                          │
│                          │                                                    │
│                          ▼                                                    │
│   Response: { token: "eyJhbGciOiJIUzI1NiIs..." }                             │
│                                                                               │
│   ─────────────────────────────────────────────────────────────────────────  │
│                                                                               │
│   STEP 2: USE TOKEN FOR ALL FUTURE REQUESTS                                  │
│   ──────────────────────────────────────────                                  │
│                                                                               │
│   User: "GET /deals"                                                         │
│         Header: x-auth-token: "eyJhbGciOiJIUzI1NiIs..."                      │
│                          │                                                    │
│                          ▼                                                    │
│   Server: 1. Extract token from header                                        │
│           2. Verify token signature (NO database lookup!)                     │
│           3. Get user info FROM the token                                     │
│           4. Process request                                                  │
│                          │                                                    │
│                          ▼                                                    │
│   Response: { deals: [...] }                                                  │
│                                                                               │
│   ✅ Password sent only ONCE (at login)                                       │
│   ✅ Token verification is FAST (no database)                                 │
│   ✅ Stateless - server doesn't need to remember sessions                     │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎟️ Chapter 5: JWT Deep Dive

### What is JWT?

**JWT** = JSON Web Token

It's like a **signed ID card** that contains information.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ANATOMY OF A JWT                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.                                      │
│   eyJ1c2VySWQiOiIxMjM0NTYiLCJlbWFpbCI6InJhdmlAeC5jb20iLCJpYXQiOjE2...       │
│   SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c                                │
│   │                        │                        │                        │
│   │                        │                        │                        │
│   HEADER                   PAYLOAD                  SIGNATURE                 │
│   (Algorithm)              (Data)                   (Verification)            │
│                                                                               │
│   ─────────────────────────────────────────────────────────────────────────  │
│                                                                               │
│   HEADER (Base64 decoded):                                                    │
│   {                                                                           │
│     "alg": "HS256",     ← Algorithm used to sign                             │
│     "typ": "JWT"        ← Type of token                                       │
│   }                                                                           │
│                                                                               │
│   PAYLOAD (Base64 decoded):                                                   │
│   {                                                                           │
│     "userId": "123456",     ← User's ID                                       │
│     "email": "ravi@x.com",  ← User's email                                   │
│     "iat": 1609459200,      ← Issued At (timestamp)                          │
│     "exp": 1609545600       ← Expires At (timestamp)                         │
│   }                                                                           │
│                                                                               │
│   SIGNATURE:                                                                  │
│   HMACSHA256(                                                                 │
│     base64(header) + "." + base64(payload),                                  │
│     SECRET_KEY    ← Only server knows this!                                  │
│   )                                                                           │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Why Is JWT Secure?

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       JWT SECURITY EXPLAINED                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   CAN ANYONE READ JWT?                                                        │
│   ────────────────────                                                        │
│   YES! Header and Payload are just Base64 encoded (not encrypted)            │
│   Anyone can decode and read the userId, email, etc.                          │
│                                                                               │
│   ─────────────────────────────────────────────────────────────────────────  │
│                                                                               │
│   THEN HOW IS IT SECURE?                                                      │
│   ──────────────────────                                                      │
│   The SIGNATURE proves it wasn't tampered with!                               │
│                                                                               │
│   ─────────────────────────────────────────────────────────────────────────  │
│                                                                               │
│   SCENARIO: Hacker tries to fake a token                                      │
│                                                                               │
│   Hacker: "I'll change userId from '123' to 'admin-456'"                     │
│                                                                               │
│   Original: { userId: "123" } + signature_A                                   │
│   Tampered: { userId: "admin-456" } + signature_A   ← Same signature!        │
│                                                                               │
│   Server verifies:                                                            │
│   1. Recalculates signature using SECRET_KEY                                  │
│   2. Compares with signature in token                                         │
│   3. MISMATCH! → Token rejected ❌                                            │
│                                                                               │
│   ─────────────────────────────────────────────────────────────────────────  │
│                                                                               │
│   WHY CAN'T HACKER CREATE VALID SIGNATURE?                                   │
│   ─────────────────────────────────────────                                   │
│   Because they don't know the SECRET_KEY!                                     │
│   Only your server knows it (stored in .env)                                  │
│                                                                               │
│   This is why JWT_SECRET must be:                                             │
│   • Long and random                                                           │
│   • NEVER shared or committed to GitHub                                       │
│   • Different in production vs development                                   │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔑 Chapter 6: The Complete Auth Flow

Let me show you the COMPLETE journey, step by step:

### SIGNUP FLOW

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SIGNUP FLOW (STEP BY STEP)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   FRONTEND                           BACKEND                                  │
│   ────────                           ───────                                  │
│                                                                               │
│   1. User fills signup form                                                   │
│      ┌─────────────────────┐                                                 │
│      │ Name: Ravi          │                                                 │
│      │ Email: ravi@x.com   │                                                 │
│      │ Password: ••••••    │                                                 │
│      │ [Sign Up]           │                                                 │
│      └─────────────────────┘                                                 │
│              │                                                                │
│              ▼                                                                │
│   2. POST /api/auth/register                                                  │
│      Body: { name, email, password }                                         │
│              │                                                                │
│              └───────────────────────────▶ 3. Receive request                │
│                                               │                               │
│                                               ▼                               │
│                                           4. Check if email exists           │
│                                              User.findOne({ email })         │
│                                               │                               │
│                                               ├─ If exists → 400 Error       │
│                                               │                               │
│                                               ▼                               │
│                                           5. Hash the password               │
│                                              bcrypt.hash(password, 10)       │
│                                              "ravi123" → "$2b$10$..."        │
│                                               │                               │
│                                               ▼                               │
│                                           6. Create user in database         │
│                                              new User({ name, email,         │
│                                                hashed_password })            │
│                                              user.save()                      │
│                                               │                               │
│                                               ▼                               │
│                                           7. Generate JWT token               │
│                                              jwt.sign({ id: user._id },      │
│                                                SECRET, { expiresIn: '7d' })  │
│                                               │                               │
│              ◀───────────────────────────────┘                               │
│              │                                                                │
│              ▼                                                                │
│   8. Receive { token: "eyJ..." }                                             │
│              │                                                                │
│              ▼                                                                │
│   9. Store token in localStorage                                             │
│      localStorage.setItem('token', token)                                    │
│              │                                                                │
│              ▼                                                                │
│   10. Redirect to Dashboard ✅                                                │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### LOGIN FLOW

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          LOGIN FLOW (STEP BY STEP)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   FRONTEND                           BACKEND                                  │
│   ────────                           ───────                                  │
│                                                                               │
│   1. User fills login form                                                    │
│      ┌─────────────────────┐                                                 │
│      │ Email: ravi@x.com   │                                                 │
│      │ Password: ••••••    │                                                 │
│      │ [Login]             │                                                 │
│      └─────────────────────┘                                                 │
│              │                                                                │
│              ▼                                                                │
│   2. POST /api/auth/login                                                     │
│      Body: { email, password }                                               │
│              │                                                                │
│              └───────────────────────────▶ 3. Receive request                │
│                                               │                               │
│                                               ▼                               │
│                                           4. Find user by email              │
│                                              User.findOne({ email })         │
│                                               │                               │
│                                               ├─ If not found → 400 Error    │
│                                               │                               │
│                                               ▼                               │
│                                           5. Compare passwords               │
│                                              bcrypt.compare(                 │
│                                                input_password,               │
│                                                stored_hash                   │
│                                              )                                │
│                                               │                               │
│                                               ├─ If no match → 400 Error     │
│                                               │                               │
│                                               ▼                               │
│                                           6. Generate JWT token               │
│                                              jwt.sign({ id: user._id },      │
│                                                SECRET, { expiresIn: '7d' })  │
│                                               │                               │
│              ◀───────────────────────────────┘                               │
│              │                                                                │
│              ▼                                                                │
│   7. Receive { token: "eyJ..." }                                             │
│              │                                                                │
│              ▼                                                                │
│   8. Store token + Redirect ✅                                                │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### PROTECTED REQUEST FLOW

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PROTECTED REQUEST FLOW (STEP BY STEP)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   FRONTEND                           BACKEND                                  │
│   ────────                           ───────                                  │
│                                                                               │
│   1. User clicks "View Deals"                                                 │
│              │                                                                │
│              ▼                                                                │
│   2. Axios interceptor runs:                                                  │
│      - Get token from localStorage                                           │
│      - Add to request header                                                 │
│              │                                                                │
│              ▼                                                                │
│   3. GET /api/deals                                                          │
│      Header: x-auth-token: "eyJ..."                                          │
│              │                                                                │
│              └───────────────────────────▶ 4. Receive request                │
│                                               │                               │
│                                               ▼                               │
│                                           5. AUTH MIDDLEWARE runs            │
│                                              │                                │
│                                              ├── Get token from header       │
│                                              │   req.header('x-auth-token')  │
│                                              │                               │
│                                              ├── If no token → 401           │
│                                              │                               │
│                                              ├── Verify token                │
│                                              │   jwt.verify(token, SECRET)   │
│                                              │                               │
│                                              ├── If invalid → 401            │
│                                              │                               │
│                                              ├── Decode payload              │
│                                              │   { id: "123", iat, exp }     │
│                                              │                               │
│                                              └── Attach to request           │
│                                                  req.user = { id: "123" }    │
│                                               │                               │
│                                               ▼                               │
│                                           6. ROUTE HANDLER runs              │
│                                              - req.user.id available!        │
│                                              - Deal.find({ userId:           │
│                                                  req.user.id })              │
│                                               │                               │
│              ◀───────────────────────────────┘                               │
│              │                                                                │
│              ▼                                                                │
│   7. Receive deals, update UI ✅                                              │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📝 PHASE 3: Concepts Summary

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                     PHASE 3: AUTHENTICATION - CONCEPTS                         ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                                ║
║  AUTHENTICATION vs AUTHORIZATION                                               ║
║  ───────────────────────────────                                               ║
║  • Authentication = WHO are you? (login)                                       ║
║  • Authorization = WHAT can you do? (permissions)                              ║
║                                                                                ║
║  PASSWORD HASHING                                                              ║
║  ────────────────                                                              ║
║  • NEVER store plain text passwords                                            ║
║  • bcrypt = hash function with built-in salt                                   ║
║  • Salt = random string added before hashing                                   ║
║  • Salt prevents rainbow table attacks                                         ║
║  • Hash is one-way (cannot reverse)                                            ║
║                                                                                ║
║  JWT (JSON Web Token)                                                          ║
║  ────────────────────                                                          ║
║  • Token has 3 parts: HEADER.PAYLOAD.SIGNATURE                                 ║
║  • Payload contains user data (id, email, expiry)                              ║
║  • Signature = proof token wasn't tampered                                     ║
║  • Signed with SECRET_KEY (only server knows)                                  ║
║  • Stateless: server doesn't store sessions                                    ║
║                                                                                ║
║  AUTH FLOW                                                                     ║
║  ─────────                                                                     ║
║  1. Signup: hash password → save user → generate token                         ║
║  2. Login: find user → compare hash → generate token                           ║
║  3. Protected: verify token → extract user → proceed                           ║
║                                                                                ║
║  MIDDLEWARE                                                                    ║
║  ──────────                                                                    ║
║  • Auth middleware runs BEFORE route handlers                                  ║
║  • Extracts token from header                                                  ║
║  • Verifies signature                                                          ║
║  • Attaches user to request (req.user)                                         ║
║                                                                                ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

---

## 🎣 Chapter 7: Pre-Save Hooks (Middleware) - The Complete Story

This is one of the **most asked interview questions** about Mongoose. Let me explain it like a story.

### The Restaurant Kitchen Analogy

Imagine a restaurant kitchen:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        THE RESTAURANT KITCHEN                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   Customer Order               Kitchen Process                 Served        │
│   ─────────────               ───────────────                 ──────         │
│                                                                               │
│   "Burger please"   →   [PREP] → [COOK] → [PLATE] → [SERVE]   →   🍔        │
│                              ↑                                               │
│                              │                                               │
│                     CHEF CHECKS HERE!                                        │
│                     Before cooking, chef:                                    │
│                     - Washes vegetables                                      │
│                     - Seasons the patty                                      │
│                     - Adds special sauce                                     │
│                                                                               │
│   You don't ask chef to wash vegetables                                      │
│   It happens AUTOMATICALLY before cooking!                                   │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Pre-Save Hook = Chef's Automatic Prep

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MONGOOSE PRE-SAVE HOOK                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   Your Code                    Mongoose Internal              Database       │
│   ─────────                    ────────────────              ────────        │
│                                                                               │
│   user.save()   →   [PRE-SAVE HOOK] → [VALIDATION] → [SAVE]   →   MongoDB   │
│                            ↑                                                  │
│                            │                                                  │
│                   YOUR CODE RUNS HERE!                                        │
│                   Before saving, automatically:                               │
│                   - Hash the password                                         │
│                   - Generate timestamps                                       │
│                   - Modify any field                                          │
│                                                                               │
│   You don't call hashPassword() manually                                      │
│   It happens AUTOMATICALLY before save!                                       │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### The Code Flow - Step by Step

```javascript
// STEP 1: You call save() in your route
const user = new User({ name: 'Ravi', email: 'ravi@x.com', password: 'ravi123' });
await user.save();  // <-- This triggers the hook!
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     WHAT HAPPENS WHEN user.save() IS CALLED                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   STEP 1: user.save() called                                                  │
│           { name: 'Ravi', email: 'ravi@x.com', password: 'ravi123' }         │
│                                      │                                        │
│                                      ▼                                        │
│   STEP 2: Mongoose checks: "Any PRE-SAVE hooks?"                             │
│           YES! We defined one: userSchema.pre('save', ...)                   │
│                                      │                                        │
│                                      ▼                                        │
│   STEP 3: PRE-SAVE HOOK RUNS                                                  │
│           Inside the hook, 'this' = the document being saved                 │
│                                                                               │
│           this.name = 'Ravi'                                                  │
│           this.email = 'ravi@x.com'                                          │
│           this.password = 'ravi123'  ← Original password                     │
│                                      │                                        │
│                                      ▼                                        │
│   STEP 4: Is password modified? this.isModified('password')                  │
│           - For NEW document = YES (all fields are "modified")               │
│           - For UPDATE where password changed = YES                           │
│           - For UPDATE where name changed but NOT password = NO              │
│                                      │                                        │
│                                      ▼                                        │
│   STEP 5: If YES, hash the password                                          │
│           this.password = '$2b$10$X4kv...' ← Now hashed!                     │
│                                      │                                        │
│                                      ▼                                        │
│   STEP 6: Call next() to continue                                            │
│           Without next(), save() hangs forever!                               │
│                                      │                                        │
│                                      ▼                                        │
│   STEP 7: Mongoose validates the document                                     │
│           Check required fields, types, etc.                                  │
│                                      │                                        │
│                                      ▼                                        │
│   STEP 8: Document saved to MongoDB                                          │
│           { name: 'Ravi', password: '$2b$10$X4kv...' }                       │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Why `this.isModified('password')`?

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     WHEN IS PASSWORD MODIFIED?                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   SCENARIO 1: New User Registration                                          │
│   ─────────────────────────────────                                           │
│   const user = new User({ name: 'Ravi', password: 'ravi123' });              │
│   await user.save();                                                          │
│                                                                               │
│   isModified('password') = TRUE   ← Password is new, hash it!                │
│                                                                               │
│   ─────────────────────────────────────────────────────────────────────────  │
│                                                                               │
│   SCENARIO 2: User Updates Name Only                                          │
│   ──────────────────────────────────                                          │
│   const user = await User.findById(id);                                       │
│   user.name = 'Ravi Shankar';  // Only name changed                          │
│   await user.save();                                                          │
│                                                                               │
│   isModified('password') = FALSE  ← Password not changed, skip hash!         │
│                                                                               │
│   WHY SKIP? Password is ALREADY hashed in database!                          │
│   If we hash again: hash(hash(password)) = WRONG!                            │
│   User could never login again!                                               │
│                                                                               │
│   ─────────────────────────────────────────────────────────────────────────  │
│                                                                               │
│   SCENARIO 3: User Changes Password                                           │
│   ─────────────────────────────────                                           │
│   const user = await User.findById(id);                                       │
│   user.password = 'newPassword456';  // Password changed!                    │
│   await user.save();                                                          │
│                                                                               │
│   isModified('password') = TRUE   ← Password changed, hash it!               │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### The `next()` Function - Callback vs Async

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   CALLBACK vs ASYNC (CRITICAL DIFFERENCE!)                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   OPTION 1: CALLBACK STYLE (uses next)                                       │
│   ─────────────────────────────────────                                       │
│                                                                               │
│   userSchema.pre('save', function(next) {                                    │
│       // Do synchronous work...                                               │
│       this.updatedAt = Date.now();                                            │
│       next();  // ← REQUIRED! Pass control to next middleware                │
│   });                                                                         │
│                                                                               │
│   ─────────────────────────────────────────────────────────────────────────  │
│                                                                               │
│   OPTION 2: ASYNC STYLE (NO next!)                                            │
│   ────────────────────────────────                                            │
│                                                                               │
│   userSchema.pre('save', async function() {   ← NO next parameter!           │
│       // Do async work...                                                     │
│       const salt = await bcrypt.genSalt(10);                                  │
│       this.password = await bcrypt.hash(this.password, salt);                │
│       // Just return - Mongoose handles it via Promise resolution            │
│   });                                                                         │
│                                                                               │
│   ─────────────────────────────────────────────────────────────────────────  │
│                                                                               │
│   ❌ WRONG: Mixing async with next()                                          │
│   ────────────────────────────────────                                        │
│                                                                               │
│   userSchema.pre('save', async function(next) {  ← DON'T DO THIS!            │
│       await someAsyncWork();                                                  │
│       next();  // ERROR: "next is not a function"                            │
│   });                                                                         │
│                                                                               │
│   WHY? Mongoose sees 'async' and ignores the next parameter.                 │
│   When you call next(), it's undefined → TypeError!                          │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### When to Use Which?

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CHOOSING THE RIGHT PATTERN                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   Use ASYNC when:                                                             │
│   • You need to await something (database query, API call, bcrypt)           │
│   • Modern, cleaner code                                                      │
│   • Most common in 2024+                                                      │
│                                                                               │
│   Use CALLBACK (next) when:                                                   │
│   • Synchronous operations only                                               │
│   • Legacy code compatibility                                                 │
│   • You need to pass an error: next(new Error('message'))                    │
│                                                                               │
│   ─────────────────────────────────────────────────────────────────────────  │
│                                                                               │
│   FOR PASSWORD HASHING → USE ASYNC (bcrypt is async)                         │
│                                                                               │
│   userSchema.pre('save', async function() {                                  │
│       if (!this.isModified('password')) return;  ← Early return if no change│
│       const salt = await bcrypt.genSalt(10);                                 │
│       this.password = await bcrypt.hash(this.password, salt);                │
│   });                                                                         │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```


### ⚠️ CRITICAL ORDER: Hooks BEFORE Model!

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ORDER OF OPERATIONS (VERY IMPORTANT!)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   ❌ WRONG ORDER (Common Mistake!):                                          │
│   ─────────────────────────────────                                           │
│                                                                               │
│   const userSchema = new mongoose.Schema({...});                             │
│   const User = mongoose.model('User', userSchema);  // Model created FIRST   │
│                                                                               │
│   userSchema.pre('save', ...);  // Hook added AFTER → IGNORED!              │
│                                                                               │
│   Result: Password NOT hashed! Hook never runs!                              │
│                                                                               │
│   ─────────────────────────────────────────────────────────────────────────  │
│                                                                               │
│   ✅ CORRECT ORDER:                                                           │
│   ─────────────────                                                           │
│                                                                               │
│   const userSchema = new mongoose.Schema({...});                             │
│                                                                               │
│   userSchema.pre('save', ...);   // Hook added FIRST                         │
│   userSchema.methods.comparePassword = ...;   // Methods FIRST               │
│                                                                               │
│   const User = mongoose.model('User', userSchema);  // Model created LAST    │
│                                                                               │
│   Result: Hook runs on every save! ✓                                         │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Variable Name Must Match!

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    VARIABLE NAME MUST MATCH!                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   ❌ WRONG (Case Mismatch):                                                   │
│   ─────────────────────────                                                   │
│                                                                               │
│   const userSchema = new mongoose.Schema({...});  // lowercase 'u'           │
│   UserSchema.pre('save', ...);  // capital 'U' → ReferenceError!             │
│                                                                               │
│   JavaScript is CASE SENSITIVE!                                               │
│   userSchema ≠ UserSchema ≠ USERSCHEMA                                       │
│                                                                               │
│   ─────────────────────────────────────────────────────────────────────────  │
│                                                                               │
│   ✅ CORRECT (Names Match):                                                   │
│   ──────────────────────────                                                  │
│                                                                               │
│   const userSchema = new mongoose.Schema({...});  // lowercase 'u'           │
│   userSchema.pre('save', ...);  // same lowercase 'u' ✓                      │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 🧠 Interview Questions: Pre-Save Hooks

**Q: "What is a Mongoose pre-save hook?"**
> A: It's middleware that runs automatically BEFORE a document is saved to MongoDB. We use it to modify data (like hashing passwords) without the calling code needing to know about it.

**Q: "Why do we check `isModified('password')`?"**
> A: To prevent double-hashing. If a user updates their name (not password), the already-hashed password would be hashed again, making it impossible to verify during login.

**Q: "What happens if you forget to call `next()`?"**
> A: The save operation hangs forever. `next()` tells Mongoose to proceed to the next middleware or the actual save operation.

**Q: "Why must hooks be defined before `mongoose.model()`?"**
> A: Once `mongoose.model()` is called, the schema is "compiled" into a model. Any hooks or methods added after that are ignored.

---

## 🔨 BUILD TIME: Let's Write the Code!

Now YOU will write the code. I'll explain everything, you type it.


---

## Step 3.1: Install New Dependencies

First, install bcrypt and jsonwebtoken:

```bash
cd creatorops-clone/server
npm install bcrypt jsonwebtoken
```

**What each package does:**
- `bcrypt` - Hashing passwords
- `jsonwebtoken` - Creating and verifying JWTs

---

## Step 3.2: Update User Model with Password Hashing

Open `models/User.js` and **add the pre-save hook** for password hashing.

Add this BEFORE the `module.exports` line:

```javascript
// ─────────────────────────────────────────────────────────────────────────────
// IMPORT BCRYPT (Add at top of file)
// ─────────────────────────────────────────────────────────────────────────────
const bcrypt = require('bcrypt');

// ─────────────────────────────────────────────────────────────────────────────
// PRE-SAVE HOOK: Hash password before saving
// ─────────────────────────────────────────────────────────────────────────────
//
// This runs EVERY time we call user.save()
// But we only want to hash if password was modified!
//
// Why? If user updates their name, we don't want to re-hash the already-hashed password
//

UserSchema.pre('save', async function(next) {
    // Skip if password wasn't modified
    // this.isModified('password') = Mongoose helper that checks if field changed
    if (!this.isModified('password')) {
        return next();
    }
    
    // Hash the password
    // bcrypt.genSalt(10) = Generate salt with cost factor 10
    // Higher number = slower but more secure
    // 10 is a good balance for most apps
    const salt = await bcrypt.genSalt(10);
    
    // bcrypt.hash(password, salt) = Hash password with salt
    // Result: "$2b$10$randomSalt.hashedPassword..."
    this.password = await bcrypt.hash(this.password, salt);
    
    // Continue to save
    next();
});

// ─────────────────────────────────────────────────────────────────────────────
// INSTANCE METHOD: Compare passwords
// ─────────────────────────────────────────────────────────────────────────────
//
// We add a method to the User model that compares an input password
// with the stored hashed password.
//
// Usage: await user.comparePassword('inputPassword')
// Returns: true if match, false if not
//

UserSchema.methods.comparePassword = async function(candidatePassword) {
    // bcrypt.compare() knows how to extract the salt from the stored hash
    // and compare correctly
    return await bcrypt.compare(candidatePassword, this.password);
};
```

---

## Step 3.3: Create middleware/ Folder

Create the folder structure:

```bash
cd creatorops-clone/server
mkdir middleware
```

---

## Step 3.4: Create Auth Middleware

Create file: `middleware/auth.js`

**Type this code yourself:**

```javascript
// ═══════════════════════════════════════════════════════════════════════════════
// 🔒 Auth Middleware
// ═══════════════════════════════════════════════════════════════════════════════
//
// This middleware protects routes that require authentication.
// It runs BEFORE the route handler and:
// 1. Extracts the token from the request header
// 2. Verifies the token is valid
// 3. Attaches the user data to the request
// 4. Allows the request to proceed (or rejects it)
//
// ═══════════════════════════════════════════════════════════════════════════════

const jwt = require('jsonwebtoken');

// ─────────────────────────────────────────────────────────────────────────────
// THE MIDDLEWARE FUNCTION
// ─────────────────────────────────────────────────────────────────────────────
//
// module.exports = function(...) makes this the default export
// When we import: const auth = require('./middleware/auth')
// 'auth' will be this function
//

module.exports = function(req, res, next) {
    
    // ─────────────────────────────────────────────────────────────────────────
    // STEP 1: Get token from header
    // ─────────────────────────────────────────────────────────────────────────
    //
    // Frontend sends: Header: { x-auth-token: "eyJ..." }
    // We extract it here
    //
    const token = req.header('x-auth-token');
    
    // ─────────────────────────────────────────────────────────────────────────
    // STEP 2: Check if token exists
    // ─────────────────────────────────────────────────────────────────────────
    //
    // No token = User not logged in
    // 401 = Unauthorized (no credentials provided)
    //
    if (!token) {
        return res.status(401).json({ 
            message: 'No token, authorization denied' 
        });
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // STEP 3: Verify token
    // ─────────────────────────────────────────────────────────────────────────
    //
    // jwt.verify() does THREE things:
    // 1. Checks if token format is valid
    // 2. Checks if token hasn't expired
    // 3. Checks if signature matches (wasn't tampered)
    //
    // If ANY check fails, it throws an error
    //
    try {
        // jwt.verify(token, secret) returns the decoded payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // decoded = { id: "userId123", iat: 1609459200, exp: 1609545600 }
        //             │                 │                 │
        //             │                 │                 └── Expiration time
        //             │                 └──────────────────── Issued at time
        //             └────────────────────────────────────── User ID we stored
        
        // ─────────────────────────────────────────────────────────────────────
        // STEP 4: Attach user to request
        // ─────────────────────────────────────────────────────────────────────
        //
        // Now every route handler can access req.user.id
        // This is how routes know WHICH user is making the request
        //
        req.user = decoded;
        
        // ─────────────────────────────────────────────────────────────────────
        // STEP 5: Continue to route handler
        // ─────────────────────────────────────────────────────────────────────
        //
        // next() = "I'm done, continue to the next middleware or route"
        //
        next();
        
    } catch (err) {
        // Token verification failed
        // Could be: expired, tampered, wrong secret, malformed
        // 401 = Unauthorized
        res.status(401).json({ 
            message: 'Token is not valid' 
        });
    }
};
```

---

## Step 3.5: Create routes/ Folder

Create the folder structure:

```bash
cd creatorops-clone/server
mkdir routes
```

---

## Step 3.6: Create Auth Routes

Create file: `routes/auth.js`

**Type this code yourself:**

```javascript
// ═══════════════════════════════════════════════════════════════════════════════
// 🔑 Auth Routes
// ═══════════════════════════════════════════════════════════════════════════════
//
// These routes handle:
// - POST /api/auth/register - Create new user
// - POST /api/auth/login    - Login existing user
// - GET  /api/auth/me       - Get current user (protected)
//
// ═══════════════════════════════════════════════════════════════════════════════

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// ─────────────────────────────────────────────────────────────────────────────
// CREATE ROUTER
// ─────────────────────────────────────────────────────────────────────────────
//
// express.Router() creates a mini-app for routes
// We can then attach this to main app with app.use('/api/auth', authRouter)
//
const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: Generate JWT Token
// ─────────────────────────────────────────────────────────────────────────────
//
// We'll use this in both register and login
// DRY = Don't Repeat Yourself
//
const generateToken = (userId) => {
    // jwt.sign(payload, secret, options)
    // payload = data to store in token (keep minimal!)
    // secret = your JWT_SECRET from .env
    // expiresIn = when token expires ('7d' = 7 days)
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTE 1: REGISTER
// ═══════════════════════════════════════════════════════════════════════════════
//
// POST /api/auth/register
// Body: { name, email, password }
// Returns: { token, user }
//
// Flow:
// 1. Check if email already exists
// 2. Create new user (password auto-hashed by pre-save hook)
// 3. Generate token
// 4. Send response
//

router.post('/register', async (req, res) => {
    try {
        // ─────────────────────────────────────────────────────────────────────
        // STEP 1: Extract data from request body
        // ─────────────────────────────────────────────────────────────────────
        const { name, email, password } = req.body;
        
        // ─────────────────────────────────────────────────────────────────────
        // STEP 2: Validate required fields
        // ─────────────────────────────────────────────────────────────────────
        if (!name || !email || !password) {
            return res.status(400).json({ 
                message: 'Please provide name, email, and password' 
            });
        }
        
        // ─────────────────────────────────────────────────────────────────────
        // STEP 3: Check if user already exists
        // ─────────────────────────────────────────────────────────────────────
        // User.findOne({ email }) = Find first document where email matches
        // Returns null if not found
        //
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                message: 'User already exists with this email' 
            });
        }
        
        // ─────────────────────────────────────────────────────────────────────
        // STEP 4: Create new user
        // ─────────────────────────────────────────────────────────────────────
        // new User({...}) = Create in memory (not saved yet)
        // user.save() = Save to database (triggers pre-save hook!)
        //
        const user = new User({
            name,
            email,
            password  // Will be hashed by pre-save hook!
        });
        
        await user.save();
        
        // ─────────────────────────────────────────────────────────────────────
        // STEP 5: Generate token
        // ─────────────────────────────────────────────────────────────────────
        const token = generateToken(user._id);
        
        // ─────────────────────────────────────────────────────────────────────
        // STEP 6: Send response
        // ─────────────────────────────────────────────────────────────────────
        // 201 = Created (resource was created successfully)
        // We send token AND user data (minus password)
        //
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
        
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ 
            message: 'Server error during registration' 
        });
    }
});

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTE 2: LOGIN
// ═══════════════════════════════════════════════════════════════════════════════
//
// POST /api/auth/login
// Body: { email, password }
// Returns: { token, user }
//
// Flow:
// 1. Find user by email
// 2. Compare password with hash
// 3. Generate token
// 4. Send response
//

router.post('/login', async (req, res) => {
    try {
        // ─────────────────────────────────────────────────────────────────────
        // STEP 1: Extract credentials
        // ─────────────────────────────────────────────────────────────────────
        const { email, password } = req.body;
        
        // ─────────────────────────────────────────────────────────────────────
        // STEP 2: Validate required fields
        // ─────────────────────────────────────────────────────────────────────
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Please provide email and password' 
            });
        }
        
        // ─────────────────────────────────────────────────────────────────────
        // STEP 3: Find user by email
        // ─────────────────────────────────────────────────────────────────────
        // Note: We need the password field for comparison
        // By default, we might exclude it (we'll add select: false later)
        //
        const user = await User.findOne({ email });
        if (!user) {
            // SECURITY: Don't reveal whether email exists or not
            // Same message for "email not found" and "wrong password"
            return res.status(400).json({ 
                message: 'Invalid credentials' 
            });
        }
        
        // ─────────────────────────────────────────────────────────────────────
        // STEP 4: Compare passwords
        // ─────────────────────────────────────────────────────────────────────
        // user.comparePassword() = Our custom method from User model
        // Returns true if password matches hash
        //
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ 
                message: 'Invalid credentials' 
            });
        }
        
        // ─────────────────────────────────────────────────────────────────────
        // STEP 5: Generate token
        // ─────────────────────────────────────────────────────────────────────
        const token = generateToken(user._id);
        
        // ─────────────────────────────────────────────────────────────────────
        // STEP 6: Send response
        // ─────────────────────────────────────────────────────────────────────
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
        
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ 
            message: 'Server error during login' 
        });
    }
});

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTE 3: GET CURRENT USER (Protected)
// ═══════════════════════════════════════════════════════════════════════════════
//
// GET /api/auth/me
// Header: x-auth-token
// Returns: user object
//
// This route is PROTECTED - requires valid token
// The 'auth' middleware runs first and adds req.user
//

router.get('/me', auth, async (req, res) => {
    // 'auth' middleware already verified token and added req.user
    // req.user = { id: "userId123", iat: ..., exp: ... }
    
    try {
        // ─────────────────────────────────────────────────────────────────────
        // Find user by ID (excluding password)
        // ─────────────────────────────────────────────────────────────────────
        // .select('-password') = Exclude password field from result
        // MongoDB will not return this field
        //
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                message: 'User not found' 
            });
        }
        
        res.json(user);
        
    } catch (err) {
        console.error('Get user error:', err);
        res.status(500).json({ 
            message: 'Server error' 
        });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT ROUTER
// ─────────────────────────────────────────────────────────────────────────────
module.exports = router;
```

---

## Step 3.7: Connect Auth Routes to Server

Open `server.js` and add the auth routes:

```javascript
// ─────────────────────────────────────────────────────────────────────────────
// IMPORT ROUTES (Add near top of file, after other imports)
// ─────────────────────────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth');

// ─────────────────────────────────────────────────────────────────────────────
// USE ROUTES (Add after middleware section, before app.listen)
// ─────────────────────────────────────────────────────────────────────────────
//
// app.use(path, router) = Mount router at path
// All routes in authRoutes will be prefixed with '/api/auth'
//
// router.post('/register') becomes: POST /api/auth/register
// router.post('/login')    becomes: POST /api/auth/login
// router.get('/me')        becomes: GET  /api/auth/me
//
app.use('/api/auth', authRoutes);
```

---

## Step 3.8: Update .env with JWT Secret

Add this to your `.env` file:

```env
# JWT Secret - MUST BE LONG AND RANDOM!
# In production, generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_super_secret_jwt_key_here_make_it_at_least_32_characters_long
```

---

## Step 3.9: Test Your Authentication!

Start your server:

```bash
npm run dev
```

### Test with curl or Postman:

**1. Register a new user:**
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ravi","email":"ravi@example.com","password":"password123"}'
```

**Expected response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Ravi",
    "email": "ravi@example.com",
    "role": "CREATOR"
  }
}
```

**2. Login with existing user:**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ravi@example.com","password":"password123"}'
```

**3. Get current user (with token):**
```bash
curl http://localhost:5001/api/auth/me \
  -H "x-auth-token: YOUR_TOKEN_HERE"
```

---

## ✅ VERIFICATION CHECKPOINT

Before moving on, verify:

1. [ ] bcrypt and jsonwebtoken installed
2. [ ] User model has pre-save hook for password hashing
3. [ ] User model has comparePassword method
4. [ ] middleware/auth.js created
5. [ ] routes/auth.js created with register, login, me
6. [ ] server.js imports and uses auth routes
7. [ ] .env has JWT_SECRET
8. [ ] Can register a new user
9. [ ] Can login with that user
10. [ ] Can access /api/auth/me with token

---

## ❓ Interview Questions

### 1. "Why do we hash passwords instead of encrypting them?"

> **Answer**: Hashing is one-way (can't reverse), encryption is two-way (can decrypt). For passwords, we never need to recover the original - we only need to verify a match. If passwords were encrypted, someone with the encryption key could decrypt all passwords. With hashing, even if the database is stolen, the passwords remain protected.

### 2. "What is bcrypt and why use it over other hash functions?"

> **Answer**: bcrypt is specifically designed for passwords. Unlike MD5 or SHA, bcrypt is intentionally slow (configurable via salt rounds) which makes brute-force attacks expensive. It also includes automatic salting. MD5/SHA are fast (bad for passwords) and can be cracked quickly with modern GPUs.

### 3. "Explain the JWT verification process"

> **Answer**: When the server receives a JWT, it: (1) Decodes the header and payload from Base64, (2) Recalculates the signature using the payload and secret key, (3) Compares with the received signature. If signatures match, the token is valid and unmodified. The server never stores JWTs - it just verifies them mathematically.

### 4. "Why do we use the same error message for 'user not found' and 'wrong password'?"

> **Answer**: Security through obscurity. If we said "user not found" for invalid emails and "wrong password" for wrong passwords, attackers could enumerate valid emails by checking which error they receive. Using a generic "Invalid credentials" prevents this information leakage.

### 5. "What happens if someone gets your JWT_SECRET?"

> **Answer**: They can: (1) Forge valid tokens for any user, (2) Sign in as admin without credentials, (3) Verify/decode all existing tokens. It's catastrophic! This is why JWT_SECRET must be long, random, never committed to version control, and different per environment.

### 6. "What is the purpose of auth middleware?"

> **Answer**: Auth middleware acts as a gatekeeper that runs before protected route handlers. It extracts the token from the request header, verifies its signature and expiration, decodes the payload, and attaches user data to the request object (req.user). This separation of concerns means route handlers don't need to know about authentication logic.

---

## 📝 PHASE 3: Complete Revision Notes

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                    PHASE 3: AUTHENTICATION - COMPLETE                          ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                                ║
║  PASSWORD SECURITY                                                             ║
║  ─────────────────                                                             ║
║  • NEVER store plain text                                                      ║
║  • bcrypt = hash + salt + configurable cost                                    ║
║  • Salt = random string preventing rainbow tables                              ║
║  • Cost factor (10) = how slow (slower = more secure)                          ║
║                                                                                ║
║  JWT STRUCTURE                                                                 ║
║  ─────────────                                                                 ║
║  • HEADER.PAYLOAD.SIGNATURE                                                    ║
║  • Header = algorithm info                                                     ║
║  • Payload = user data + timestamps                                            ║
║  • Signature = HMAC(header + payload, SECRET)                                  ║
║                                                                                ║
║  AUTH ENDPOINTS                                                                ║
║  ──────────────                                                                ║
║  • POST /api/auth/register → create user, return token                         ║
║  • POST /api/auth/login → verify password, return token                        ║
║  • GET  /api/auth/me → return current user (protected)                         ║
║                                                                                ║
║  MIDDLEWARE PATTERN                                                            ║
║  ─────────────────                                                             ║
║  • router.get('/me', auth, handler)                                            ║
║  • 'auth' runs first, verifies token, sets req.user                            ║
║  • 'handler' runs only if auth succeeds                                        ║
║                                                                                ║
║  STATUS CODES                                                                  ║
║  ────────────                                                                  ║
║  • 200 = OK (login success)                                                    ║
║  • 201 = Created (register success)                                            ║
║  • 400 = Bad Request (validation error)                                        ║
║  • 401 = Unauthorized (no token or invalid)                                    ║
║  • 500 = Server Error (catch block)                                            ║
║                                                                                ║
║  FILES CREATED                                                                 ║
║  ─────────────                                                                 ║
║  • middleware/auth.js - token verification                                     ║
║  • routes/auth.js - register, login, me                                        ║
║  • Updated models/User.js - pre-save hook, comparePassword                     ║
║  • Updated server.js - use auth routes                                         ║
║                                                                                ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

---

## 🎉 PHASE 3 COMPLETE!

**You have learned:**
- ✅ Why we hash passwords (security)
- ✅ How bcrypt and salt work
- ✅ JWT structure and security
- ✅ Complete auth flow (signup, login, protected)
- ✅ Middleware pattern for protected routes
- ✅ Security best practices

**You have built:**
- ✅ Password hashing with bcrypt
- ✅ JWT generation and verification
- ✅ Register endpoint
- ✅ Login endpoint
- ✅ Protected /me endpoint
- ✅ Auth middleware

---

## 🔜 NEXT: Phase 4 - CRUD API

In Phase 4, you will:
- Create Deal routes (CREATE, READ, UPDATE, DELETE)
- Create Deliverable routes
- Learn about route parameters
- Implement ownership checks (Authorization!)

**When all auth tests pass, say "START PHASE 4"!**
