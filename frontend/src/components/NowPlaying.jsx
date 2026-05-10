import React, { useEffect, useRef, useState } from 'react';

function fmt(s) {
  if (!s || isNaN(s)) return '0:00';
  const mins = Math.floor(s / 60);
  const secs = String(Math.floor(s % 60)).padStart(2, '0');
  return `${mins}:${secs}`;
}

export default function NowPlaying({ 
  current, 
  isPlaying, 
  togglePlay, 
  playNext, 
  playPrev, 
  currentTime, 
  duration, 
  seek, 
  close,
  audioRef,
  themeColor,
  eqSettings,
  setEqSettings,
  sleepTimer,
  setSleepTimer,
  lyrics
}) {
  const [visualizerOn, setVisualizerOn] = useState(true);
  const [showEq, setShowEq] = useState(false);
  const [showSleep, setShowSleep] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const analyzerRef = useRef(null);
  const sourceRef = useRef(null);
  
  const bassFilterRef = useRef(null);
  const midFilterRef = useRef(null);
  const trebleFilterRef = useRef(null);
  const lyricsRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) return;

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 256;
      
      const source = audioContext.createMediaElementSource(audioRef.current);
      
      const bassFilter = audioContext.createBiquadFilter();
      bassFilter.type = 'lowshelf';
      bassFilter.frequency.value = 200;
      bassFilter.gain.value = eqSettings.bass;

      const midFilter = audioContext.createBiquadFilter();
      midFilter.type = 'peaking';
      midFilter.frequency.value = 1000;
      midFilter.Q.value = 1;
      midFilter.gain.value = eqSettings.mid;

      const trebleFilter = audioContext.createBiquadFilter();
      trebleFilter.type = 'highshelf';
      trebleFilter.frequency.value = 3000;
      trebleFilter.gain.value = eqSettings.treble;

      source.connect(bassFilter);
      bassFilter.connect(midFilter);
      midFilter.connect(trebleFilter);
      trebleFilter.connect(analyzer);
      analyzer.connect(audioContext.destination);
      
      analyzerRef.current = analyzer;
      sourceRef.current = source;
      bassFilterRef.current = bassFilter;
      midFilterRef.current = midFilter;
      trebleFilterRef.current = trebleFilter;

      const bufferLength = analyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');

      const draw = () => {
        if (!visualizerOn || !ctx) return;
        animationRef.current = requestAnimationFrame(draw);
        analyzer.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / bufferLength) * 2;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height;
          const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
          gradient.addColorStop(0, themeColor + '33');
          gradient.addColorStop(1, themeColor);
          ctx.fillStyle = gradient;
          ctx.shadowBlur = 10;
          ctx.shadowColor = themeColor;
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
          x += barWidth + 2;
        }
      };

      if (visualizerOn) draw();

      return () => {
        cancelAnimationFrame(animationRef.current);
        source.disconnect();
        bassFilter.disconnect();
        midFilter.disconnect();
        trebleFilter.disconnect();
        analyzer.disconnect();
        audioContext.close();
      };
    } catch (e) {
      console.error("Audio Pipeline Error:", e);
    }
  }, [audioRef, visualizerOn, themeColor]);

  useEffect(() => {
    if (bassFilterRef.current) bassFilterRef.current.gain.value = eqSettings.bass;
    if (midFilterRef.current) midFilterRef.current.gain.value = eqSettings.mid;
    if (trebleFilterRef.current) trebleFilterRef.current.gain.value = eqSettings.treble;
  }, [eqSettings]);

  // Sync lyrics scroll
  useEffect(() => {
    if (showLyrics && lyricsRef.current) {
      const active = lyricsRef.current.querySelector('.lyric-line.active');
      if (active) {
        active.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentTime, showLyrics]);

  const pct = duration ? (currentTime / duration) * 100 : 0;

  const handleEqChange = (type, val) => {
    setEqSettings(prev => ({ ...prev, [type]: parseFloat(val) }));
  };

  const setTimer = (mins) => {
    setSleepTimer(mins * 60);
    setShowSleep(false);
  };

  return (
    <div className="now-playing-overlay">
      <div className="np-background" style={{ backgroundImage: `url(${current?.thumbnail})` }}></div>
      
      <div className="np-content">
        <div className="np-top-nav">
          <button className="np-close" onClick={close}>
            <svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>
          </button>
          <div style={{display:'flex', gap:'15px'}}>
            <button className="p-btn" onClick={() => { setShowLyrics(!showLyrics); setShowEq(false); setShowSleep(false); }} style={{ color: showLyrics ? themeColor : '#fff' }}>
              <svg viewBox="0 0 24 24" style={{width:'24px', height:'24px'}}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8zM19 13h-6v-2h6v2z"/></svg>
            </button>
            <button className="p-btn" onClick={() => { setShowSleep(!showSleep); setShowEq(false); setShowLyrics(false); }} style={{ color: sleepTimer > 0 ? themeColor : '#fff' }}>
              <svg viewBox="0 0 24 24" style={{width:'24px', height:'24px'}}><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/></svg>
              {sleepTimer > 0 && <span className="sleep-badge">{Math.ceil(sleepTimer/60)}m</span>}
            </button>
            <button className="p-btn" onClick={() => { setShowEq(!showEq); setShowSleep(false); setShowLyrics(false); }} style={{ color: showEq ? themeColor : '#fff' }}>
              <svg viewBox="0 0 24 24" style={{width:'24px', height:'24px'}}><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>
            </button>
          </div>
        </div>

        <div className="np-artwork-container">
          <img className="np-artwork" src={current?.thumbnail} alt="" />
          {visualizerOn && !showLyrics && <canvas ref={canvasRef} className="np-visualizer" width="400" height="100"></canvas>}
        </div>

        {showEq && (
          <div className="eq-panel">
            <h3 style={{marginBottom:'20px', fontSize:'18px'}}>Advanced Equalizer</h3>
            <div className="eq-row">
              <span>Bass</span>
              <input type="range" min="-12" max="12" step="1" value={eqSettings.bass} onChange={(e) => handleEqChange('bass', e.target.value)} />
              <span className="eq-val">{eqSettings.bass}dB</span>
            </div>
            <div className="eq-row">
              <span>Mid</span>
              <input type="range" min="-12" max="12" step="1" value={eqSettings.mid} onChange={(e) => handleEqChange('mid', e.target.value)} />
              <span className="eq-val">{eqSettings.mid}dB</span>
            </div>
            <div className="eq-row">
              <span>Treble</span>
              <input type="range" min="-12" max="12" step="1" value={eqSettings.treble} onChange={(e) => handleEqChange('treble', e.target.value)} />
              <span className="eq-val">{eqSettings.treble}dB</span>
            </div>
          </div>
        )}

        {showSleep && (
          <div className="eq-panel">
            <h3 style={{marginBottom:'20px', fontSize:'18px'}}>Sleep Timer</h3>
            <div className="sleep-options">
              {[15, 30, 45, 60].map(m => (
                <button key={m} className="sleep-opt" onClick={() => setTimer(m)}>{m} Minutes</button>
              ))}
              <button className="sleep-opt" onClick={() => setTimer(0)} style={{color:'#ff4444'}}>Turn Off</button>
            </div>
          </div>
        )}

        {showLyrics && (
          <div className="lyrics-container" ref={lyricsRef}>
            {lyrics ? lyrics.map((line, idx) => {
              const isActive = currentTime >= line.time && (idx === lyrics.length - 1 || currentTime < lyrics[idx+1].time);
              return (
                <div key={idx} className={`lyric-line ${isActive ? 'active' : ''}`} style={{ color: isActive ? themeColor : 'rgba(255,255,255,0.4)' }}>
                  {line.text}
                </div>
              );
            }) : <div className="lyric-line">No lyrics available</div>}
          </div>
        )}

        {!showEq && !showSleep && !showLyrics && (
          <div className="np-info">
            <h1 className="np-title">{current?.title}</h1>
            <p className="np-artist">{current?.channel}</p>
          </div>
        )}

        <div className="np-controls-section">
          <div className="np-progress">
            <span>{fmt(currentTime)}</span>
            <input 
              type="range" 
              min="0" max="100" 
              value={pct || 0} 
              onChange={(e) => seek(e.target.value)}
              className="p-seek"
              style={{ background: `linear-gradient(to right, ${themeColor} ${pct}%, rgba(255,255,255,0.1) ${pct}%)` }}
            />
            <span>{fmt(duration)}</span>
          </div>

          <div className="np-btns">
            <button className="p-btn" onClick={playPrev}>
              <svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
            </button>
            <button className="p-btn p-play-large" onClick={togglePlay}>
              {isPlaying ? (
                <svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              ) : (
                <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
            <button className="p-btn" onClick={playNext}>
              <svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
