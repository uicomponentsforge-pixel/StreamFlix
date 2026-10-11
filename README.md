# StreamFlix

StreamFlix is a lightweight, single-page web application for browsing and streaming public-domain feature films hosted on the Internet Archive ([archive.org](https://archive.org)).

## Features

- **Film Catalogue:** 14 full-length public-domain films across Horror, Sci-Fi, Thriller, and Comedy genres.
- **Client-Side Routing:** Hash-based routing for Home, Search/Browse, My List (Favorites), and Watch pages.
- **Video Player Integration:** Automatic lookup and resolution of streaming video sources from archive.org metadata, with playback progress tracking and resume capabilities.
- **My List (Favorites):** Save titles to your personal list using `localStorage`.
- **Search & Filter:** Real-time search by title, genre, year, or description, plus genre filter chips.
- **Dark / Light Theme:** Toggleable color themes with system preference detection.
- **Keyboard Shortcuts:** Quick search focus using the `/` key and clear/exit with `Escape`.

## Tech Stack

- **HTML5 & CSS3:** Modern flexbox/grid layout, CSS custom properties (variables), and responsive design.
- **JavaScript (Vanilla ES6+):** Component-less, framework-free single-page app architecture.
- **Internet Archive API:** Dynamic searching and metadata fetching for video playback sources.

## Project Structure

```
├── index.html   # Main HTML entry point and shell layout
├── style.css    # Design tokens, themes, layout, and component styles
├── data.js     # Film dataset (14 public-domain movies)
└── app.js      # Core logic: storage, router, UI rendering, archive.org API, player logic
```

## Getting Started

Because StreamFlix is built purely with static web technologies (HTML, CSS, JS), no build process or package installation is required.

### Running Locally

1. Clone or download this repository.
2. Serve the directory using any static web server. For example:
   - Python: `python3 -m http.server 8000`
   - Node.js `npx serve .`
   - Or open `index.html` directly in a modern browser.
3. Open `http://localhost:8000` in your browser.
