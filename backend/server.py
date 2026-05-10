"""
TermiMusic – Minimal HTTP server (stdlib only) + yt-dlp
No Flask, no extra dependencies — just Python + yt-dlp
"""
import json
import os
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import yt_dlp

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
        opts = {"quiet": True, "no_warnings": True, "extract_flat": True, "skip_download": True}
        try:
            with yt_dlp.YoutubeDL(opts) as ydl:
                info = ydl.extract_info(f"ytsearch10:{query}", download=False)
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
        opts = {"quiet": True, "no_warnings": True, "skip_download": True}
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
            {"time": 10, "text": "Welcome to TermiMusic"},
            {"time": 20, "text": "Enjoy your favorite tracks"},
            {"time": 30, "text": "With high-fidelity sound"},
            {"time": 40, "text": "And premium features"},
            {"time": 50, "text": "♪ Instrumental Break ♪"},
            {"time": 70, "text": "TermiMusic: Your Music, Your Way"},
            {"time": 90, "text": "Thank you for listening!"}
        ]
        self._json({"lyrics": lrc})

    def _related(self, vid):
        key = f"related:{vid}"
        hit = get_cache(key)
        if hit:
            self._json(hit)
            return
        opts = {"quiet": True, "no_warnings": True, "extract_flat": True, "skip_download": True}
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

if __name__ == "__main__":
    port = 5000
    print(f"\n🎵  TermiMusic  →  http://localhost:{port}\n")
    HTTPServer(("0.0.0.0", port), Handler).serve_forever()
