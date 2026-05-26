// ─────────────────────────────────────────────────────────────────
// Netlify Serverless Function — Stake.us Leaderboard Proxy
//
// This file runs on Netlify's servers, never in the browser.
// The API key is stored in Netlify's environment variables (private).
//
// To set your API key:
//   1. Go to your Netlify dashboard
//   2. Site Settings → Environment Variables
//   3. Add new variable:
//        Key:   STAKE_API_KEY
//        Value: your actual Stake.us affiliate API key
// ─────────────────────────────────────────────────────────────────

exports.handler = async function (event, context) {
  // Only allow GET requests
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  // Pull the API key from environment variables (never exposed to browser)
  const API_KEY = process.env.STAKE_API_KEY;

  if (!API_KEY) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "API key not configured. Add STAKE_API_KEY to Netlify environment variables." }),
    };
  }

  try {
    // ── REAL STAKE.US API CALL ──
    // Update this URL to the exact Stake.us affiliate leaderboard endpoint
    // once confirmed with your affiliate manager
    const response = await fetch("https://stake.us/api/affiliate/leaderboard", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Stake.us API returned ${response.status}`);
    }

    const data = await response.json();

    // ── NORMALISE THE RESPONSE ──
    // Adjust this mapping to match the actual shape of Stake.us API response
    // Expected output: [{ name: "username", wager: 50000 }, ...]
    const players = (data.players || data.data || []).map((p) => ({
      name: p.username || p.name || p.user,
      wager: parseFloat(p.totalWagered || p.wager || p.amount || 0),
    }));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        // Cache for 55 mins so repeated hits don't hammer Stake.us
        "Cache-Control": "public, max-age=3300",
      },
      body: JSON.stringify({ players }),
    };

  } catch (error) {
    console.error("Stake.us API error:", error.message);
    return {
      statusCode: 502,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Failed to fetch leaderboard data", detail: error.message }),
    };
  }
};
