# 🎵 Music — YouTube Music Clone

A premium, full-stack music streaming web app powered by `yt-dlp` and React. Search and stream any song directly from YouTube with a beautiful, responsive UI.

![Status](https://img.shields.io/badge/Status-Live-brightgreen)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB)
![Python](https://img.shields.io/badge/Backend-Python%203-3776AB)
![yt-dlp](https://img.shields.io/badge/Streaming-yt--dlp-FF0000)

---

## ✨ Features

- 🔍 **Instant Search** — Search any song, artist, or album with debounced real-time results
- 🎧 **HQ Audio Streaming** — Selectable quality: Low / Normal / High via `yt-dlp`
- 📱 **Fully Responsive** — Desktop, tablet & mobile layouts with bottom navigation
- 🎚️ **Equalizer** — Real-time Bass, Mid, Treble control using Web Audio API
- 🎤 **Synced Lyrics** — Auto-scrolling lyrics display while playing
- 🌙 **Sleep Timer** — Auto-pause after 15 / 30 / 45 / 60 minutes
- ❤️ **Library & Playlists** — Like songs, create custom playlists (stored in localStorage)
- 🔀 **Queue, Shuffle & Repeat** — Full playback control
- 🎨 **Themes** — Multiple accent colors + dynamic color from album art
- 🖥️ **Mini Player** — Floating compact player mode
- 🔒 **Media Session API** — Lock-screen controls & background playback on mobile
- ⚡ **In-Memory Cache** — Fast repeated searches and streams (no re-fetch)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, Vite, Vanilla CSS |
| **Backend** | Python 3 (stdlib `http.server`, `ThreadingMixIn`) |
| **Streaming** | yt-dlp (mweb client for reliability) |
| **Styling** | Glassmorphism, CSS Grid, Responsive breakpoints |
| **APIs** | Web Audio API, Media Session API |
| **Storage** | localStorage (playlists, history, preferences) |

---

## 📁 Project Structure

```
yt-clone/
├── backend/
│   ├── server.py          # Python HTTP server + yt-dlp API
│   └── requirements.txt   # yt-dlp, requests
├── frontend/
│   ├── src/
│   │   ├── App.jsx                    # Main app state & logic
│   │   ├── index.css                  # All styles (responsive)
│   │   └── components/
│   │       ├── TopBar.jsx             # Search bar
│   │       ├── Sidebar.jsx            # Navigation
│   │       ├── MainContent.jsx        # Home / Search / Library views
│   │       ├── PlayerBar.jsx          # Bottom player controls
│   │       └── NowPlaying.jsx         # Full-screen player overlay
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── Dockerfile
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+ & npm

### Installation

**1. Clone the repo:**
```bash
git clone https://github.com/KumarAman0-0/yt-clone.git
cd yt-clone
```

**2. Build the frontend:**
```bash
cd frontend
npm install
npm run build
```

**3. Install backend dependencies:**
```bash
cd ../backend
pip install -r requirements.txt
```

**4. Run the server:**
```bash
python server.py
```

Open **http://localhost:5000** in your browser. 🎵

---

## 🐳 Docker (Optional)

```bash
docker build -t yt-music .
docker run -p 5000:5000 yt-music
```

---

## 📱 Mobile Usage

The app is fully responsive:
- **Bottom navigation** replaces the sidebar on mobile
- **Player bar** shows song info + Prev / Play / Next + progress bar
- **Now Playing** screen is optimized for portrait orientation

---

## ⚡ Performance Notes

- Search uses `ytsearch20` (top 20 results) for fast response (~2s)
- `ThreadedHTTPServer` handles search + playback in parallel (no blocking)
- All search and stream results are cached in-memory for instant replay
- Search debounce (800ms) prevents excessive API calls while typing

---

## 📄 License

MIT License — Made with ❤️ by [Kumar Aman](https://github.com/KumarAman0-0)
