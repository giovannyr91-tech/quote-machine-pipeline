export default async (req) => {
  const UNSPLASH_KEY = Netlify.env.get("UNSPLASH_ACCESS_KEY");
  if (!UNSPLASH_KEY) {
    return new Response(JSON.stringify({ error: "No Unsplash key" }), {
      status: 400, headers: { "Content-Type": "application/json" }
    });
  }

  const url = new URL(req.url);
  const query = url.searchParams.get("query") || "nature";

  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=9&orientation=squarish&client_id=${UNSPLASH_KEY}`
  );
  const data = await res.json();
  const urls = (data.results || []).map(r => r.urls.regular);

  return new Response(JSON.stringify({ urls }), {
    status: 200, headers: { "Content-Type": "application/json" }
  });
};

export const config = { path: "/api/unsplash-search" };
