const MOCK_QUOTES = {
  motivational: [
    "Every setback is a setup for a greater comeback.",
    "The only limit is the one you set for yourself.",
    "Progress, not perfection, is the goal.",
    "Show up fully — the rest will follow.",
  ],
  stoic: [
    "You cannot control the wave, only how you surf it.",
    "What is not in your power is not your problem.",
    "Endure today. Earn tomorrow.",
    "The obstacle is the path — walk through it.",
  ],
  poetic: [
    "Bloom quietly, the world will notice in time.",
    "Even broken things cast beautiful shadows.",
    "You are the poem the universe wrote on purpose.",
    "Let the silence between notes become music.",
  ],
  bold: [
    "Stop asking for permission to be extraordinary.",
    "Average is a choice. So is greatness.",
    "Your comfort zone is costing you everything.",
    "Go all in or stay home. There is no half.",
  ],
  humorous: [
    "I'm not procrastinating — I'm strategically delaying.",
    "Coffee: the original life hack.",
    "My energy is renewable. My patience, however, is not.",
    "Plot twist: you were the main character all along.",
  ],
  spiritual: [
    "You are not a drop in the ocean — you are the ocean.",
    "Every breath is a second chance.",
    "The universe conspires for those who believe.",
    "Be still and let the answers rise to you.",
  ],
  scientific: [
    "Like atoms, small actions create massive reactions.",
    "Entropy is natural — growth takes intention.",
    "You are made of stardust with a WiFi connection.",
    "Every great discovery started with one honest question.",
  ],
  minimal: [
    "Less noise. More signal.",
    "Do less. Mean more.",
    "Presence is the rarest gift.",
    "Be enough.",
  ],
};

export default async (req) => {
  const ANTHROPIC_API_KEY = Netlify.env.get("ANTHROPIC_API_KEY");
  const url = new URL(req.url);
  const style = url.searchParams.get("style") || "motivational";
  const genre = url.searchParams.get("genre") || "";
  const topic = url.searchParams.get("topic") || "Daily Motivation";

  if (!ANTHROPIC_API_KEY) {
    const pool = MOCK_QUOTES[style] || MOCK_QUOTES.motivational;
    const quote = pool[Math.floor(Math.random() * pool.length)];
    return new Response(JSON.stringify({ quote }), {
      status: 200, headers: { "Content-Type": "application/json" }
    });
  }

  const styleGuides = {
    motivational: "powerful, action-driven, energizing — starts with a verb or bold statement",
    stoic:        "calm, philosophical, rooted in stoic wisdom — about control, endurance, and inner strength",
    poetic:       "lyrical, metaphorical, beautiful imagery — reads like a verse",
    bold:         "provocative, direct, slightly confrontational — challenges the reader",
    humorous:     "witty, clever, light-hearted — a smile-inducing truth",
    spiritual:    "transcendent, soulful, universal — connects the self to something larger",
    scientific:   "grounded in science or logic, uses analogy from nature or physics",
    minimal:      "ultra-short, 5 words max, punchy and unforgettable",
  };

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 200,
        messages: [{
          role: "user",
          content: `Write ONE original inspirational quote about "${topic}"${genre ? ` for the ${genre} niche` : ""} in this style: ${styleGuides[style] || styleGuides.motivational}.
Max 15 words. Return ONLY the quote text, no quotation marks, no explanation.`
        }]
      })
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    const quote = data.content?.find(b => b.type === "text")?.text?.trim() || "";
    return new Response(JSON.stringify({ quote }), {
      status: 200, headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    const pool = MOCK_QUOTES[style] || MOCK_QUOTES.motivational;
    const quote = pool[Math.floor(Math.random() * pool.length)];
    return new Response(JSON.stringify({ quote }), {
      status: 200, headers: { "Content-Type": "application/json" }
    });
  }
};

export const config = { path: "/api/rewrite-quote" };
