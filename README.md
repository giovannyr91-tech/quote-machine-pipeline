# Quote Machine ✦ — AI Content Pipeline

An AI-powered Instagram content pipeline that finds today's trending topics, writes inspirational quotes, matches real cinematic photos, and schedules posts at peak engagement times.

---

## What This App Does

1. **Searches trending topics** — uses Anthropic web search to find what's hot today in motivation, mindset, and wellness
2. **Generates 3 posts** — each with a quote, caption, and 10 hashtags tailored to the trend
3. **Matches real photos** — pulls cinematic images from Unsplash matched to each quote's emotion
4. **Schedules automatically** — assigns each post to the next available Instagram peak engagement time slot
5. **Copy & schedule** — one tap to copy a post or add it to your queue

---

## Tech Stack

| Layer | Tool | Purpose |
|---|---|---|
| Frontend | React + Vite | UI |
| Backend | Netlify Serverless Functions | API calls (keeps key secret) |
| AI | Anthropic Claude API | Trend search + post generation |
| Photos | Unsplash Source API | Real cinematic images |
| Hosting | Netlify | Deployment |

---

## Project Structure

```
quote-pipeline/
├── index.html                        # HTML entry point
├── vite.config.js                    # Vite config
├── netlify.toml                      # Netlify build + functions config
├── package.json                      # Dependencies
├── src/
│   ├── main.jsx                      # React entry point
│   └── App.jsx                       # Main UI — all frontend logic + design
└── netlify/
    └── functions/
        └── generate.mjs              # Serverless function — AI + image logic
```

---

## Key Files Explained

### `src/App.jsx`
The entire frontend. Contains:
- `IMAGE_CATEGORIES` — 8 themes (nature, space, animals, plants, abstract, ocean, sky, mountains) each with emoji, label, and Unsplash search terms
- `MOOD_THEMES` — color gradients per mood (energizing, calming, bold, reflective, uplifting)
- `PEAK_TIMES` — Instagram peak engagement times per day of week
- `App()` — main component with all state, UI, and interactions
- Post tabs, image viewer, quote/caption/hashtag display, schedule queue

### `netlify/functions/generate.mjs`
The backend serverless function. Runs at `/api/generate`. Does:
1. Calls Anthropic API with web search to get today's trending topic + mood
2. Calls Anthropic API again to generate 3 posts with image search terms
3. Builds Unsplash photo URLs server-side (avoids CORS)
4. Returns `{ trend, posts }` JSON to the frontend

---

## Environment Variables

Set these in Netlify dashboard → Site configuration → Environment variables:

| Key | Value | Where to get it |
|---|---|---|
| `ANTHROPIC_API_KEY` | `sk-ant-...` | console.anthropic.com |

For local dev, create a `.env` file in the project root:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

---

## Local Development

```bash
# Install dependencies
npm install

# Start local dev server (hot reload)
npm run dev
# Opens at http://localhost:5173

# The Netlify function runs automatically via Vite proxy
```

---

## Deploy to Netlify

The site is already created at: **quote-machine-pipeline.netlify.app**
Netlify Site ID: `27df9f07-4755-4bb6-8bca-1082ade89be0`

To deploy after making changes:
```bash
npx -y @netlify/mcp@latest --site-id 27df9f07-4755-4bb6-8bca-1082ade89be0
```

Or push to GitHub and connect the repo in Netlify for automatic deploys on every commit.

---

## Feature Ideas / Roadmap

These are features that could be added next:

- [ ] **Auto-post to Instagram** via Instagram Graph API
- [ ] **Save post history** using Netlify Blobs or Supabase
- [ ] **Custom branding** — add logo, brand colors, font overlay on images
- [ ] **More post formats** — Reels scripts, Stories, carousel captions
- [ ] **Niche selector** — fitness, food, business, travel instead of just motivation
- [ ] **Download post as image** — render quote + photo as a downloadable PNG
- [ ] **Email digest** — weekly summary of scheduled posts via email
- [ ] **Analytics tab** — track which post types perform best
- [ ] **Multi-platform** — adapt captions for Twitter/X, LinkedIn, TikTok

---

## Design System

- **Background:** `#0a0a0f` (near black)
- **Text:** `#f0ece4` (warm white)
- **Font:** Georgia (serif) for body, monospace for labels
- **Accent colors:** mood-driven gradients (orange, blue, red, gold, green)
- **Border radius:** 12–16px cards, 40px pills
- **Spacing:** 20px padding, 13–22px gaps

---

## How the AI Prompt Works

**Trend search prompt** → returns `{ topic, context, mood }`

**Post generation prompt** → for each post returns:
```json
{
  "quote": "powerful quote max 15 words",
  "caption": "2-3 sentence Instagram caption",
  "hashtags": "#tag1 #tag2 ... #tag10",
  "imageCategory": "nature|space|animals|plants|abstract|ocean|sky|mountains",
  "unsplashQuery": "specific 2-3 word cinematic search term"
}
```

The `unsplashQuery` is matched to the quote's emotional tone — e.g. a courage quote → "alpine sunrise peaks", a peace quote → "calm ocean horizon".

---

## Built With Claude

This project was built entirely through conversation with Claude (claude.ai) as a demonstration of AI content pipeline automation — showing how local businesses and creators can use AI tools to generate, schedule, and manage social media content.
