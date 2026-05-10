import React, { useState } from 'react';

function fmt(s) {
  if (!s || isNaN(s)) return '0:00';
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

export default function MainContent({
  view,
  results,
  loading,
  error,
  searchQuery,
  current,
  playlists,
  setPlaylists,
  queue,
  playSong,
  toggleLike,
  addToQueue,
  playNext,
  addToPlaylist,
  setView,
  themeColor,
  setThemeColor,
  quality,
  setQuality,
  autoPlay,
  setAutoPlay,
  bgGradient,
  setBgGradient
}) {
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [showAddMenu, setShowAddMenu] = useState(null); // track id

  const handleCreatePlaylist = () => {
    const name = window.prompt("Playlist name:");
    if (name && !playlists[name]) {
      setPlaylists({ ...playlists, [name]: [] });
    }
  };

  const isLiked = (id) => playlists["Liked Songs"]?.some(s => s.id === id);

  if (loading) return <main className="main"><div className="loading-spinner"></div></main>;
  if (error) return <main className="main"><div className="empty-msg">Error: {error}</div></main>;

  if (view === 'home') {
    return (
      <main className="main">
        <div className="header-section">
          <div style={{width:'260px', height:'260px', background:'linear-gradient(135deg,#333,#000)', borderRadius:'4px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
            <svg viewBox="0 0 24 24" style={{width:'80px', height:'80px', fill:'#666'}}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
          </div>
          <div className="header-info">
            <h1 className="header-title">Welcome to Music</h1>
            <p className="header-desc">Search for songs to start listening. Your recently played and liked songs will appear in the library.</p>
          </div>
        </div>
      </main>
    );
  }

  if (view === 'library') {
    if (activePlaylist) {
      const tracks = playlists[activePlaylist] || [];
      return (
        <main className="main">
          <button className="btn-secondary" style={{marginBottom: '24px'}} onClick={() => setActivePlaylist(null)}>← Back to Library</button>
          <div className="header-section">
            <div style={{width:'200px', height:'200px', background:'linear-gradient(135deg,#1565C0,#b92b27)', borderRadius:'4px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
              <svg viewBox="0 0 24 24" style={{width:'60px', height:'60px', fill:'#fff'}}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </div>
            <div className="header-info">
              <h1 className="header-title">{activePlaylist}</h1>
              <p className="header-subtitle">Playlist · {tracks.length} songs</p>
              <div className="header-actions">
                {tracks.length > 0 && (
                  <button className="btn-play" onClick={() => playSong(tracks[0])}>
                    <svg viewBox="0 0 24 24" style={{width:'20px', height:'20px'}}><path d="M8 5v14l11-7z"/></svg> Play
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="track-list">
            {tracks.map((s, i) => (
              <div key={s.id + i} className={`track-item ${current?.id === s.id ? 'playing' : ''}`} onClick={() => playSong(s)}>
                <div className="track-num">
                  {current?.id === s.id ? (
                    <svg className="playing-icon" viewBox="0 0 24 24" style={{width:'16px', height:'16px', fill:'var(--accent)'}}><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
                  ) : i + 1}
                </div>
                <div className="track-title">{s.title}</div>
                <div className="track-artist">{s.channel}</div>
                <div className="track-plus" onClick={(e) => { e.stopPropagation(); setShowAddMenu(showAddMenu === s.id ? null : s.id); }}>+</div>
                <div className="track-dur">{fmt(s.duration)}</div>
              </div>
            ))}
          </div>
        </main>
      );
    }

    return (
      <main className="main">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'32px'}}>
          <h1 className="header-title">Your Library</h1>
          <button className="btn-play" onClick={handleCreatePlaylist}>+ New Playlist</button>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:'24px'}}>
          {Object.keys(playlists).map(name => (
            <div key={name} className="playlist-card" onClick={() => setActivePlaylist(name)} style={{cursor:'pointer'}}>
              <div style={{aspectRatio:'1', background:'linear-gradient(135deg,#333,#111)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'12px', boxShadow:'0 4px 12px rgba(0,0,0,0.3)'}}>
                <svg viewBox="0 0 24 24" style={{width:'40px', height:'40px', fill:'#666'}}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
              </div>
              <p style={{fontWeight:'500', fontSize:'16px'}}>{name}</p>
              <p style={{fontSize:'14px', color:'var(--text-muted)'}}>{playlists[name].length} songs</p>
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (view === 'queue') {
    return (
      <main className="main">
        <h1 className="header-title" style={{marginBottom:'24px'}}>Up Next</h1>
        <div className="track-list">
          {queue.map((s, i) => (
            <div key={i} className="track-item" onClick={() => playSong(s)}>
              <div className="track-num">{i + 1}</div>
              <div className="track-title">{s.title}</div>
              <div className="track-artist">{s.channel}</div>
              <div className="track-plays">—</div>
              <div className="track-dur">{fmt(s.duration)}</div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (view === 'search') {
    if (results.length === 0) return <main className="main"><div className="empty-msg">No results found</div></main>;
    const topHit = results[0];
    return (
      <main className="main">
        <div className="header-section">
          <img className="header-art" src={topHit.thumbnail} alt="" />
          <div className="header-info">
            <h1 className="header-title">{topHit.title}</h1>
            <p className="header-subtitle">Top result · {topHit.channel} · {fmt(topHit.duration)}</p>
            <div className="header-actions">
              <button className="btn-play" onClick={() => playSong(topHit)}>
                <svg viewBox="0 0 24 24" style={{width:'20px', height:'20px'}}><path d="M8 5v14l11-7z"/></svg> Play
              </button>
              <button className="btn-secondary" onClick={() => addToQueue(topHit)}>
                <svg viewBox="0 0 24 24" style={{width:'20px', height:'20px'}}><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z"/></svg> Add to Queue
              </button>
            </div>
          </div>
        </div>
        <div className="track-list">
          {results.map((s, i) => (
            <div key={s.id} className={`track-item ${current?.id === s.id ? 'playing' : ''}`} style={{position:'relative'}}>
              <div className="track-num" onClick={() => playSong(s)}>
                {current?.id === s.id ? (
                  <svg viewBox="0 0 24 24" style={{width:'16px', height:'16px', fill:'var(--accent)'}}><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
                ) : i + 1}
              </div>
              <div className="track-title" onClick={() => playSong(s)}>{s.title}</div>
              <div className="track-artist" onClick={() => playSong(s)}>{s.channel}</div>
              <div className="track-plus" onClick={(e) => { e.stopPropagation(); setShowAddMenu(showAddMenu === s.id ? null : s.id); }} style={{fontSize:'20px', padding:'0 10px', color:'var(--text-muted)'}}>+</div>
              <div className="track-dur">{fmt(s.duration)}</div>
              
              {showAddMenu === s.id && (
                <div className="add-menu" style={{position:'absolute', right:'80px', top:'40px', background:'#222', borderRadius:'8px', zIndex:'10', boxShadow:'0 12px 32px rgba(0,0,0,0.8)', padding:'8px 0', minWidth:'180px', border:'1px solid rgba(255,255,255,0.05)'}}>
                  {Object.keys(playlists).map(pname => (
                    <div key={pname} className="add-menu-item" onClick={() => { addToPlaylist(pname, s); setShowAddMenu(null); }} style={{padding:'10px 16px', cursor:'pointer', fontSize:'14px'}}>Add to {pname}</div>
                  ))}
                  <div className="add-menu-item" onClick={() => { handleCreatePlaylist(); setShowAddMenu(null); }} style={{padding:'10px 16px', cursor:'pointer', borderTop:'1px solid rgba(255,255,255,0.05)', fontSize:'14px'}}>+ New Playlist</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (view === 'themes') {
    const themeColors = [
      { name: "Classic Red", hex: "#FF0000" },
      { name: "Electric Blue", hex: "#0066FF" },
      { name: "Spotify Green", hex: "#1DB954" },
      { name: "Vivid Purple", hex: "#9933FF" },
      { name: "Neon Pink", hex: "#FF00FF" },
      { name: "Deep Orange", hex: "#FF5722" },
      { name: "Sky Blue", hex: "#00CCFF" },
      { name: "Emerald Green", hex: "#2ECC71" },
      { name: "Golden Yellow", hex: "#FFD700" },
      { name: "Royal Indigo", hex: "#3F51B5" },
      { name: "Teal", hex: "#008080" },
      { name: "Rose Gold", hex: "#B76E79" },
      { name: "Amber", hex: "#FFBF00" },
      { name: "Deep Crimson", hex: "#DC143C" },
      { name: "Lavender", hex: "#E6E6FA" },
      { name: "Mint", hex: "#98FF98" },
      { name: "Forest Green", hex: "#228B22" },
      { name: "Ocean Blue", hex: "#0077BE" },
    ];

    return (
      <main className="main">
        <div className="header-section">
          <div className="header-info">
            <h1 className="header-title">Themes</h1>
            <p className="header-subtitle">Customize your accent color</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '20px', marginBottom:'40px' }}>
          {themeColors.map(c => (
            <div 
              key={c.hex} 
              className="playlist-card" 
              onClick={() => setThemeColor(c.hex)}
              style={{ 
                textAlign: 'center', 
                border: themeColor === c.hex ? `2px solid ${c.hex}` : '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer'
              }}
            >
              <div style={{ width: '60px', height: '60px', background: c.hex, borderRadius: '50%', margin: '0 auto 12px', boxShadow: `0 8px 16px ${c.hex}44` }}></div>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>{c.name}</div>
            </div>
          ))}
        </div>

        <div className="settings-section" style={{maxWidth:'600px'}}>
          <h2 style={{fontSize:'20px', marginBottom:'20px'}}>General Settings</h2>
          <div className="settings-row" style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(255,255,255,0.03)', padding:'20px', borderRadius:'12px', marginBottom:'15px'}}>
            <div>
              <div style={{fontSize:'16px', fontWeight:'500'}}>Auto-Play</div>
              <div style={{fontSize:'13px', color:'var(--text-muted)'}}>Play similar songs automatically</div>
            </div>
            <button 
              onClick={() => setAutoPlay(!autoPlay)}
              style={{
                width: '50px',
                height: '26px',
                borderRadius: '13px',
                background: autoPlay ? themeColor : 'rgba(255,255,255,0.1)',
                border: 'none',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#fff',
                position: 'absolute',
                top: '4px',
                left: autoPlay ? '28px' : '4px',
                transition: 'all 0.3s'
              }}></div>
            </button>
          </div>

          <div className="settings-row" style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(255,255,255,0.03)', padding:'20px', borderRadius:'12px'}}>
            <div>
              <div style={{fontSize:'16px', fontWeight:'500'}}>Audio Quality</div>
              <div style={{fontSize:'13px', color:'var(--text-muted)'}}>Higher quality uses more data</div>
            </div>
            <div style={{display:'flex', gap:'10px'}}>
              {['low', 'normal', 'high'].map(q => (
                <button 
                  key={q} 
                  onClick={() => setQuality(q)}
                  style={{
                    padding:'8px 16px',
                    borderRadius:'8px',
                    border:'none',
                    background: quality === q ? themeColor : 'rgba(255,255,255,0.05)',
                    color: quality === q ? '#000' : '#fff',
                    fontWeight:'600',
                    textTransform:'capitalize',
                    cursor:'pointer'
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="settings-section" style={{maxWidth:'600px', marginTop:'40px'}}>
          <h2 style={{fontSize:'20px', marginBottom:'20px'}}>Background Style</h2>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))', gap:'20px'}}>
            {[
              { name: 'Midnight', value: 'linear-gradient(135deg, #030303 0%, #000000 100%)' },
              { name: 'Deep Sea', value: 'linear-gradient(135deg, #080a1a 0%, #000000 100%)' },
              { name: 'Obsidian', value: 'linear-gradient(135deg, #1a0a0a 0%, #000000 100%)' },
              { name: 'Forest', value: 'linear-gradient(135deg, #0a1a0a 0%, #000000 100%)' },
            ].map(bg => (
              <div 
                key={bg.name}
                onClick={() => setBgGradient(bg.value)}
                style={{
                  height:'80px',
                  background: bg.value,
                  borderRadius:'12px',
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  cursor:'pointer',
                  border: bgGradient === bg.value ? `2px solid ${themeColor}` : '1px solid rgba(255,255,255,0.1)',
                  fontWeight:'600',
                  fontSize:'14px',
                  color: '#fff'
                }}
              >
                {bg.name}
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return <main className="main"></main>;
}
