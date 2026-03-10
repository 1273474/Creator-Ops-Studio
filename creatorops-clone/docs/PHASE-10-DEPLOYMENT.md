# 🚀 Phase 10: Deployment Fixes

> **Goal**: Fix your existing Render and Vercel deployments so they communicate perfectly in production without having to delete them!

---

## 📖 STORY TIME: The Two Islands

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    THE TWO ISLANDS (Production)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   Right now, you have two islands that don't know how to talk:               │
│                                                                               │
│   🏝️ VERCEL ISLAND (Frontend)                                                 │
│   - Your React app lives here.                                                │
│   - Right now, it's yelling: "Hey localhost:5001, give me data!"             │
│   - But "localhost" means "my own computer." Vercel is looking at itself!    │
│                                                                               │
│   🏝️ RENDER ISLAND (Backend)                                                  │
│   - Your Express API lives here.                                              │
│   - It's awake, but its border patrol (CORS) says: "I only trust             │
│     localhost:5173. I don't know who this Vercel guy is. BLOCKED!"           │
│   - Also, it forgot its passwords (MONGO_URI, JWT_SECRET) because            │
│     your .env file wasn't uploaded (and shouldn't be!).                      │
│                                                                               │
│   THE FIX:                                                                    │
│   1. Give Vercel a map (Environment Variable) to find Render.                 │
│   2. Tell Render's border patrol (CORS) to allow Vercel.                      │
│   3. Give Render its secret passwords via its dashboard.                      │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🛠️ Step 1: Fix Frontend API URL

Right now, your frontend is hardcoded to look for the backend on your laptop (`localhost:5001`). We need it to use a variable so it works both on your laptop AND on Vercel.

**File:** `client/src/api/api.js`

**Update your code to look like this:**

```javascript
import axios from 'axios';

// Vite uses import.meta.env for environment variables
// It will use VITE_API_URL if it exists (on Vercel), OR localhost (on your laptop)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_URL, // Use the dynamic URL!
    headers: { 'Content-Type': 'application/json' }
});

// ... keep your interceptors exactly the same!
```

## 🛠️ Step 2: Fix Backend CORS

Your backend needs to be told that your Vercel URL is a safe place to accept requests from.

**File:** `server/server.js`

**Update your CORS configuration:**

```javascript
// ... top of file

// ALLOW VERCEL TO TALK TO RENDER
app.use(cors({
    origin: [
        'http://localhost:5173', // Your local React app
        'https://creator-ops-studio.vercel.app' // ADD YOUR EXACT VERCEL URL HERE (no slash at the end!)
    ],
    credentials: true // Important for cookies/tokens if you use them later
}));

// ... rest of your server.js
```

*(Note: Check your specific Vercel URL from your dashboard. If Vercel gave you a slightly different URL like `creator-ops-studio-[randomletters]-yourname.vercel.app`, use the short, main one).*

## 🛠️ Step 3: Add Variables to Render (Backend)

Render doesn't have your `.env` file (because it's in `.gitignore`, which is good!). We have to type them into the Render dashboard manually.

1. Go to your **Render Dashboard** → click your web service (`Creator-Ops-Studio`).
2. Click **Environment** on the left menu.
3. Click "Add Environment Variable" and add these two:
   - **Key:** `MONGO_URI` | **Value:** *(paste your MongoDB connection string from your local `server/.env`)*
   - **Key:** `JWT_SECRET` | **Value:** *(paste your secret string from your local `server/.env`)*
4. Click **Save Changes**. (Render will automatically restart your server).

## 🛠️ Step 4: Add Variables to Vercel (Frontend)

Vercel needs to know the exact URL of your Render backend so it can pass it to `import.meta.env.VITE_API_URL`.

1. Go to your **Vercel Dashboard** → click your project.
2. Click **Settings** → **Environment Variables** (on the left menu).
3. Add the variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://creator-ops-studio.onrender.com/api` *(Make sure to use YOUR exact Render URL and add `/api` at the end! No trailing `/` at the very end.)*
4. Click **Save**.
5. **IMPORTANT:** Because Vercel bakes variable values into the "build", just saving the variable isn't enough. We have to trigger a new build by pushing new code! (Which we'll do in the next step).

## 🚀 Step 5: Push to Auto-Deploy!

Because you connected GitHub to Render and Vercel, simply pushing your code will update everything!

Run these in your terminal from the root folder:
```bash
git add .
git commit -m "fix: updated CORS and dynamic API URL for production"
git push origin main
```

**What will happen next?**
1. Vercel will see the push and rebuild the frontend (now baking in the `VITE_API_URL`).
2. Render will see the push and rebuild the backend (now allowing your Vercel origin).
3. Wait about 3-4 minutes for both to finish.
4. Visit your Vercel URL and try logging in! 🎉
