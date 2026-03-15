import { useState, useRef } from "react";
import html2canvas from "html2canvas";

const PEAK_TIMES = [
  { day: "Monday",    times: ["6:00 AM", "12:00 PM", "7:00 PM"] },
  { day: "Tuesday",   times: ["6:00 AM", "12:00 PM", "7:00 PM"] },
  { day: "Wednesday", times: ["7:00 AM", "1:00 PM",  "8:00 PM"] },
  { day: "Thursday",  times: ["7:00 AM", "1:00 PM",  "8:00 PM"] },
  { day: "Friday",    times: ["8:00 AM", "12:00 PM", "6:00 PM"] },
  { day: "Saturday",  times: ["9:00 AM", "2:00 PM",  "7:00 PM"] },
  { day: "Sunday",    times: ["10:00 AM","3:00 PM",  "6:00 PM"] },
];

const IMAGE_CATEGORIES = {
  // Nature
  nature:       { emoji: "🌿", label: "Forest",        group: "Nature"        },
  waterfall:    { emoji: "💧", label: "Waterfall",      group: "Nature"        },
  aurora:       { emoji: "🌌", label: "Aurora",         group: "Nature"        },
  canyon:       { emoji: "🏜️", label: "Canyon",         group: "Nature"        },
  jungle:       { emoji: "🌴", label: "Jungle",         group: "Nature"        },
  lavender:     { emoji: "💜", label: "Lavender",       group: "Nature"        },
  autumn:       { emoji: "🍂", label: "Autumn",         group: "Nature"        },
  // Sky & Water
  sky:          { emoji: "☁️", label: "Sky",            group: "Sky & Water"   },
  sunrise:      { emoji: "🌅", label: "Sunrise",        group: "Sky & Water"   },
  clouds:       { emoji: "🌤️", label: "Clouds",         group: "Sky & Water"   },
  ocean:        { emoji: "🌊", label: "Ocean",          group: "Sky & Water"   },
  beach:        { emoji: "🏖️", label: "Beach",          group: "Sky & Water"   },
  fog:          { emoji: "🌫️", label: "Fog",            group: "Sky & Water"   },
  // Land
  mountains:    { emoji: "⛰️", label: "Mountains",      group: "Land"          },
  snow:         { emoji: "❄️", label: "Snow",           group: "Land"          },
  desert:       { emoji: "🏔️", label: "Desert",         group: "Land"          },
  glacier:      { emoji: "🧊", label: "Glacier",        group: "Land"          },
  volcano:      { emoji: "🌋", label: "Volcano",        group: "Land"          },
  // Flora
  plants:       { emoji: "🌸", label: "Flowers",        group: "Flora"         },
  blossom:      { emoji: "🌺", label: "Blossom",        group: "Flora"         },
  // Animals
  animals:      { emoji: "🦋", label: "Wildlife",       group: "Animals"       },
  birds:        { emoji: "🦅", label: "Birds",          group: "Animals"       },
  lion:         { emoji: "🦁", label: "Lion",           group: "Animals"       },
  wolf:         { emoji: "🐺", label: "Wolf",           group: "Animals"       },
  horse:        { emoji: "🐎", label: "Horse",          group: "Animals"       },
  elephant:     { emoji: "🐘", label: "Elephant",       group: "Animals"       },
  tiger:        { emoji: "🐯", label: "Tiger",          group: "Animals"       },
  bear:         { emoji: "🐻", label: "Bear",           group: "Animals"       },
  dolphin:      { emoji: "🐬", label: "Dolphin",        group: "Animals"       },
  fox:          { emoji: "🦊", label: "Fox",            group: "Animals"       },
  // Urban & Built
  city:         { emoji: "🏙️", label: "City",           group: "Urban"         },
  neon:         { emoji: "🌃", label: "Neon City",      group: "Urban"         },
  architecture: { emoji: "🏛️", label: "Architecture",   group: "Urban"         },
  lighthouse:   { emoji: "🗼", label: "Lighthouse",     group: "Urban"         },
  // Mood & Style
  fire:         { emoji: "🔥", label: "Fire",           group: "Mood"          },
  rain:         { emoji: "🌧️", label: "Rain",           group: "Mood"          },
  lightning:    { emoji: "⚡", label: "Lightning",      group: "Mood"          },
  abstract:     { emoji: "✨", label: "Abstract",       group: "Mood"          },
  minimal:      { emoji: "🤍", label: "Minimal",        group: "Mood"          },
  // Cosmos & Retro
  space:        { emoji: "🚀", label: "Space",          group: "Cosmos"        },
  moon:         { emoji: "🌙", label: "Moon",           group: "Cosmos"        },
  vintage:      { emoji: "📷", label: "Vintage",        group: "Retro"         },
};

const UNSPLASH_TERMS = {
  nature:       "forest,nature",
  waterfall:    "waterfall,water",
  aurora:       "aurora,borealis",
  canyon:       "canyon,rock",
  jungle:       "jungle,tropical",
  lavender:     "lavender,field",
  autumn:       "autumn,leaves",
  sky:          "sky,sunset",
  sunrise:      "sunrise,golden",
  clouds:       "clouds,sky",
  ocean:        "ocean,waves",
  beach:        "beach,sand",
  fog:          "fog,mist",
  mountains:    "mountains,peaks",
  snow:         "snow,winter",
  desert:       "desert,sand",
  glacier:      "glacier,ice",
  volcano:      "volcano,lava",
  plants:       "flowers,botanical",
  blossom:      "cherry,blossom",
  animals:      "wildlife,animal",
  birds:        "eagle,bird",
  lion:         "lion,pride",
  wolf:         "wolf,wild",
  horse:        "horse,gallop",
  elephant:     "elephant,savanna",
  tiger:        "tiger,jungle",
  bear:         "bear,forest",
  dolphin:      "dolphin,ocean",
  fox:          "fox,nature",
  city:         "city,skyline",
  neon:         "neon,night",
  architecture: "architecture,building",
  lighthouse:   "lighthouse,coast",
  fire:         "fire,flame",
  rain:         "rain,storm",
  lightning:    "lightning,storm",
  abstract:     "abstract,colorful",
  minimal:      "minimal,white",
  space:        "galaxy,stars",
  moon:         "moon,night",
  vintage:      "vintage,retro",
};

const QUOTE_STYLES = {
  motivational: { emoji: "⚡", label: "Motivational", desc: "Action-driven & energizing" },
  stoic:        { emoji: "🏛️", label: "Stoic",        desc: "Calm, philosophical wisdom" },
  poetic:       { emoji: "🌙", label: "Poetic",       desc: "Lyrical & metaphorical" },
  bold:         { emoji: "🔥", label: "Bold",         desc: "Provocative & challenging" },
  humorous:     { emoji: "😄", label: "Humorous",     desc: "Witty & light-hearted" },
  spiritual:    { emoji: "✨", label: "Spiritual",    desc: "Soulful & transcendent" },
  scientific:   { emoji: "🔬", label: "Scientific",   desc: "Logic & nature analogies" },
  minimal:      { emoji: "🤍", label: "Minimal",      desc: "5 words. Maximum impact." },
};

const STYLE_GENRES = {
  motivational: [
    { emoji: "💪", label: "Fitness",         desc: "Gym, strength, endurance",    imageCategory: "mountains", mood: "energizing" },
    { emoji: "💼", label: "Business",        desc: "Hustle, success, wealth",      imageCategory: "city",      mood: "bold"       },
    { emoji: "❤️", label: "Relationships",   desc: "Love, connection, loyalty",    imageCategory: "plants",    mood: "uplifting"  },
    { emoji: "🌱", label: "Personal Growth", desc: "Habits, mindset, goals",       imageCategory: "nature",    mood: "calming"    },
    { emoji: "🎯", label: "Focus",           desc: "Discipline, clarity, drive",   imageCategory: "minimal",   mood: "bold"       },
    { emoji: "🏆", label: "Achievement",     desc: "Winning, milestones, legacy",  imageCategory: "sky",       mood: "energizing" },
  ],
  stoic: [
    { emoji: "⚔️", label: "Resilience",     desc: "Hardship, endurance, grit",    imageCategory: "mountains", mood: "bold"       },
    { emoji: "🧠", label: "Mindset",         desc: "Perception, control, reason",  imageCategory: "minimal",   mood: "reflective" },
    { emoji: "👑", label: "Leadership",      desc: "Duty, integrity, virtue",      imageCategory: "architecture", mood: "bold"    },
    { emoji: "⏳", label: "Time",            desc: "Mortality, urgency, patience", imageCategory: "desert",    mood: "reflective" },
    { emoji: "😤", label: "Anger",           desc: "Calm, restraint, perspective", imageCategory: "ocean",     mood: "calming"    },
    { emoji: "🔄", label: "Change",          desc: "Impermanence, adaptation",     imageCategory: "snow",      mood: "reflective" },
  ],
  poetic: [
    { emoji: "🌹", label: "Love",            desc: "Romance, longing, beauty",     imageCategory: "plants",    mood: "uplifting"  },
    { emoji: "🌿", label: "Nature",          desc: "Seasons, earth, solitude",     imageCategory: "nature",    mood: "calming"    },
    { emoji: "💔", label: "Heartbreak",      desc: "Loss, healing, letting go",    imageCategory: "rain",      mood: "reflective" },
    { emoji: "🌅", label: "Hope",            desc: "Dawn, new beginnings, light",  imageCategory: "sky",       mood: "uplifting"  },
    { emoji: "🌌", label: "Dreams",          desc: "Vision, wonder, imagination",  imageCategory: "space",     mood: "calming"    },
    { emoji: "🕊️", label: "Peace",           desc: "Stillness, inner calm, grace", imageCategory: "ocean",     mood: "calming"    },
  ],
  bold: [
    { emoji: "🚀", label: "Entrepreneurship", desc: "Risk, vision, disruption",    imageCategory: "city",      mood: "bold"       },
    { emoji: "💰", label: "Wealth",           desc: "Money, ambition, power",       imageCategory: "architecture", mood: "bold"   },
    { emoji: "🥊", label: "Competition",      desc: "Winning, beating odds",        imageCategory: "fire",      mood: "energizing" },
    { emoji: "🛑", label: "Anti-average",     desc: "Reject mediocrity",            imageCategory: "minimal",   mood: "bold"       },
    { emoji: "🌍", label: "Impact",           desc: "Change the world",             imageCategory: "space",     mood: "bold"       },
    { emoji: "🔑", label: "Freedom",          desc: "Independence, ownership",      imageCategory: "mountains", mood: "energizing" },
  ],
  humorous: [
    { emoji: "☕", label: "Coffee",           desc: "Monday mornings, caffeine",    imageCategory: "vintage",   mood: "uplifting"  },
    { emoji: "💻", label: "Work Life",        desc: "Meetings, deadlines, email",   imageCategory: "city",      mood: "uplifting"  },
    { emoji: "😴", label: "Adulting",         desc: "Taxes, sleep, responsibilities", imageCategory: "animals", mood: "uplifting"  },
    { emoji: "🍕", label: "Food",             desc: "Pizza, diet fails, cravings",  imageCategory: "abstract",  mood: "uplifting"  },
    { emoji: "📱", label: "Social Media",     desc: "Phones, followers, reels",     imageCategory: "minimal",   mood: "energizing" },
    { emoji: "🐱", label: "Pets",             desc: "Cats, dogs, animals",          imageCategory: "animals",   mood: "uplifting"  },
  ],
  spiritual: [
    { emoji: "🧘", label: "Meditation",       desc: "Breath, presence, stillness",  imageCategory: "ocean",     mood: "calming"    },
    { emoji: "🌙", label: "Universe",         desc: "Energy, cosmos, signs",        imageCategory: "space",     mood: "reflective" },
    { emoji: "💫", label: "Soul",             desc: "Purpose, inner truth",         imageCategory: "abstract",  mood: "reflective" },
    { emoji: "🙏", label: "Gratitude",        desc: "Blessings, abundance, thanks", imageCategory: "plants",    mood: "uplifting"  },
    { emoji: "🔮", label: "Intuition",        desc: "Inner knowing, trust, flow",   imageCategory: "sky",       mood: "calming"    },
    { emoji: "☯️", label: "Balance",          desc: "Harmony, yin & yang, unity",   imageCategory: "nature",    mood: "calming"    },
  ],
  scientific: [
    { emoji: "🌌", label: "Space",            desc: "Cosmos, stars, infinity",      imageCategory: "space",     mood: "reflective" },
    { emoji: "🧬", label: "Biology",          desc: "Life, evolution, nature",      imageCategory: "nature",    mood: "calming"    },
    { emoji: "⚛️", label: "Physics",          desc: "Energy, matter, time",         imageCategory: "abstract",  mood: "bold"       },
    { emoji: "🌊", label: "Nature",           desc: "Patterns, systems, ecology",   imageCategory: "ocean",     mood: "calming"    },
    { emoji: "🧪", label: "Discovery",        desc: "Curiosity, experiments, truth", imageCategory: "mountains", mood: "energizing" },
    { emoji: "🤖", label: "Technology",       desc: "AI, future, innovation",       imageCategory: "city",      mood: "bold"       },
  ],
  minimal: [
    { emoji: "🎯", label: "Purpose",          desc: "Why you exist",                imageCategory: "minimal",   mood: "bold"       },
    { emoji: "🤫", label: "Silence",          desc: "Less talk, more meaning",      imageCategory: "snow",      mood: "calming"    },
    { emoji: "⬛", label: "Darkness",         desc: "Struggle, shadow, depth",      imageCategory: "rain",      mood: "reflective" },
    { emoji: "🌤️", label: "Clarity",          desc: "Simple truths",                imageCategory: "sky",       mood: "uplifting"  },
    { emoji: "🔁", label: "Consistency",      desc: "Show up, repeat",              imageCategory: "desert",    mood: "reflective" },
    { emoji: "💡", label: "Ideas",            desc: "One spark, everything",        imageCategory: "fire",      mood: "energizing" },
  ],
};

const ASPECT_RATIOS = {
  square:    { label: "Square",    icon: "⬜", ratio: "1 / 1",   w: 1080, h: 1080, desc: "Instagram Feed" },
  story:     { label: "Story",     icon: "📱", ratio: "9 / 16",  w: 1080, h: 1920, desc: "IG / TikTok Story" },
  landscape: { label: "Landscape", icon: "🖥️", ratio: "16 / 9",  w: 1920, h: 1080, desc: "LinkedIn / Twitter" },
};

const MOOD_THEMES = {
  energizing: { gradient: "linear-gradient(135deg,#FF6B35,#F7C59F,#EFEFD0)", accent: "#FF6B35" },
  calming:    { gradient: "linear-gradient(135deg,#A8DADC,#457B9D,#1D3557)", accent: "#A8DADC" },
  bold:       { gradient: "linear-gradient(135deg,#E63946,#2B2D42,#8D99AE)", accent: "#E63946" },
  reflective: { gradient: "linear-gradient(135deg,#6B4226,#C9A87C,#F5E6CE)", accent: "#C9A87C" },
  uplifting:  { gradient: "linear-gradient(135deg,#F4E285,#F4A259,#8CB369)", accent: "#F4E285" },
};

function getNextThreeSlots() {
  const now = new Date();
  const slots = [];
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  let dayOffset = 0;
  while (slots.length < 3 && dayOffset < 14) {
    const checkDate = new Date(now);
    checkDate.setDate(now.getDate() + dayOffset);
    const dayName = days[checkDate.getDay()];
    const peakDay = PEAK_TIMES.find(d => d.day === dayName);
    if (peakDay) {
      for (const t of peakDay.times) {
        const [timePart, ampm] = t.split(" ");
        let [h, m] = timePart.split(":").map(Number);
        if (ampm === "PM" && h !== 12) h += 12;
        if (ampm === "AM" && h === 12) h = 0;
        const slotDate = new Date(checkDate);
        slotDate.setHours(h, m, 0, 0);
        if (slotDate > now) {
          slots.push(`${dayName}, ${slotDate.toLocaleDateString("en-US",{month:"short",day:"numeric"})} at ${t}`);
          if (slots.length === 3) break;
        }
      }
    }
    dayOffset++;
  }
  return slots;
}

function CategoryPill({ cat, selected, onClick }) {
  const info = IMAGE_CATEGORIES[cat];
  return (
    <button onClick={onClick} style={{
      padding: "6px 13px", borderRadius: "40px", cursor: "pointer",
      border: selected ? "2px solid #fff" : "2px solid rgba(255,255,255,0.15)",
      background: selected ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.05)",
      color: "#f0ece4", fontSize: "11px", fontFamily: "monospace",
      letterSpacing: "1px", transition: "all 0.18s", whiteSpace: "nowrap",
      display: "flex", alignItems: "center", gap: "5px"
    }}>
      {info.emoji} {info.label}
    </button>
  );
}

export default function App() {
  const [stage, setStage] = useState("idle");
  const [trend, setTrend] = useState(null);
  const [posts, setPosts] = useState([]);
  const [slots, setSlots] = useState([]);
  const [activePost, setActivePost] = useState(0);
  const [scheduled, setScheduled] = useState([]);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [imgLoaded, setImgLoaded] = useState([false, false, false]);
  const [imgError, setImgError] = useState([false, false, false]);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [quotePosition, setQuotePosition] = useState("bottom");
  const [selectedStyle, setSelectedStyle] = useState("motivational");
  const [selectedGenre, setSelectedGenre] = useState("Personal Growth");
  const [rewritingIdx, setRewritingIdx] = useState(null);
  const [selectedRatio, setSelectedRatio] = useState("square");
  const previewRef = useRef(null);

  const runPipeline = async () => {
    setStage("generating");
    setPosts([]); setScheduled([]); setActivePost(0);
    setImgLoaded([false,false,false]); setImgError([false,false,false]);
    setError(null);

    try {
      const genreData = (STYLE_GENRES[selectedStyle] || []).find(g => g.label === selectedGenre);
      const res = await fetch(`/api/generate?style=${selectedStyle}&genre=${encodeURIComponent(selectedGenre)}&imageCategory=${genreData?.imageCategory || ""}&mood=${genreData?.mood || ""}`);
      if (!res.ok) throw new Error("Generation failed");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setTrend(data.trend);
      setPosts(data.posts);
      setSlots(getNextThreeSlots());
      setStage("done");
    } catch (err) {
      setError(err.message);
      setStage("idle");
    }
  };

  const swapImage = async (idx, cat) => {
    const term = UNSPLASH_TERMS[cat] || cat;
    const loaded = [...imgLoaded]; loaded[idx] = false; setImgLoaded(loaded);
    const errs = [...imgError]; errs[idx] = false; setImgError(errs);

    let imageUrl = `https://loremflickr.com/1080/1080/${term}?random=${Date.now()}`;
    try {
      const res = await fetch(`/api/unsplash-search?query=${encodeURIComponent(term.replace(/,/g, " "))}`);
      if (res.ok) {
        const data = await res.json();
        if (data.urls?.length) imageUrl = data.urls[Math.floor(Math.random() * data.urls.length)];
      }
    } catch {}

    const updated = [...posts];
    updated[idx] = { ...updated[idx], imageCategory: cat, imageUrl };
    setPosts(updated);
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;
    setDownloading(true);
    const ratioInfo = ASPECT_RATIOS[selectedRatio];
    try {
      const canvas = await html2canvas(previewRef.current, {
        useCORS: true, allowTaint: true, scale: 2,
        width: previewRef.current.offsetWidth,
        height: previewRef.current.offsetHeight,
      });
      const link = document.createElement("a");
      link.download = `post-${activePost + 1}-${selectedRatio}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error(e);
    }
    setDownloading(false);
  };

  const rewriteQuote = async (idx) => {
    setRewritingIdx(idx);
    try {
      const topic = trend?.topic || "Daily Motivation";
      const res = await fetch(`/api/rewrite-quote?style=${selectedStyle}&genre=${encodeURIComponent(selectedGenre)}&topic=${encodeURIComponent(topic)}`);
      const data = await res.json();
      if (data.quote) {
        const updated = [...posts];
        updated[idx] = { ...updated[idx], quote: data.quote };
        setPosts(updated);
      }
    } catch {}
    setRewritingIdx(null);
  };

  const handleCopy = (idx) => {
    const p = posts[idx];
    navigator.clipboard.writeText(`"${p.quote}"\n\n${p.caption}\n\n${p.hashtags}`);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleSchedule = (idx) =>
    setScheduled(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);

  const activeGenreData = (STYLE_GENRES[selectedStyle] || []).find(g => g.label === selectedGenre);
  const mood = trend?.mood || activeGenreData?.mood || "energizing";
  const theme = MOOD_THEMES[mood] || MOOD_THEMES.energizing;
  const currentCat = posts[activePost]?.imageCategory || activeGenreData?.imageCategory || "nature";
  const catInfo = IMAGE_CATEGORIES[currentCat] || IMAGE_CATEGORIES.nature;

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0f", fontFamily:"Georgia,serif", color:"#f0ece4", overflowX:"hidden" }}>
      <style>{`
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes pulse { 0%,100%{opacity:0.3;transform:scale(1)} 50%{opacity:0.7;transform:scale(1.06)} }
        @keyframes fadeIn { from{opacity:0;transform:scale(1.02)} to{opacity:1;transform:scale(1)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @media(max-width:640px){ .pg{grid-template-columns:1fr!important} }
      `}</style>

      {/* HEADER */}
      <div style={{ background:theme.gradient, padding:"44px 32px 52px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.42)" }} />
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontSize:"10px", letterSpacing:"6px", textTransform:"uppercase", color:"rgba(255,255,255,0.6)", marginBottom:"10px", fontFamily:"monospace" }}>AI Content Pipeline</div>
          <h1 style={{ fontSize:"clamp(26px,5vw,50px)", fontWeight:"400", margin:"0 0 10px", letterSpacing:"-1px", textShadow:"0 2px 20px rgba(0,0,0,0.5)" }}>Quote Machine ✦</h1>
          <p style={{ fontSize:"14px", color:"rgba(255,255,255,0.72)", margin:"0 auto", maxWidth:"420px", lineHeight:1.6 }}>
            Trending topics · AI quotes · Real cinematic photos · Scheduled posts
          </p>
        </div>
      </div>

      <div style={{ maxWidth:"920px", margin:"0 auto", padding:"36px 20px 60px" }}>

        {/* TREND BADGE */}
        {trend && (
          <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"14px", padding:"14px 20px", marginBottom:"26px", display:"flex", alignItems:"center", gap:"14px", flexWrap:"wrap" }}>
            <div style={{ background:theme.gradient, borderRadius:"8px", padding:"5px 13px", fontSize:"11px", fontFamily:"monospace", letterSpacing:"2px", textTransform:"uppercase", fontWeight:"600", flexShrink:0 }}>🔥 Trending</div>
            <div style={{ flex:1, minWidth:"160px" }}>
              <div style={{ fontWeight:"600", fontSize:"15px" }}>{trend.topic}</div>
              <div style={{ fontSize:"12px", color:"rgba(240,236,228,0.5)", marginTop:"2px" }}>{trend.context}</div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"4px" }}>
              <div style={{ fontSize:"11px", fontFamily:"monospace", color:"rgba(240,236,228,0.38)", textTransform:"uppercase", letterSpacing:"2px" }}>mood: {trend.mood}</div>
              <div style={{ fontSize:"10px", fontFamily:"monospace", color:"rgba(240,236,228,0.28)", letterSpacing:"1px" }}>
                {QUOTE_STYLES[selectedStyle]?.emoji} {selectedStyle} · {selectedGenre}
              </div>
            </div>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div style={{ background:"rgba(220,60,60,0.12)", border:"1px solid rgba(220,60,60,0.3)", borderRadius:"12px", padding:"14px 18px", marginBottom:"20px", fontSize:"13px", color:"#f87171" }}>
            ⚠️ {error} — check that ANTHROPIC_API_KEY is set in Netlify environment variables.
          </div>
        )}

        {/* IDLE */}
        {stage === "idle" && (
          <div style={{ textAlign:"center", padding:"40px 0 52px" }}>

            {/* Step 1 — Quote Style */}
            <div style={{ marginBottom:"28px" }}>
              <div style={{ fontSize:"10px", letterSpacing:"4px", textTransform:"uppercase", fontFamily:"monospace", color:"rgba(240,236,228,0.38)", marginBottom:"14px" }}>
                Step 1 · Choose Style
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"10px" }}>
                {Object.entries(QUOTE_STYLES).map(([key, s]) => (
                  <button key={key} onClick={() => { setSelectedStyle(key); setSelectedGenre(STYLE_GENRES[key][0].label); }} style={{
                    padding:"10px 18px", borderRadius:"12px", cursor:"pointer",
                    border: selectedStyle === key ? `2px solid ${theme.accent}` : "2px solid rgba(255,255,255,0.1)",
                    background: selectedStyle === key ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
                    color: selectedStyle === key ? "#f0ece4" : "rgba(240,236,228,0.5)",
                    fontSize:"13px", fontFamily:"Georgia,serif", transition:"all 0.18s",
                    display:"flex", flexDirection:"column", alignItems:"center", gap:"4px", minWidth:"110px"
                  }}>
                    <span style={{ fontSize:"20px" }}>{s.emoji}</span>
                    <span style={{ fontWeight: selectedStyle === key ? "600" : "400" }}>{s.label}</span>
                    <span style={{ fontSize:"10px", fontFamily:"monospace", opacity:0.6 }}>{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2 — Genre */}
            <div style={{ marginBottom:"36px", maxWidth:"640px", margin:"0 auto 36px" }}>
              <div style={{ fontSize:"10px", letterSpacing:"4px", textTransform:"uppercase", fontFamily:"monospace", color:"rgba(240,236,228,0.38)", marginBottom:"14px" }}>
                Step 2 · Choose Genre
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"8px" }}>
                {(STYLE_GENRES[selectedStyle] || []).map(g => (
                  <button key={g.label} onClick={() => setSelectedGenre(g.label)} style={{
                    padding:"8px 16px", borderRadius:"40px", cursor:"pointer",
                    border: selectedGenre === g.label ? `2px solid ${theme.accent}` : "2px solid rgba(255,255,255,0.1)",
                    background: selectedGenre === g.label ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
                    color: selectedGenre === g.label ? "#f0ece4" : "rgba(240,236,228,0.45)",
                    fontSize:"12px", fontFamily:"monospace", letterSpacing:"0.5px",
                    transition:"all 0.18s", display:"flex", alignItems:"center", gap:"6px"
                  }}>
                    <span>{g.emoji}</span>
                    <span>{g.label}</span>
                  </button>
                ))}
              </div>
              {selectedGenre && (
                <div style={{ marginTop:"10px", fontSize:"11px", color:"rgba(240,236,228,0.28)", fontFamily:"monospace" }}>
                  {(STYLE_GENRES[selectedStyle] || []).find(g => g.label === selectedGenre)?.desc}
                </div>
              )}
            </div>

            <button onClick={runPipeline} style={{ background:theme.gradient, border:"none", borderRadius:"16px", padding:"20px 52px", fontSize:"16px", color:"#fff", cursor:"pointer", fontFamily:"Georgia,serif", letterSpacing:"1px", boxShadow:"0 8px 32px rgba(0,0,0,0.4)", transition:"transform 0.2s" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.04)"}}
              onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)"}}>
              {QUOTE_STYLES[selectedStyle].emoji} Generate {QUOTE_STYLES[selectedStyle].label} · {selectedGenre}
            </button>
            <p style={{ color:"rgba(240,236,228,0.3)", fontSize:"13px", marginTop:"14px" }}>Real cinematic photos · AI matched per quote</p>
          </div>
        )}

        {/* LOADING */}
        {stage === "generating" && (
          <div style={{ textAlign:"center", padding:"64px 20px" }}>
            <div style={{ width:"54px", height:"54px", borderRadius:"50%", border:"3px solid rgba(255,255,255,0.1)", borderTop:"3px solid #fff", animation:"spin 1s linear infinite", margin:"0 auto 20px" }} />
            <div style={{ fontSize:"17px", marginBottom:"6px" }}>✨ Searching trends &amp; writing posts...</div>
            <div style={{ color:"rgba(240,236,228,0.42)", fontSize:"13px" }}>Finding today's hottest topic and matching real photos</div>
          </div>
        )}

        {/* POSTS */}
        {stage === "done" && posts.length > 0 && (
          <>
            {/* Tabs */}
            <div style={{ display:"flex", gap:"8px", marginBottom:"22px", flexWrap:"wrap" }}>
              {posts.map((p,i) => {
                const pCat = IMAGE_CATEGORIES[p.imageCategory] || IMAGE_CATEGORIES.nature;
                return (
                  <button key={i} onClick={()=>setActivePost(i)} style={{
                    padding:"9px 20px", borderRadius:"40px",
                    border: activePost===i ? "2px solid rgba(255,255,255,0.85)" : "2px solid rgba(255,255,255,0.15)",
                    background: activePost===i ? "rgba(255,255,255,0.12)" : "transparent",
                    color:"#f0ece4", cursor:"pointer", fontSize:"12px",
                    fontFamily:"monospace", letterSpacing:"1px", transition:"all 0.18s",
                    display:"flex", alignItems:"center", gap:"6px"
                  }}>
                    {pCat.emoji} Post {i+1} {scheduled.includes(i) ? "✓" : ""}
                  </button>
                );
              })}
            </div>

            {posts[activePost] && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"22px", alignItems:"start" }} className="pg">

                {/* LEFT — PHOTO */}
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"9px" }}>
                    <span style={{ fontSize:"20px" }}>{catInfo.emoji}</span>
                    <span style={{ fontSize:"12px", fontFamily:"monospace", letterSpacing:"2px", textTransform:"uppercase", color:"rgba(240,236,228,0.55)" }}>{catInfo.label}</span>
                    <span style={{ marginLeft:"auto", fontSize:"10px", color:"rgba(240,236,228,0.28)", fontFamily:"monospace", background:"rgba(255,255,255,0.06)", padding:"2px 8px", borderRadius:"20px" }}>AUTO-MATCHED</span>
                  </div>

                  {/* Image container */}
                  <div ref={previewRef} style={{ aspectRatio: ASPECT_RATIOS[selectedRatio].ratio, borderRadius:"16px", overflow:"hidden", background:"#0d1117", position:"relative", maxHeight:"70vh", transition:"aspect-ratio 0.3s ease" }}>

                    {/* Shimmer */}
                    {!imgLoaded[activePost] && !imgError[activePost] && (
                      <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,#0d1117,#1a1f2e)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"16px" }}>
                        <div style={{ fontSize:"52px", animation:"pulse 2s ease-in-out infinite" }}>{catInfo.emoji}</div>
                        <div style={{ width:"140px", height:"2px", borderRadius:"99px", background:"rgba(255,255,255,0.06)", overflow:"hidden" }}>
                          <div style={{ height:"100%", borderRadius:"99px", backgroundImage:`linear-gradient(90deg,transparent,${theme.accent},transparent)`, backgroundSize:"200% 100%", animation:"shimmer 1.6s linear infinite" }} />
                        </div>
                        <div style={{ fontSize:"10px", fontFamily:"monospace", color:"rgba(255,255,255,0.25)", letterSpacing:"3px" }}>LOADING PHOTO</div>
                      </div>
                    )}

                    {/* Error */}
                    {imgError[activePost] && (
                      <div style={{ position:"absolute", inset:0, background:theme.gradient, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"14px" }}>
                        <div style={{ fontSize:"52px" }}>{catInfo.emoji}</div>
                        <div style={{ fontSize:"11px", fontFamily:"monospace", color:"rgba(255,255,255,0.6)", letterSpacing:"2px" }}>PHOTO UNAVAILABLE</div>
                        <button onClick={()=>swapImage(activePost, currentCat)} style={{ padding:"8px 22px", borderRadius:"20px", border:"1px solid rgba(255,255,255,0.35)", background:"rgba(0,0,0,0.3)", color:"#fff", cursor:"pointer", fontSize:"12px", fontFamily:"monospace" }}>
                          ↻ Try Another
                        </button>
                      </div>
                    )}

                    {/* Real photo */}
                    {posts[activePost].imageUrl && !imgError[activePost] && (
                      <img
                        key={posts[activePost].imageUrl}
                        src={posts[activePost].imageUrl}
                        alt={catInfo.label}
                        style={{ width:"100%", height:"100%", objectFit:"cover", opacity: imgLoaded[activePost] ? 1 : 0, transition:"opacity 0.8s ease", animation: imgLoaded[activePost] ? "fadeIn 0.8s ease" : "none" }}
                        onLoad={()=>{ const l=[...imgLoaded]; l[activePost]=true; setImgLoaded(l); }}
                        onError={()=>{ const e=[...imgError]; e[activePost]=true; setImgError(e); }}
                      />
                    )}

                    {/* Vignette */}
                    <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,0.5) 100%)", pointerEvents:"none" }} />

                    {/* Quote overlay */}
                    {quotePosition === "bottom" && (
                      <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"linear-gradient(transparent,rgba(0,0,0,0.88))", padding:"50px 16px 18px", borderRadius:"0 0 16px 16px", zIndex:2, pointerEvents:"none" }}>
                        <p style={{ margin:0, fontSize:"13px", fontStyle:"italic", lineHeight:1.65, color:"#fff", textShadow:"0 1px 10px rgba(0,0,0,1)" }}>"{posts[activePost].quote}"</p>
                      </div>
                    )}
                    {quotePosition === "center" && (
                      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px", zIndex:2, pointerEvents:"none" }}>
                        <p style={{ margin:0, fontSize:"15px", fontStyle:"italic", lineHeight:1.75, color:"#fff", textShadow:"0 2px 16px rgba(0,0,0,1)", textAlign:"center" }}>"{posts[activePost].quote}"</p>
                      </div>
                    )}
                    {quotePosition === "top" && (
                      <div style={{ position:"absolute", top:0, left:0, right:0, background:"linear-gradient(rgba(0,0,0,0.88),transparent)", padding:"18px 16px 50px", borderRadius:"16px 16px 0 0", zIndex:2, pointerEvents:"none" }}>
                        <p style={{ margin:0, fontSize:"13px", fontStyle:"italic", lineHeight:1.65, color:"#fff", textShadow:"0 1px 10px rgba(0,0,0,1)" }}>"{posts[activePost].quote}"</p>
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop:"7px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div style={{ fontSize:"10px", color:"rgba(240,236,228,0.22)", fontFamily:"monospace", letterSpacing:"1px" }}>
                      REAL PHOTO · {ASPECT_RATIOS[selectedRatio].w}×{ASPECT_RATIOS[selectedRatio].h}
                    </div>
                    <button onClick={handleDownload} disabled={downloading || !imgLoaded[activePost]} style={{
                      padding:"5px 14px", borderRadius:"20px", border:"1px solid rgba(255,255,255,0.2)",
                      background: downloading ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.08)",
                      color: imgLoaded[activePost] ? "#f0ece4" : "rgba(240,236,228,0.3)",
                      cursor: imgLoaded[activePost] ? "pointer" : "default",
                      fontSize:"11px", fontFamily:"monospace", letterSpacing:"1px", transition:"all 0.2s"
                    }}>
                      {downloading ? "⏳ Saving..." : "⬇ Download PNG"}
                    </button>
                  </div>

                  {/* Category switcher — grouped */}
                  <div style={{ marginTop:"14px" }}>
                    <div style={{ fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", fontFamily:"monospace", color:"rgba(240,236,228,0.35)", marginBottom:"10px" }}>Switch Photo Theme</div>
                    {Object.entries(
                      Object.entries(IMAGE_CATEGORIES).reduce((acc, [key, val]) => {
                        (acc[val.group] = acc[val.group] || []).push(key);
                        return acc;
                      }, {})
                    ).map(([group, keys]) => (
                      <div key={group} style={{ marginBottom:"10px" }}>
                        <div style={{ fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", fontFamily:"monospace", color:"rgba(240,236,228,0.22)", marginBottom:"5px" }}>{group}</div>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:"5px" }}>
                          {keys.map(cat => (
                            <CategoryPill key={cat} cat={cat} selected={currentCat === cat} onClick={() => swapImage(activePost, cat)} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Aspect ratio picker */}
                  <div style={{ marginTop:"14px" }}>
                    <div style={{ fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", fontFamily:"monospace", color:"rgba(240,236,228,0.35)", marginBottom:"8px" }}>Format</div>
                    <div style={{ display:"flex", gap:"6px" }}>
                      {Object.entries(ASPECT_RATIOS).map(([key, r]) => (
                        <button key={key} onClick={() => setSelectedRatio(key)} style={{
                          flex:1, padding:"8px 6px", borderRadius:"10px", cursor:"pointer",
                          border: selectedRatio === key ? "2px solid rgba(255,255,255,0.7)" : "2px solid rgba(255,255,255,0.12)",
                          background: selectedRatio === key ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.03)",
                          color: selectedRatio === key ? "#f0ece4" : "rgba(240,236,228,0.4)",
                          fontSize:"11px", fontFamily:"monospace", letterSpacing:"1px",
                          display:"flex", flexDirection:"column", alignItems:"center", gap:"3px", transition:"all 0.18s"
                        }}>
                          <span style={{ fontSize:"14px" }}>{r.icon}</span>
                          <span>{r.label}</span>
                          <span style={{ fontSize:"9px", opacity:0.6 }}>{r.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quote position picker */}
                  <div style={{ marginTop:"14px" }}>
                    <div style={{ fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", fontFamily:"monospace", color:"rgba(240,236,228,0.35)", marginBottom:"8px" }}>Quote Position</div>
                    <div style={{ display:"flex", gap:"6px" }}>
                      {[
                        { key:"top",    icon:"⬆", label:"Top"    },
                        { key:"center", icon:"⬛", label:"Center" },
                        { key:"bottom", icon:"⬇", label:"Bottom" },
                      ].map(p => (
                        <button key={p.key} onClick={() => setQuotePosition(p.key)} style={{
                          flex:1, padding:"8px 6px", borderRadius:"10px", cursor:"pointer",
                          border: quotePosition === p.key ? "2px solid rgba(255,255,255,0.7)" : "2px solid rgba(255,255,255,0.12)",
                          background: quotePosition === p.key ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.03)",
                          color: quotePosition === p.key ? "#f0ece4" : "rgba(240,236,228,0.4)",
                          fontSize:"11px", fontFamily:"monospace", letterSpacing:"1px",
                          display:"flex", flexDirection:"column", alignItems:"center", gap:"3px", transition:"all 0.18s"
                        }}>
                          <span style={{ fontSize:"14px" }}>{p.icon}</span>
                          <span>{p.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT — DETAILS */}
                <div style={{ display:"flex", flexDirection:"column", gap:"13px" }}>

                  <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:"12px", padding:"15px", borderLeft:`3px solid ${theme.accent}` }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"8px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                        <span style={{ fontSize:"13px" }}>{QUOTE_STYLES[selectedStyle]?.emoji}</span>
                        <span style={{ fontSize:"10px", letterSpacing:"3px", color:"rgba(240,236,228,0.38)", fontFamily:"monospace", textTransform:"uppercase" }}>
                          {QUOTE_STYLES[selectedStyle]?.label} Quote
                        </span>
                      </div>
                      <button onClick={() => rewriteQuote(activePost)} disabled={rewritingIdx === activePost} style={{
                        padding:"4px 12px", borderRadius:"20px", cursor: rewritingIdx === activePost ? "default" : "pointer",
                        border:"1px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.06)",
                        color:"rgba(240,236,228,0.7)", fontSize:"11px", fontFamily:"monospace", transition:"all 0.18s"
                      }}>
                        {rewritingIdx === activePost ? "✦ Writing..." : "↻ New Quote"}
                      </button>
                    </div>
                    <p style={{ margin:0, fontStyle:"italic", fontSize:"15px", lineHeight:1.65 }}>"{posts[activePost].quote}"</p>
                  </div>

                  <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:"12px", padding:"15px" }}>
                    <div style={{ fontSize:"10px", letterSpacing:"3px", color:"rgba(240,236,228,0.38)", marginBottom:"6px", fontFamily:"monospace", textTransform:"uppercase" }}>Caption</div>
                    <p style={{ margin:0, fontSize:"14px", lineHeight:1.75, color:"rgba(240,236,228,0.85)" }}>{posts[activePost].caption}</p>
                  </div>

                  <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:"12px", padding:"15px" }}>
                    <div style={{ fontSize:"10px", letterSpacing:"3px", color:"rgba(240,236,228,0.38)", marginBottom:"6px", fontFamily:"monospace", textTransform:"uppercase" }}>Hashtags</div>
                    <p style={{ margin:0, fontSize:"12px", color:"rgba(100,185,255,0.9)", lineHeight:1.9 }}>{posts[activePost].hashtags}</p>
                  </div>

                  <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:"12px", padding:"15px" }}>
                    <div style={{ fontSize:"10px", letterSpacing:"3px", color:"rgba(240,236,228,0.38)", marginBottom:"6px", fontFamily:"monospace", textTransform:"uppercase" }}>⏰ Peak Time</div>
                    <p style={{ margin:0, fontSize:"14px", fontWeight:"500" }}>📅 {slots[activePost] || "—"}</p>
                    <p style={{ margin:"3px 0 0", fontSize:"11px", color:"rgba(240,236,228,0.35)" }}>Based on Instagram peak engagement data</p>
                  </div>

                  <div style={{ display:"flex", gap:"10px" }}>
                    <button onClick={()=>handleCopy(activePost)} style={{ flex:1, padding:"12px", borderRadius:"10px", border:"1px solid rgba(255,255,255,0.18)", background: copiedIdx===activePost ? "rgba(100,220,100,0.16)" : "rgba(255,255,255,0.06)", color:"#f0ece4", cursor:"pointer", fontSize:"13px", fontFamily:"Georgia,serif", transition:"all 0.2s" }}>
                      {copiedIdx===activePost ? "✓ Copied!" : "📋 Copy Post"}
                    </button>
                    <button onClick={()=>handleSchedule(activePost)} style={{ flex:1, padding:"12px", borderRadius:"10px", border:"1px solid rgba(255,255,255,0.18)", background: scheduled.includes(activePost) ? "rgba(100,150,255,0.2)" : "rgba(255,255,255,0.06)", color:"#f0ece4", cursor:"pointer", fontSize:"13px", fontFamily:"Georgia,serif", transition:"all 0.2s" }}>
                      {scheduled.includes(activePost) ? "✓ Scheduled" : "📆 Schedule"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* QUEUE */}
            {scheduled.length > 0 && (
              <div style={{ marginTop:"30px", background:"linear-gradient(135deg,rgba(100,150,255,0.07),rgba(255,100,150,0.07))", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"16px", padding:"20px" }}>
                <div style={{ fontSize:"10px", letterSpacing:"4px", textTransform:"uppercase", fontFamily:"monospace", color:"rgba(240,236,228,0.42)", marginBottom:"14px" }}>
                  📅 Scheduled Queue ({scheduled.length} post{scheduled.length > 1 ? "s" : ""})
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:"9px" }}>
                  {scheduled.map(idx => {
                    const pCat = IMAGE_CATEGORIES[posts[idx]?.imageCategory] || IMAGE_CATEGORIES.nature;
                    return (
                      <div key={idx} style={{ display:"flex", alignItems:"center", gap:"13px", background:"rgba(255,255,255,0.05)", borderRadius:"10px", padding:"11px 15px" }}>
                        <div style={{ width:"36px", height:"36px", borderRadius:"10px", background:theme.gradient, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", flexShrink:0 }}>{pCat.emoji}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:"13px", fontStyle:"italic", marginBottom:"2px" }}>"{posts[idx]?.quote}"</div>
                          <div style={{ fontSize:"11px", color:"rgba(240,236,228,0.42)", fontFamily:"monospace" }}>{pCat.label} · {slots[idx]}</div>
                        </div>
                        <div style={{ fontSize:"18px" }}>✅</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ textAlign:"center", marginTop:"38px" }}>
              <button onClick={runPipeline} style={{ background:"transparent", border:"1px solid rgba(255,255,255,0.18)", borderRadius:"40px", padding:"12px 36px", color:"rgba(240,236,228,0.6)", cursor:"pointer", fontSize:"13px", fontFamily:"Georgia,serif", letterSpacing:"1px", transition:"all 0.2s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.5)";e.currentTarget.style.color="#f0ece4"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.18)";e.currentTarget.style.color="rgba(240,236,228,0.6)"}}>
                ↻ Generate New Posts
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
