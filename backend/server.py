"""
Music – Minimal HTTP server (stdlib only) + yt-dlp
No Flask, no extra dependencies — just Python + yt-dlp
"""
import json
import os
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler
from socketserver import ThreadingMixIn
from urllib.parse import urlparse, parse_qs
import yt_dlp
import requests
import time

# ── Simple in-memory cache ────────────────────────────────────────────────────
_cache = {}
_lock = threading.Lock()

def get_cache(key):
    with _lock:
        return _cache.get(key)

def set_cache(key, value):
    with _lock:
        _cache[key] = value

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "frontend"))

# ── Keep-Alive (Ping) ────────────────────────────────────────────────────────
def keep_alive(url):
    """Simple loop to ping the server every 10 minutes to prevent sleeping."""
    while True:
        try:
            # We use a short timeout so we don't hang if the server is slow
            requests.get(url, timeout=10)
            print(f"  [Keep-Alive] Pinged {url} successfully.")
        except Exception as e:
            print(f"  [Keep-Alive] Ping failed: {e}")
        # Wait 10 minutes (600 seconds)
        time.sleep(600)

# ── Request Handler ───────────────────────────────────────────────────────────
class Handler(BaseHTTPRequestHandler):

    def do_GET(self):
        parsed = urlparse(self.path)
        path   = parsed.path
        qs     = parse_qs(parsed.query)

        if path == "/api/search":
            self._search(qs.get("q", [""])[0].strip())
            return
        elif path.startswith("/api/stream/"):
            vid = path.split("/")[-1]
            q   = qs.get("quality", ["high"])[0]
            self._stream(vid, q)
            return
        elif path.startswith("/api/lyrics/"):
            self._lyrics(path.split("/")[-1])
            return
        elif path.startswith("/api/related/"):
            self._related(path.split("/")[-1])
            return

        # Serve static files from frontend/dist
        if path == "/":
            path = "/index.html"
            
        fp = os.path.join(FRONTEND_DIR, "dist", path.lstrip("/"))
        if not os.path.isfile(fp):
            # Fallback to index.html for SPA
            fp = os.path.join(FRONTEND_DIR, "dist", "index.html")

        if not os.path.isfile(fp):
            self.send_error(404, "Not found")
            return

        ext = os.path.splitext(fp)[1]
        ctypes = {
            ".html": "text/html; charset=utf-8",
            ".css": "text/css",
            ".js": "application/javascript",
            ".json": "application/json",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".svg": "image/svg+xml",
            ".ico": "image/x-icon",
        }
        ctype = ctypes.get(ext, "application/octet-stream")

        try:
            with open(fp, "rb") as f:
                data = f.read()
            self.send_response(200)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
        except Exception as e:
            self.send_error(500, str(e))

    def _json(self, obj, status=200):
        body = json.dumps(obj).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _search(self, query):
        if not query:
            self._json({"error": "Empty query"}, 400)
            return
        key = f"search:{query}"
        hit = get_cache(key)
        if hit:
            self._json(hit)
            return
        opts = {
            "quiet": True, 
            "no_warnings": True, 
            "extract_flat": True, 
            "skip_download": True,
            # Use mweb client — avoids YouTube bot-detection that blocks default web client
            "extractor_args": {"youtube": {"player_client": ["mweb"]}},
        }
        try:
            with yt_dlp.YoutubeDL(opts) as ydl:
                # Using a slightly different search query to avoid direct patterns
                info = ydl.extract_info(f"ytsearch20:{query}", download=False)
            results = []
            for e in (info.get("entries") or []):
                if not e: continue
                vid = e.get("id")
                results.append({
                    "id":        vid,
                    "title":     e.get("title", "Unknown"),
                    "channel":   e.get("channel") or e.get("uploader", "Unknown"),
                    "duration":  e.get("duration", 0),
                    "thumbnail": f"https://img.youtube.com/vi/{vid}/mqdefault.jpg",
                })
            set_cache(key, results)
            self._json(results)
        except Exception as ex:
            self._json({"error": str(ex)}, 500)

    def _stream(self, vid, quality="high"):
        if not vid:
            self._json({"error": "No video id"}, 400)
            return
        key = f"stream:{vid}:{quality}"
        hit = get_cache(key)
        if hit:
            self._json(hit)
            return
        opts = {
            "quiet": True, 
            "no_warnings": True, 
            "skip_download": True,
            # Force certain clients that are less likely to be blocked
            "extractor_args": {"youtube": {"player_client": ["ios", "android", "web"]}},
            "http_headers": {
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1",
            }
        }
        try:
            with yt_dlp.YoutubeDL(opts) as ydl:
                info = ydl.extract_info(f"https://www.youtube.com/watch?v={vid}", download=False)
            audio_url = None
            formats = info.get("formats", [])
            af = [f for f in formats if f.get("vcodec") == "none" and f.get("acodec") != "none"]
            if af:
                if quality == "low": target = min(af, key=lambda f: f.get("abr") or 999)
                elif quality == "normal":
                    af_sorted = sorted(af, key=lambda f: f.get("abr") or 0)
                    target = af_sorted[len(af_sorted)//2]
                else: target = max(af, key=lambda f: f.get("abr") or 0)
                audio_url = target.get("url")
            if not audio_url: audio_url = info.get("url")
            result = {
                "id": vid, "stream_url": audio_url, "title": info.get("title", "Unknown"),
                "channel": info.get("channel") or info.get("uploader", "Unknown"),
                "duration": info.get("duration", 0),
                "thumbnail": (info.get("thumbnail") or f"https://img.youtube.com/vi/{vid}/maxresdefault.jpg"),
            }
            set_cache(key, result)
            self._json(result)
        except Exception as ex:
            self._json({"error": str(ex)}, 500)

    def _lyrics(self, vid):
        lrc = [
            {"time": 0, "text": "♪ Music Playing ♪"},
            {"time": 10, "text": "Welcome to Music"},
            {"time": 20, "text": "Enjoy your favorite tracks"},
            {"time": 30, "text": "With high-fidelity sound"},
            {"time": 40, "text": "And premium features"},
            {"time": 50, "text": "♪ Instrumental Break ♪"},
            {"time": 70, "text": "Music: Your Music, Your Way"},
            {"time": 90, "text": "Thank you for listening!"}
        ]
        self._json({"lyrics": lrc})

    def _related(self, vid):
        key = f"related:{vid}"
        hit = get_cache(key)
        if hit:
            self._json(hit)
            return
        opts = {
            "quiet": True,
            "no_warnings": True,
            "extract_flat": True,
            "skip_download": True,
            "extractor_args": {"youtube": {"player_client": ["mweb"]}},
        }
        try:
            with yt_dlp.YoutubeDL(opts) as ydl:
                info = ydl.extract_info(f"https://www.youtube.com/watch?v={vid}", download=False)
                entries = info.get("entries") or []
                if not entries:
                    query = info.get("title", "")
                    info = ydl.extract_info(f"ytsearch3:{query}", download=False)
                    entries = info.get("entries") or []
            results = []
            for e in entries[:5]:
                if not e or e.get("id") == vid: continue
                results.append({
                    "id": e.get("id"), "title": e.get("title", "Unknown"),
                    "channel": e.get("channel") or e.get("uploader", "Unknown"),
                    "duration": e.get("duration", 0),
                    "thumbnail": f"https://img.youtube.com/vi/{e.get('id')}/mqdefault.jpg",
                })
            set_cache(key, results)
            self._json(results)
        except Exception as ex:
            self._json({"error": str(ex)}, 500)

    def log_message(self, fmt, *args):
        print(f"  {fmt % args}")

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """Handle each request in a separate thread (non-blocking)."""
    allow_reuse_address = True
    daemon_threads = True


if __name__ == "__main__":
    import os
    # Default to 5000 for local development, but use PORT env var for deployment
    port = int(os.environ.get("PORT", 5000))
    
    # Start Keep-Alive thread if APP_URL is set in environment variables
    app_url = os.environ.get("APP_URL")
    if app_url:
        print(f"  [Keep-Alive] Starting pinger for: {app_url}")
        threading.Thread(target=keep_alive, args=(app_url,), daemon=True).start()

    print(f"\n🎵  Music  →  http://localhost:{port}\n")
    ThreadedHTTPServer(("0.0.0.0", port), Handler).serve_forever()
