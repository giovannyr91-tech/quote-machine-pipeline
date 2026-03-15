function getMockData() {
  const t = Date.now();
  return {
    trend: { topic: "Mindful Mornings", context: "People are embracing slow, intentional morning routines to reduce anxiety and boost focus.", mood: "calming" },
    posts: [
      {
        quote: "The morning belongs to those who claim it with intention.",
        caption: "Your morning sets the tone for everything that follows. Before the world demands your attention, give yourself the gift of stillness. One mindful hour is worth ten rushed ones.",
        hashtags: "#mindfulmorning #morningroutine #intentionalliving #wellness #slowliving #morningmindset #selfcare #mindfulness #peacefulmorning #dailyritual",
        imageCategory: "sky",
        unsplashQuery: "golden hour sunrise mist",
        imageUrl: `https://loremflickr.com/1080/1080/sunrise,sky,mist?random=${t}`
      },
      {
        quote: "Stillness is not emptiness — it is where everything begins.",
        caption: "In a world that glorifies busy, choosing quiet is a radical act. Your best ideas, your clearest thoughts, they live in the spaces between noise. Protect your mornings.",
        hashtags: "#stillness #morningmeditation #calmmind #innerpeace #mindfullife #morningritual #breathe #presence #slowdown #mentalwellness",
        imageCategory: "nature",
        unsplashQuery: "misty forest morning light",
        imageUrl: `https://loremflickr.com/1080/1080/forest,mist,nature?random=${t + 1}`
      },
      {
        quote: "Water your roots before you face the storm.",
        caption: "Growth doesn't happen in the chaos — it happens in the preparation. A nourished mind, a rested body, a grateful heart: this is your armor. Start there, every single day.",
        hashtags: "#growthmindset #morningmotivation #rootsandwings #resilience #dailygrowth #mindsetshift #morningvibes #selfgrowth #wellness #flourish",
        imageCategory: "plants",
        unsplashQuery: "dewy leaves macro bokeh",
        imageUrl: `https://loremflickr.com/1080/1080/plants,leaves,green?random=${t + 2}`
      }
    ]
  };
}

const STYLE_GUIDES = {
  motivational: "powerful, action-driven, energizing — starts with a verb or bold statement",
  stoic:        "calm, philosophical, rooted in stoic wisdom — about control, endurance, and inner strength",
  poetic:       "lyrical, metaphorical, beautiful imagery — reads like a verse",
  bold:         "provocative, direct, slightly confrontational — challenges the reader",
  humorous:     "witty, clever, light-hearted — a smile-inducing truth",
  spiritual:    "transcendent, soulful, universal — connects the self to something larger",
  scientific:   "grounded in science or logic, uses analogy from nature or physics",
  minimal:      "ultra-short, 5 words max, punchy and unforgettable",
};

export default async (req) => {
  const ANTHROPIC_API_KEY = Netlify.env.get("ANTHROPIC_API_KEY");
  const url = new URL(req.url);
  const style = url.searchParams.get("style") || "motivational";
  const genre = url.searchParams.get("genre") || "";
  const suggestedImageCategory = url.searchParams.get("imageCategory") || "";
  const suggestedMood = url.searchParams.get("mood") || "";
  const styleGuide = STYLE_GUIDES[style] || STYLE_GUIDES.motivational;

  // Use mock data if no API key is set
  if (!ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify(getMockData()), {
      status: 200, headers: { "Content-Type": "application/json" }
    });
  }

  try {
    // Step 1: Get trending topic with web search
    const trendRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "web-search-2025-03-05"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 800,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{
          role: "user",
          content: `Search the web for what is trending today in motivation, mindset, wellness, or personal growth on social media. Return ONLY raw JSON, no markdown, no explanation:
{"topic":"short trending topic","context":"one sentence why it is trending today","mood":"energizing|calming|bold|reflective|uplifting"}`
        }]
      })
    });

    const trendData = await trendRes.json();
    if (trendData.error) return new Response(JSON.stringify(getMockData()), { status: 200, headers: { "Content-Type": "application/json" } });
    const trendText = trendData.content.filter(b => b.type === "text").map(b => b.text).join("");
    let trend;
    try {
      trend = JSON.parse(trendText.replace(/```json|```/g, "").trim());
    } catch {
      trend = { topic: "Daily Motivation", context: "People are seeking inspiration today.", mood: "energizing" };
    }

    // Step 2: Generate 3 posts with image search terms
    const categoryKeys = "nature, space, animals, plants, abstract, ocean, sky, mountains";
    const postsRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1400,
        messages: [{
          role: "user",
          content: `Create 3 Instagram inspirational quote posts about: "${trend.topic}" (${trend.context}). Mood: ${suggestedMood || trend.mood}.${genre ? ` Target audience/genre: ${genre}.` : ""}

Quote style: ${styleGuide}

For imageCategory pick ONE from: ${categoryKeys}
${suggestedImageCategory ? `Preferred image category: "${suggestedImageCategory}" — use this unless a different one clearly fits better.` : "Match quote emotion: growth/beginnings=nature or plants, courage/ambition=mountains or space, peace/calm=ocean or sky, wonder/creativity=abstract or space."}

For unsplashQuery write the best 2-3 word Unsplash search term for a cinematic, high-quality photo matching this quote's emotion. Be specific, e.g. "misty redwood forest", "barrel wave surfing", "alpine sunrise peaks".

Return ONLY a raw JSON array, no markdown:
[{"quote":"quote in the specified style, max 15 words","caption":"engaging 2-3 sentence caption tied to the trend","hashtags":"#tag1 #tag2 #tag3 #tag4 #tag5 #tag6 #tag7 #tag8 #tag9 #tag10","imageCategory":"category key","unsplashQuery":"specific cinematic 2-3 word search term"}]`
        }]
      })
    });

    const postsData = await postsRes.json();
    const postsText = postsData.content.filter(b => b.type === "text").map(b => b.text).join("");
    let posts;
    try {
      posts = JSON.parse(postsText.replace(/```json|```/g, "").trim());
    } catch {
      posts = [];
    }

    // Step 3: Fetch real Unsplash photos or fall back to loremflickr
    const UNSPLASH_KEY = Netlify.env.get("UNSPLASH_ACCESS_KEY");
    const postsWithImages = await Promise.all(posts.map(async (p, i) => {
      let imageUrl;
      if (UNSPLASH_KEY) {
        try {
          const uRes = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(p.unsplashQuery)}&per_page=5&orientation=squarish&client_id=${UNSPLASH_KEY}`
          );
          const uData = await uRes.json();
          const results = uData.results || [];
          const pick = results[i % results.length] || results[0];
          imageUrl = pick?.urls?.regular || null;
        } catch {}
      }
      if (!imageUrl) {
        imageUrl = `https://loremflickr.com/1080/1080/${encodeURIComponent(p.unsplashQuery.replace(/\s+/g, ","))}?random=${Date.now() + i * 999}`;
      }
      return { ...p, imageUrl };
    }));

    return new Response(JSON.stringify({ trend, posts: postsWithImages }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }
};

export const config = {
  path: "/api/generate"
};
