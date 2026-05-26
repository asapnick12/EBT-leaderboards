# EBT Stake.us Leaderboard

Live wager leaderboard for **TreyLiving** using affiliate code **EBT** on Stake.us.

## Socials
- Kick: https://kick.com/treyliving
- Instagram: https://www.instagram.com/livingbinladen
- YouTube: https://www.youtube.com/@TreylivingLive
- Twitter: https://x.com/treylivingburna

## Setup

### 1. Connecting the Stake.us API
Once you have your affiliate API key, open `index.html` and find the marked section:

```js
// ─────────────────────────────────────────────
// SIMULATED API — replace with real Stake call
```

Replace `simulateApiCall()` with:

```js
async function fetchFromStake() {
  const res = await fetch('https://stake.us/api/affiliate/leaderboard', {
    headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
  });
  const data = await res.json();
  return data.players; // [{ name, wager }, ...]
}
```

### 2. Deploying
The site is a single `index.html` file — host it anywhere:

**Netlify (easiest):**
1. Go to netlify.com
2. Drag and drop the `index.html` file
3. Done — you get a live URL instantly

**GitHub Pages:**
1. Push this repo to GitHub
2. Go to Settings → Pages → Deploy from branch (master)
3. Your site will be live at `https://yourusername.github.io/ebt-leaderboard`

**Vercel:**
1. `npm i -g vercel`
2. Run `vercel` in this folder
3. Follow the prompts

## Leaderboard
- Refreshes every **1 hour**
- Shows total wagered, top players ranked by wager amount
- Gold/silver/bronze highlights for top 3
- Live feed indicator with countdown timer
