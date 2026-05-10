import React, { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import MainContent from './components/MainContent';
import PlayerBar from './components/PlayerBar';
import NowPlaying from './components/NowPlaying';
import './index.css';

export default function App() {
  const [view, setView] = useState('home'); // home, explore, library, search, queue
  const [nowPlaying, setNowPlaying] = useState(false);
  const [splash, setSplash] = useState(true);
  const [current, setCurrent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ytm_current')) || null;
    } catch(e) { return null; }
  });
  const [queue, setQueue] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ytm_queue')) || [];
    } catch(e) { return []; }
  });
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ytm_history')) || [];
    } catch(e) { return []; }
  });
  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('none'); // none, all, one
  const [playlists, setPlaylists] = useState(() => {
    try {
      const saved = localStorage.getItem('ytm_playlists');
      if (saved && saved !== 'null') return JSON.parse(saved);
    } catch(e) {}
    const legacyLiked = JSON.parse(localStorage.getItem('ytm_liked') || '[]');
    return { "Liked Songs": legacyLiked };
  });
  
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('ytm_theme') || '#FF0000');
  const [eqSettings, setEqSettings] = useState({ bass: 0, mid: 0, treble: 0 });
  const [sleepTimer, setSleepTimer] = useState(0); // seconds
  const [quality, setQuality] = useState(() => localStorage.getItem('ytm_quality') || 'high');
  const [lyrics, setLyrics] = useState(null);
  const [autoPlay, setAutoPlay] = useState(() => localStorage.getItem('ytm_autoplay') === 'true');
  const [bgGradient, setBgGradient] = useState(() => localStorage.getItem('ytm_bg') || 'linear-gradient(135deg, #030303 0%, #000000 100%)');
  const [autoTheme, setAutoTheme] = useState(() => localStorage.getItem('ytm_autotheme') !== 'false');
  const [miniMode, setMiniMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', themeColor);
    localStorage.setItem('ytm_theme', themeColor);
  }, [themeColor]);

  const [currentTime, setCurrentTime] = useState(() => parseFloat(localStorage.getItem('ytm_currentTime')) || 0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(() => parseFloat(localStorage.getItem('ytm_volume')) || 0.8);

  const audioRef = useRef(null);
  const toastTimeoutRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('ytm_playlists', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    if (current) localStorage.setItem('ytm_current', JSON.stringify(current));
    localStorage.setItem('ytm_queue', JSON.stringify(queue));
    localStorage.setItem('ytm_history', JSON.stringify(history));
  }, [current, queue, history]);

  useEffect(() => {
    localStorage.setItem('ytm_currentTime', currentTime);
  }, [currentTime]);

  useEffect(() => {
    localStorage.setItem('ytm_volume', volume);
  }, [volume]);

  useEffect(() => {
    const timer = setTimeout(() => setSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (sleepTimer > 0) {
      const t = setInterval(() => {
        setSleepTimer(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            if (audioRef.current) audioRef.current.pause();
            showToast("Sleep timer finished");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(t);
    }
  }, [sleepTimer]);

  const showToast = (msg) => {
    setToastMsg(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToastMsg(''), 2200);
  };

  const toggleLike = (id, title) => {
    addToPlaylist("Liked Songs", { id, title, channel: current?.channel || 'YouTube', duration: current?.duration || 0, thumbnail: current?.thumbnail });
  };

  const addToPlaylist = (playlistName, song) => {
    setPlaylists(prev => {
      const p = prev[playlistName] || [];
      // check if already exists
      const exists = p.find(s => s.id === song.id);
      if (exists) {
        if (playlistName === "Liked Songs") {
          showToast('Removed from library');
          return { ...prev, [playlistName]: p.filter(s => s.id !== song.id) };
        }
        showToast('Already in playlist');
        return prev;
      }
      showToast('Added to ' + playlistName);
      return { ...prev, [playlistName]: [...p, song] };
    });
  };

  const toggleLikeCurrent = () => {
    if (current) toggleLike(current.id, current.title);
  };

  const addToQueue = (song) => {
    setQueue(prev => [...prev, song]);
    showToast('Added to queue');
  };

  const doSearch = async (q) => {
    setSearchQuery(q);
    setView('search');
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDominantColor = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let r=0, g=0, b=0;
        for (let i=0; i<data.length; i+=40) { // sample every 10th pixel
          r += data[i]; g += data[i+1]; b += data[i+2];
        }
        const count = data.length / 40;
        const hex = "#" + ((1 << 24) + (Math.round(r/count) << 16) + (Math.round(g/count) << 8) + Math.round(b/count)).toString(16).slice(1);
        resolve(hex);
      };
      img.onerror = () => resolve('#FF0000');
    });
  };

  const playSong = useCallback(async (song) => {
    if (current) setHistory(prev => [...prev, current]);
    setCurrent(song);

    // Track play count for Smart Playlists
    const updatedPlaylists = { ...playlists };
    const p = updatedPlaylists["Most Played"] || [];
    const existingIdx = p.findIndex(s => s.id === song.id);
    if (existingIdx !== -1) {
      p[existingIdx] = { ...p[existingIdx], playCount: (p[existingIdx].playCount || 1) + 1 };
    } else {
      p.push({ ...song, playCount: 1 });
    }
    // Track Recently Played
    const rp = updatedPlaylists["Recently Played"] || [];
    const filteredRp = rp.filter(s => s.id !== song.id);
    updatedPlaylists["Recently Played"] = [song, ...filteredRp].slice(0, 20);

    updatedPlaylists["Most Played"] = [...p].sort((a,b) => (b.playCount||0) - (a.playCount||0)).slice(0, 20);
    setPlaylists(updatedPlaylists);
    
    if (autoTheme) {
      const color = await getDominantColor(song.thumbnail);
      setThemeColor(color);
    }
    try {
      const res = await fetch(`/api/stream/${song.id}?quality=${quality}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      const lres = await fetch(`/api/lyrics/${song.id}`);
      const ldata = await lres.json();
      setLyrics(ldata.lyrics);

      const audio = audioRef.current;
      audio.src = data.stream_url;
      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      showToast('❌ ' + err.message);
      setIsPlaying(false);
    }
  }, [current, playlists, autoTheme, quality]);

  const togglePlay = useCallback(async () => {
    if (!current) return;
    const audio = audioRef.current;
    
    if (!audio.src || audio.src === window.location.href) {
      try {
        const res = await fetch(`/api/stream/${current.id}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        audio.src = data.stream_url;
        audio.currentTime = currentTime;
      } catch (err) {
        showToast('❌ ' + err.message);
        return;
      }
    }

    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(e => {
        showToast('Play error: ' + e.message);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [current, currentTime]);

  const playNext = useCallback(() => {
    if (queue.length > 0) {
      const [next, ...rest] = queue;
      setQueue(rest);
      playSong(next);
    } else if (repeat === 'all' && results.length > 0) {
      const idx = results.findIndex(s => s.id === current?.id);
      playSong(results[(idx + 1) % results.length]);
    }
  }, [queue, repeat, results, current, playSong]);

  const playPrev = useCallback(() => {
    const audio = audioRef.current;
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
    } else if (history.length > 0) {
      const prevHistory = [...history];
      const prev = prevHistory.pop();
      setHistory(prevHistory);
      playSong(prev);
    }
  }, [history, playSong]);

  useEffect(() => {
    localStorage.setItem('ytm_quality', quality);
  }, [quality]);

  const toggleShuffle = () => {
    setShuffle(s => {
      showToast(!s ? 'Shuffle on' : 'Shuffle off');
      return !s;
    });
  };

  const toggleRepeat = () => {
    const modes = ['none', 'all', 'one'];
    setRepeat(r => {
      const next = modes[(modes.indexOf(r) + 1) % 3];
      const labels = { none: 'Repeat off', all: 'Repeat all', one: 'Repeat one' };
      showToast(labels[next]);
      return next;
    });
  };

  useEffect(() => {
    const audio = audioRef.current;
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);

      // Simple Fade-out at end (last 2 seconds)
      if (audio.duration && audio.duration - audio.currentTime < 2) {
        const fadeRatio = (audio.duration - audio.currentTime) / 2;
        audio.volume = volume * fadeRatio;
      } else {
        audio.volume = volume;
      }
    };
    const handleEnded = async () => {
      if (repeat === 'one') {
        audio.play();
      } else {
        playNext();
      }
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [repeat, queue, current, playNext, volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
  }, [isPlaying]);

  const seek = (pct) => {
    const audio = audioRef.current;
    if (audio.duration) {
      audio.currentTime = (pct / 100) * audio.duration;
    }
  };

  useEffect(() => {
    localStorage.setItem('ytm_autoplay', autoPlay);
  }, [autoPlay]);

  useEffect(() => {
    document.documentElement.style.setProperty('--bg-gradient', bgGradient);
    localStorage.setItem('ytm_bg', bgGradient);
  }, [bgGradient]);

  useEffect(() => {
    if ('mediaSession' in navigator && current) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: current.title,
        artist: current.channel,
        album: 'TermiMusic',
        artwork: [
          { src: current.thumbnail, sizes: '512x512', type: 'image/jpeg' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', togglePlay);
      navigator.mediaSession.setActionHandler('pause', togglePlay);
      navigator.mediaSession.setActionHandler('previoustrack', playPrev);
      navigator.mediaSession.setActionHandler('nexttrack', playNext);
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (audioRef.current) {
          audioRef.current.currentTime = details.seekTime;
          setCurrentTime(details.seekTime);
        }
      });
    }
  }, [current, togglePlay, playNext, playPrev]);

  return (
    <div className={`app ${miniMode ? 'mini-active' : ''}`}>
      {splash && (
        <div className="loading-screen">
          <div className="loading-logo">
            <div className="yt-logo-circle">
              <div className="yt-logo-play"></div>
            </div>
            <span className="yt-logo-text">Music</span>
          </div>
        </div>
      )}

      <TopBar doSearch={doSearch} />
      
      <Sidebar view={view} setView={setView} />
      
      <MainContent 
        view={view}
        results={results}
        loading={loading}
        error={error}
        searchQuery={searchQuery}
        current={current}
        playlists={playlists}
        setPlaylists={setPlaylists}
        queue={queue}
        playSong={playSong}
        toggleLike={toggleLike}
        addToQueue={addToQueue}
        playNext={playNext}
        addToPlaylist={addToPlaylist}
        doSearch={doSearch}
        setView={setView}
        themeColor={themeColor}
        setThemeColor={setThemeColor}
        quality={quality}
        setQuality={setQuality}
        autoPlay={autoPlay}
        setAutoPlay={setAutoPlay}
        bgGradient={bgGradient}
        setBgGradient={setBgGradient}
        autoTheme={autoTheme}
        setAutoTheme={setAutoTheme}
      />
      
      <PlayerBar 
        current={current}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        playNext={playNext}
        playPrev={playPrev}
        shuffle={shuffle}
        toggleShuffle={toggleShuffle}
        repeat={repeat}
        toggleRepeat={toggleRepeat}
        showQueue={() => setView('queue')}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        setVolume={setVolume}
        seek={seek}
        playlists={playlists}
        toggleLikeCurrent={toggleLikeCurrent}
        openNowPlaying={() => setNowPlaying(true)}
        themeColor={themeColor}
        miniMode={miniMode}
        setMiniMode={setMiniMode}
      />

      {nowPlaying && (
        <NowPlaying 
          current={current}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          playNext={playNext}
          playPrev={playPrev}
          currentTime={currentTime}
          duration={duration}
          seek={seek}
          close={() => setNowPlaying(false)}
          audioRef={audioRef}
          themeColor={themeColor}
          eqSettings={eqSettings}
          setEqSettings={setEqSettings}
          sleepTimer={sleepTimer}
          setSleepTimer={setSleepTimer}
          lyrics={lyrics}
        />
      )}

      <div className={`toast ${toastMsg ? 'show' : ''}`} id="toast">
        {toastMsg}
      </div>
      
      <audio ref={audioRef} preload="auto"></audio>
    </div>
  );
}
