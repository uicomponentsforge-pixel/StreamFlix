// StreamFlix catalogue: 14 full-length public-domain films (all over 1 hour).
// Videos are streamed from the Internet Archive (archive.org).
//
//  q    = title used to find the film on archive.org when the page loads
//  url  = (optional) a direct video link. If set, no lookup is needed.
//  Add your own title by adding one object. Posters are a gradient + emoji.

const MOVIES = [
  { id: 1,  title: "Night of the Living Dead", q: "Night of the Living Dead", year: 1968, genre: "Horror", rating: 7.8, len: "1h 35m", emoji: "🧟", c: ["#9ca3af", "#111827"],
    url: "https://archive.org/download/Night.Of.The.Living.Dead_1080p/NightOfTheLivingDead_720p_512kb.mp4",
    desc: "Strangers trapped in a farmhouse fight to survive the night as the recently dead begin to walk." },
  { id: 2,  title: "Nosferatu", q: "Nosferatu", year: 1922, genre: "Horror", rating: 7.9, len: "1h 34m", emoji: "🦇", c: ["#4ade80", "#052e16"],
    desc: "A silent-era vampire classic: a young clerk travels to a remote castle and brings something ancient home." },
  { id: 3,  title: "Charade", q: "Charade", year: 1963, genre: "Thriller", rating: 7.9, len: "1h 53m", emoji: "🎭", c: ["#f472b6", "#1e3a8a"],
    desc: "A widow in Paris is chased by men who want her late husband's money, and she can't tell who to trust." },
  { id: 4,  title: "His Girl Friday", q: "His Girl Friday", year: 1940, genre: "Comedy", rating: 7.8, len: "1h 32m", emoji: "📰", c: ["#fbbf24", "#7c2d12"],
    desc: "A fast-talking editor tries to win back his ex-wife and star reporter before she remarries." },
  { id: 5,  title: "Metropolis", q: "Metropolis", year: 1927, genre: "Sci-Fi", rating: 8.3, len: "2h 30m", emoji: "🏙️", c: ["#60a5fa", "#1e1b4b"],
    desc: "In a towering city of the future, the son of the ruler discovers the workers who keep it running below ground." },
  { id: 6,  title: "The General", q: "The General", year: 1926, genre: "Comedy", rating: 8.1, len: "1h 18m", emoji: "🚂", c: ["#fcd34d", "#3f3f46"],
    desc: "Buster Keaton chases a stolen locomotive across enemy lines in one of the great silent comedies." },
  { id: 7,  title: "Plan 9 from Outer Space", q: "Plan 9 from Outer Space", year: 1959, genre: "Sci-Fi", rating: 4.0, len: "1h 19m", emoji: "🛸", c: ["#a78bfa", "#0f172a"],
    desc: "Aliens raise the dead to stop humans from building a doomsday weapon. Famous for being gloriously bad." },
  { id: 8,  title: "The Cabinet of Dr. Caligari", q: "Cabinet of Dr. Caligari", year: 1920, genre: "Horror", rating: 8.0, len: "1h 16m", emoji: "🌀", c: ["#f87171", "#27272a"],
    desc: "A sinister showman and his sleepwalking attraction haunt a town in this twisted, expressionist landmark." },
  { id: 9,  title: "Carnival of Souls", q: "Carnival of Souls", year: 1962, genre: "Horror", rating: 7.0, len: "1h 18m", emoji: "🎪", c: ["#94a3b8", "#312e81"],
    desc: "After surviving a car crash, an organist is drawn to an abandoned pavilion by strange visions." },
  { id: 10, title: "D.O.A.", q: "D.O.A.", year: 1950, genre: "Thriller", rating: 7.1, len: "1h 23m", emoji: "🧪", c: ["#fb923c", "#1c1917"],
    desc: "Poisoned and given days to live, a man races to find out who murdered him and why." },
  { id: 11, title: "Detour", q: "Detour", year: 1945, genre: "Thriller", rating: 7.3, len: "1h 8m", emoji: "🛣️", c: ["#fdba74", "#44403c"],
    desc: "A hitchhiker crossing America gets tangled in a chain of bad luck that he can't talk his way out of." },
  { id: 12, title: "The Phantom of the Opera", q: "Phantom of the Opera", year: 1925, genre: "Horror", rating: 7.5, len: "1h 33m", emoji: "🎻", c: ["#e879f9", "#2e1065"],
    desc: "A disfigured composer haunts the Paris Opera and obsesses over a young singer." },
  { id: 13, title: "The Last Man on Earth", q: "Last Man on Earth", year: 1964, genre: "Sci-Fi", rating: 6.9, len: "1h 26m", emoji: "🌒", c: ["#38bdf8", "#172554"],
    desc: "The lone survivor of a plague spends his days hunting the infected and his nights barricaded at home." },
  { id: 14, title: "The Little Shop of Horrors", q: "Little Shop of Horrors", year: 1960, genre: "Comedy", rating: 6.0, len: "1h 10m", emoji: "🪴", c: ["#84cc16", "#14532d"],
    desc: "A timid florist's assistant grows a strange plant that talks, and demands to be fed." }
];

const GENRES = ["Horror", "Sci-Fi", "Comedy", "Thriller"];
