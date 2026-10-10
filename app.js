/* StreamFlix: hash router + localStorage. Data lives in data.js */
(() => {
  // ---------- storage helpers (safe if localStorage is blocked) ----------
  const store = {
    get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };

  const $ = (s, el = document) => el.querySelector(s);
  const app = $("#app");
  let favs = store.get("sf:favs", []);       // [movieId, ...]
  let prog = store.get("sf:prog", {});       // { movieId: { t, d } }
  let genre = "All";
  let query = "";

  const byId = id => MOVIES.find(m => m.id === Number(id));

  // ---------- theme ----------
  const systemLight = matchMedia("(prefers-color-scheme: light)").matches;
  function setTheme(t) {
    document.documentElement.dataset.theme = t;
    $("#themeBtn").textContent = t === "dark" ? "🌙" : "☀️";
    store.set("sf:theme", t);
  }
  setTheme(store.get("sf:theme", systemLight ? "light" : "dark"));
  $("#themeBtn").addEventListener("click", () =>
    setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));

  // ---------- small UI helpers ----------
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2000);
  }
  const isFav = id => favs.includes(id);
  function updateCount() { $("#favCount").textContent = favs.length; }

  function toggleFav(id) {
    const m = byId(id);
    favs = isFav(id) ? favs.filter(x => x !== id) : [...favs, id];
    store.set("sf:favs", favs);
    updateCount();
    toast(isFav(id) ? `Added ${m.title} to My List` : `Removed ${m.title} from My List`);
    if (currentPage() === "favorites") return route();
    document.querySelectorAll(`[data-fav="${id}"]`).forEach(b => {
      b.classList.toggle("on", isFav(id));
      b.setAttribute("aria-pressed", isFav(id));
      b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop");
    });
    document.querySelectorAll(`[data-fav-btn="${id}"]`).forEach(b => {
      b.classList.toggle("on", isFav(id));
      b.textContent = isFav(id) ? "✓ In My List" : "+ Add to My List";
    });
  }

  // ---------- templates ----------
  function card(m) {
    const p = prog[m.id];
    const pct = p && p.d ? Math.min(100, Math.round((p.t / p.d) * 100)) : 0;
    return `
      <article class="card">
        <a class="poster" href="#/watch/${m.id}" style="--a:${m.c[0]};--b:${m.c[1]}" aria-label="Watch ${m.title}">
          <span class="emoji" aria-hidden="true">${m.emoji}</span>
          ${m.demo ? '<span class="demo">Demo</span>' : ""}
          <span class="rating">★ ${m.rating}</span>
          ${pct > 3 && pct < 96 ? `<span class="bar"><i style="width:${pct}%"></i></span>` : ""}
        </a>
        <button class="fav ${isFav(m.id) ? "on" : ""}" data-fav="${m.id}" aria-pressed="${isFav(m.id)}"
                aria-label="Toggle ${m.title} in My List">♥</button>
        <h3>${m.title}</h3>
        <p>${m.year}, ${m.genre}</p>
      </article>`;
  }
  const row = list => `<div class="row">${list.map(card).join("")}</div>`;
  const grid = list => `<div class="grid">${list.map(card).join("")}</div>`;
  const section = (title, body, sub = "") =>
    `<section class="section"><div class="section-head"><h2>${title}</h2><span class="sub">${sub}</span></div>${body}</section>`;

  // ---------- pages ----------
  function viewHome() {
    const hero = [...MOVIES].sort((a, b) => b.rating - a.rating)[0];
    const chips = ["All", ...GENRES].map(g =>
      `<button class="chip" data-genre="${g}" aria-pressed="${g === genre}">${g}</button>`).join("");

    let html = `
      <section class="hero" style="--a:${hero.c[0]};--b:${hero.c[1]}">
        <span class="hero-emoji" aria-hidden="true">${hero.emoji}</span>
        <div class="hero-body">
          <p class="hero-meta">Top rated · ${hero.year} · ${hero.genre} · ${hero.len}</p>
          <h1>${hero.title}</h1>
          <p>${hero.desc}</p>
          <a class="btn primary" href="#/watch/${hero.id}">▶ Play</a>
          <button class="btn ghost ${isFav(hero.id) ? "on" : ""}" data-fav-btn="${hero.id}">${isFav(hero.id) ? "✓ In My List" : "+ Add to My List"}</button>
        </div>
      </section>
      <div class="chips" role="group" aria-label="Filter by genre">${chips}</div>`;

    if (genre !== "All") {
      const list = MOVIES.filter(m => m.genre === genre);
      return html + section(genre, grid(list), `${list.length} titles`);
    }

    const cont = MOVIES.filter(m => prog[m.id] && prog[m.id].t > 5 && prog[m.id].t / prog[m.id].d < 0.96);
    if (cont.length) html += section("Continue watching", row(cont));
    html += section("Trending now", row([...MOVIES].sort((a, b) => b.rating - a.rating).slice(0, 8)));
    GENRES.forEach(g => {
      const list = MOVIES.filter(m => m.genre === g);
      if (list.length > 1) html += section(g, row(list));
    });
    return html;
  }

  function viewSearch() {
    const q = query.trim().toLowerCase();
    const list = q
      ? MOVIES.filter(m => [m.title, m.genre, m.year, m.desc].join(" ").toLowerCase().includes(q))
      : MOVIES;
    const title = q ? `Results for “${query.trim()}”` : "Browse everything";
    if (!list.length) return `<div class="empty"><div class="big">🔎</div><h2>No matches for “${query.trim()}”</h2>
      <p>Try a title, a genre like Sci-Fi, or a year.</p><a class="btn primary" href="#/">Back to Home</a></div>`;
    return section(title, grid(list), `${list.length} found`);
  }

  function viewFavorites() {
    const list = MOVIES.filter(m => isFav(m.id));
    if (!list.length) return `<div class="empty"><div class="big">🍿</div><h2>Your list is empty</h2>
      <p>Tap the ♥ on any title to save it here.</p><a class="btn primary" href="#/">Find something to watch</a></div>`;
    return section("My List", grid(list), `${list.length} saved`);
  }

  function viewWatch(id) {
    const m = byId(id);
    if (!m) return `<div class="empty"><div class="big">🎞️</div><h2>Title not found</h2><a class="btn primary" href="#/">Go Home</a></div>`;
    const related = MOVIES.filter(x => x.genre === m.genre && x.id !== m.id);
    const more = related.length ? related : MOVIES.filter(x => x.id !== m.id).slice(0, 6);
    return `
      <div class="watch">
        <a class="back" href="#/">← Back</a>
        <div class="player-wrap">
          <video id="video" controls playsinline preload="metadata"></video>
        </div>
        <div class="watch-info">
          <h1>${m.title}</h1>
          <p class="meta">${m.year}, ${m.genre}, ${m.len}, ★ ${m.rating}${m.demo ? ", demo title" : ""}</p>
          <p>${m.desc}</p>
          <div class="actions">
            <button class="btn outline ${isFav(m.id) ? "on" : ""}" data-fav-btn="${m.id}">${isFav(m.id) ? "✓ In My List" : "+ Add to My List"}</button>
            <button class="btn outline" id="restart">↺ Start over</button>
          </div>
        </div>
        <div>${section(`More ${related.length ? m.genre : "to watch"}`, row(more))}</div>
      </div>`;
  }

  // ---------- finding the video on archive.org ----------
  const secs = f => {
    const l = String(f.length || "");
    if (!l) return 0;
    return l.includes(":") ? l.split(":").reduce((t, x) => t * 60 + parseFloat(x), 0) : parseFloat(l) || 0;
  };
  const rank = f => (f.format === "512Kb MPEG4" ? 0 : f.format === "h.264" ? 1 : 2);

  function pickFile(files) {
    const mp4 = files.filter(f => /\.mp4$/i.test(f.name) && !/trailer|sample|preview/i.test(f.name));
    let ok = mp4.filter(f => secs(f) >= 3600);                                   // length known and over 1 hour
    if (!ok.length) ok = mp4.filter(f => !f.length && Number(f.size) > 200e6);  // length missing, but a big file
    ok.sort((a, b) => rank(a) - rank(b) || Number(a.size) - Number(b.size));
    return ok[0];
  }

  async function getJSON(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
  }

  async function resolveSource(m) {
    if (m.url) return m.url;
    const cached = store.get("sf:src:" + m.id, null);
    if (cached) return cached;
    const tries = [`title:"${m.q}" AND year:${m.year} AND mediatype:movies`, `title:"${m.q}" AND mediatype:movies`];
    for (const q of tries) {
      const api = "https://archive.org/advancedsearch.php?q=" + encodeURIComponent(q) +
        "&fl[]=identifier&sort[]=downloads+desc&rows=6&output=json";
      const found = await getJSON(api);
      for (const doc of found.response.docs) {
        const meta = await getJSON("https://archive.org/metadata/" + doc.identifier);
        const file = pickFile(meta.files || []);
        if (file) {
          const url = `https://archive.org/download/${doc.identifier}/` + file.name.split("/").map(encodeURIComponent).join("/");
          store.set("sf:src:" + m.id, url);
          return url;
        }
      }
    }
    throw new Error("No full-length video found");
  }

  async function wirePlayer(id) {
    const v = $("#video");
    if (!v) return;
    const m = byId(id);
    const saved = prog[id];
    v.addEventListener("loadedmetadata", () => {
      if (saved && saved.t > 5 && saved.t < v.duration - 5) {
        v.currentTime = saved.t;
        toast("Resumed where you left off");
      }
    });
    let last = 0;
    const save = () => {
      if (!v.duration) return;
      prog[id] = { t: v.currentTime, d: v.duration };
      store.set("sf:prog", prog);
    };
    v.addEventListener("timeupdate", () => { if (Math.abs(v.currentTime - last) > 2) { last = v.currentTime; save(); } });
    v.addEventListener("pause", save);
    v.addEventListener("ended", () => { delete prog[id]; store.set("sf:prog", prog); });
    v.addEventListener("error", () => {
      localStorage.removeItem("sf:src:" + id);   // forget a bad cached link so the next visit looks again
      toast("This video could not play. Try another title or refresh.");
    });
    $("#restart").addEventListener("click", () => { v.currentTime = 0; v.play(); });

    try {
      toast("Finding the movie...");
      const url = await resolveSource(m);
      if (location.hash === "#/watch/" + id) { v.src = url; }
    } catch (err) {
      console.error(err);
      toast("Could not find a video for this title. Check your internet connection.");
    }
  }

  // ---------- router ----------
  const currentPage = () => (location.hash.slice(2).split("/")[0] || "home");
  let lastPage = null;

  function route() {
    const [page = "", arg] = location.hash.slice(2).split("/");
    const name = page || "home";
    document.querySelectorAll("[data-nav]").forEach(a => a.classList.toggle("active", a.dataset.nav === name));

    if (name === "search") app.innerHTML = viewSearch();
    else if (name === "favorites") app.innerHTML = viewFavorites();
    else if (name === "watch") { app.innerHTML = viewWatch(arg); wirePlayer(Number(arg)); }
    else app.innerHTML = viewHome();

    if (name !== lastPage) window.scrollTo(0, 0);
    lastPage = name;
    document.title = name === "watch" && byId(arg) ? `${byId(arg).title} · StreamFlix` : "StreamFlix";
  }
  addEventListener("hashchange", route);

  // ---------- events (delegated, so they survive re-renders) ----------
  document.addEventListener("click", e => {
    const fav = e.target.closest("[data-fav]");
    if (fav) { e.preventDefault(); return toggleFav(Number(fav.dataset.fav)); }
    const favBtn = e.target.closest("[data-fav-btn]");
    if (favBtn) return toggleFav(Number(favBtn.dataset.favBtn));
    const chip = e.target.closest("[data-genre]");
    if (chip) { genre = chip.dataset.genre; route(); }
  });

  const input = $("#q");
  let debounce;
  input.addEventListener("input", () => {
    query = input.value;
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      if (currentPage() !== "search") location.hash = "#/search";
      else route();
    }, 150);
  });
  document.addEventListener("keydown", e => {
    if (e.key === "/" && document.activeElement !== input && !/video/i.test(document.activeElement.tagName)) {
      e.preventDefault(); input.focus();
    }
    if (e.key === "Escape" && document.activeElement === input) { input.value = ""; query = ""; input.blur(); if (currentPage() === "search") route(); }
  });

  // ---------- start ----------
  updateCount();
  route();
})();
