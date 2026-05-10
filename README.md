# 🎵 TermiMusic (Premium Redesign)

TermiMusic is a professional-grade, minimal, and high-performance music streaming application built for speed and aesthetics. It leverages `yt-dlp` for seamless streaming and features a premium, glassmorphic UI designed for an immersive listening experience.

![TermiMusic Preview](https://img.shields.io/badge/Status-Premium-brightgreen)
![React](https://img.shields.io/badge/Frontend-React-61DAFB)
![Python](https://img.shields.io/badge/Backend-Python-3776AB)

## ✨ Key Features

- 🎧 **High-Fidelity Streaming**: Selectable audio quality (Low, Normal, High) based on your data needs.
- 🎚️ **Advanced Equalizer**: Real-time Bass, Mid, and Treble control using Web Audio API.
- 🎤 **Synced Lyrics**: Interactive, auto-scrolling lyrics for a karaoke-like experience.
- 🌙 **Sleep Timer**: Auto-pause playback after a set duration (15, 30, 45, 60 mins).
- 🤖 **Auto-Play**: Automatically discovers and plays similar tracks when your queue ends.
- 📱 **PWA & Background Play**: Fully responsive design with Media Session API support for lock-screen controls and background playback.
- 🎨 **Premium Themes**: Multi-color accent support and custom high-end gradients (Midnight, Deep Sea, Obsidian, etc.).
- 📂 **Local Playlists**: Create and manage playlists stored locally on your device for privacy.

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js & npm
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) installed on your system path.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/KumarAman0-0/yt-clone.git
   cd yt-clone
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

3. **Backend Setup**:
   ```bash
   cd ../backend
   pip install -r requirements.txt
   ```

4. **Run the Application**:
   ```bash
   python server.py
   ```
   Now open `http://localhost:5000` in your browser.

## 📱 Mobile & PWA
TermiMusic is optimized for mobile devices. To install it as a PWA:
1. Open the app in Chrome/Safari on your phone.
2. Select "Add to Home Screen" from the browser menu.
3. Enjoy full-screen, background-supported music playback!

## 🛠️ Tech Stack
- **Frontend**: React.js, Vite, Vanilla CSS (Glassmorphism).
- **Backend**: Python (Native HTTP Server), `yt-dlp`.
- **APIs**: Web Audio API (for EQ), Media Session API (for OS controls).

## 📄 License
MIT License - Created with ❤️ by Kumar Aman.
