import React, { useState } from 'react';

function fmt(s) {
  if (!s || isNaN(s)) return '0:00';
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

export default function MainContent({
  view,
  mode,
  results,
  loading,
  error,
  searchQuery,
  channelName,
  current,
  playlists,
  setPlaylists,
  queue,
  playSong,
  toggleLike,
  addToQueue,
  playNext,
  addToPlaylist,
  doSearch,
  doChannelSearch,
  setView,
  themeColor,
  setThemeColor,
  quality,
  setQuality,
  autoPlay,
  setAutoPlay,
  bgGradient,
  setBgGradient,
  autoTheme,
  setAutoTheme,
  onPlayVideo,
  savedVideos = [],
  toggleSaveVideo
}) {
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [showAddMenu, setShowAddMenu] = useState(null);

  const isSaved = (id) => savedVideos.some(v => v.id === id);

  const handleCreatePlaylist = () => {
    const name = window.prompt("Playlist name:");
    if (name && !playlists[name]) {
      setPlaylists({ ...playlists, [name]: [] });
    }
  };

  const isLiked = (id) => playlists["Liked Songs"]?.some(s => s.id === id);

  if (error) return <main className="main"><div className="empty-msg">Error: {error}</div></main>;

  const Loading = () => (
    <div style={{position:'absolute', top:0, left:0, right:0, height:'3px', background:'var(--accent)', zIndex:100, animation:'loading-bar 2s infinite'}}>
      <style>{`@keyframes loading-bar { 0% { left: -100%; width: 100%; } 100% { left: 100%; width: 100%; } }`}</style>
    </div>
  );

  if (view === 'artists') {
    const allArtists = [
      { name: 'Arijit Singh', img: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300' },
      { name: 'Sidhu Moose Wala', img: 'https://images.unsplash.com/photo-1520127877030-df4f6a4b33b9?w=300' },
      { name: 'Diljit Dosanjh', img: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300' },
      { name: 'The Weeknd', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300' },
      { name: 'Taylor Swift', img: 'https://images.unsplash.com/photo-1514525253361-bee8718a300a?w=300' },
      { name: 'Badshah', img: 'https://ui-avatars.com/api/?name=Badshah&background=random' },
      { name: 'Neha Kakkar', img: 'https://ui-avatars.com/api/?name=Neha+Kakkar&background=random' },
      { name: 'Jubin Nautiyal', img: 'https://ui-avatars.com/api/?name=Jubin+Nautiyal&background=random' },
      { name: 'Guru Randhawa', img: 'https://ui-avatars.com/api/?name=Guru+Randhawa&background=random' },
      { name: 'Darshan Raval', img: 'https://ui-avatars.com/api/?name=Darshan+Raval&background=random' },
      { name: 'Shreya Ghoshal', img: 'https://ui-avatars.com/api/?name=Shreya+Ghoshal&background=random' },
      { name: 'Armaan Malik', img: 'https://ui-avatars.com/api/?name=Armaan+Malik&background=random' },
      { name: 'Sunidhi Chauhan', img: 'https://ui-avatars.com/api/?name=Sunidhi+Chauhan&background=random' },
      { name: 'Atif Aslam', img: 'https://ui-avatars.com/api/?name=Atif+Aslam&background=random' },
      { name: 'Sonu Nigam', img: 'https://ui-avatars.com/api/?name=Sonu+Nigam&background=random' },
      { name: 'KK', img: 'https://ui-avatars.com/api/?name=KK&background=random' },
      { name: 'Lata Mangeshkar', img: 'https://ui-avatars.com/api/?name=Lata+Mangeshkar&background=random' },
      { name: 'Kishore Kumar', img: 'https://ui-avatars.com/api/?name=Kishore+Kumar&background=random' },
      { name: 'Mohit Chauhan', img: 'https://ui-avatars.com/api/?name=Mohit+Chauhan&background=random' },
      { name: 'Pritam', img: 'https://ui-avatars.com/api/?name=Pritam&background=random' },
      { name: 'Yo Yo Honey Singh', img: 'https://ui-avatars.com/api/?name=Honey+Singh&background=random' },
      { name: 'Drake', img: 'https://ui-avatars.com/api/?name=Drake&background=random' },
      { name: 'Justin Bieber', img: 'https://ui-avatars.com/api/?name=Justin+Bieber&background=random' },
      { name: 'Ed Sheeran', img: 'https://ui-avatars.com/api/?name=Ed+Sheeran&background=random' },
      { name: 'Dua Lipa', img: 'https://ui-avatars.com/api/?name=Dua+Lipa&background=random' },
      { name: 'Ariana Grande', img: 'https://ui-avatars.com/api/?name=Ariana+Grande&background=random' },
      { name: 'Billie Eilish', img: 'https://ui-avatars.com/api/?name=Billie+Eilish&background=random' },
      { name: 'Post Malone', img: 'https://ui-avatars.com/api/?name=Post+Malone&background=random' },
      { name: 'Bruno Mars', img: 'https://ui-avatars.com/api/?name=Bruno+Mars&background=random' },
      { name: 'Eminem', img: 'https://ui-avatars.com/api/?name=Eminem&background=random' },
      // ... and many more to reach 100+ list
    ];

    // Generating 100 names for the grid
    const extendedList = [...allArtists];
    const extraNames = ["Raftaar", "Emiway Bantai", "Krsna", "Divine", "Seedhe Maut", "Ritviz", "Prateek Kuhad", "Anuv Jain", "Taba Chake", "The Local Train", "A.R. Rahman", "Amit Trivedi", "Vishal Dadlani", "Shekhar Ravjiani", "Alka Yagnik", "Udit Narayan", "Kumar Sanu", "Asha Bhosle", "R.D. Burman", "Jagjit Singh", "Nusrat Fateh Ali Khan", "Rahat Fateh Ali Khan", "Shafqat Amanat Ali", "Ali Zafar", "Asim Azhar", "Momina Mustehsan", "Katy Perry", "Coldplay", "Imagine Dragons", "One Direction", "Zayn Malik", "Harry Styles", "Shawn Mendes", "Camila Cabello", "Selena Gomez", "Miley Cyrus", "Lady Gaga", "Beyonce", "Rihanna", "Shakira", "Sia", "Halsey", "Lana Del Rey", "Olivia Rodrigo", "Kendrick Lamar", "Travis Scott", "Kanye West", "Jay Z", "Future", "21 Savage", "Lil Baby", "Young Thug", "J. Cole", "Doja Cat", "Megan Thee Stallion", "Cardi B", "Nicki Minaj", "Lil Nas X", "Charlie Puth", "Sam Smith", "Adele", "Sia", "Kygo", "Alan Walker", "Marshmello", "Martin Garrix", "Avicii", "David Guetta", "Calvin Harris", "Zedd", "The Chainsmokers", "Blackpink", "BTS", "Twice", "NewJeans", "Fifty Fifty", "Stray Kids", "Red Velvet", "Exo", "Got7"];
    
    extraNames.forEach(name => {
      extendedList.push({ name, img: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff` });
    });

    return (
      <main className="main">
        {loading && <Loading />}
        <button className="btn-back" onClick={() => setView('home')}>← Back to Home</button>
        <h1 className="header-title" style={{marginBottom:'32px'}}>Top Artists</h1>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:'32px'}}>
          {extendedList.map((artist, idx) => (
            <div key={idx} onClick={() => doSearch(artist.name)} className="artist-card" style={{textAlign:'center', cursor:'pointer', transition:'transform 0.3s'}}>
              <div style={{width:'120px', height:'120px', borderRadius:'50%', marginBottom:'16px', margin:'0 auto 16px', overflow:'hidden', boxShadow:'0 8px 16px rgba(0,0,0,0.4)', border:'2px solid rgba(255,255,255,0.1)'}}>
                <img src={artist.img} alt={artist.name} style={{width:'100%', height:'100%', objectFit:'cover'}} />
              </div>
              <div style={{fontSize:'15px', fontWeight:'700', color:'#fff'}}>{artist.name}</div>
              <div style={{fontSize:'12px', color:'var(--text-muted)'}}>Artist</div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (view === 'home') {
    if (mode === 'video') {
      return (
        <main className="main">
          {loading && <Loading />}
          
          {/* Premium Video Hero Banner */}
          <div className="hero-banner video-hero-banner" style={{
            width: '100%',
            height: '340px',
            borderRadius: '24px',
            marginBottom: '36px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            padding: '0 60px',
            background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.85))',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=600&fit=crop" 
              alt="Video Hero" 
              style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', objectFit:'cover', zIndex:-1, filter:'brightness(0.55)' }}
            />
            <div className="hero-content" style={{ zIndex:1, maxWidth:'600px' }}>
              <span style={{ background:'var(--accent)', color:'#fff', fontSize:'12px', fontWeight:'800', padding:'6px 14px', borderRadius:'100px', textTransform:'uppercase', letterSpacing:'1px', display:'inline-block', marginBottom:'16px' }}>Video Space</span>
              <h1 style={{ fontSize:'clamp(32px, 5vw, 52px)', fontWeight:'900', color:'#fff', marginBottom:'16px', lineHeight:'1.1', textShadow:'0 4px 12px rgba(0,0,0,0.6)' }}>
                Watch & Discover <br/> Trending Content
              </h1>
              <p style={{ fontSize:'18px', color:'rgba(255,255,255,0.85)', marginBottom:'28px', maxWidth:'500px' }}>
                Explore high definition music videos, live streams, tutorials, and watch list favorites.
              </p>
              <div style={{ display:'flex', gap:'16px' }}>
                <button className="btn-play" onClick={() => doSearch('Trending Music Videos')} style={{ padding:'12px 32px', fontSize:'16px', borderRadius:'100px' }}>Watch Trending</button>
                <button className="btn-secondary" onClick={() => setView('library')} style={{ padding:'12px 32px', fontSize:'16px', borderRadius:'100px', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)' }}>Watch Later</button>
              </div>
            </div>
          </div>

          {/* Quick Categories Shelf */}
          <div className="video-categories-pills" style={{ display:'flex', gap:'12px', overflowX:'auto', paddingBottom:'8px', marginBottom:'40px', scrollbarWidth:'none' }}>
            {['Trending', 'Hindi Music', 'Lo-Fi Videos', 'Podcasts', 'Live Streams', 'Gaming', 'Tech Reviews', 'Comedy'].map(cat => (
              <button 
                key={cat} 
                className="video-cat-pill" 
                onClick={() => doSearch(cat)}
                style={{ 
                  padding:'8px 20px', 
                  borderRadius:'100px', 
                  background:'rgba(255,255,255,0.06)', 
                  border:'1px solid rgba(255,255,255,0.08)',
                  color:'#fff',
                  fontSize:'14px',
                  fontWeight:'600',
                  cursor:'pointer',
                  whiteSpace:'nowrap',
                  transition:'all 0.25s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="home-sections">
            {/* Top Video Channels */}
            <section className="shelf" style={{marginBottom:'56px'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'24px'}}>
                <h2 className="shelf-title" style={{fontSize:'26px', fontWeight:'800'}}>Explore Popular Channels</h2>
              </div>
              <div className="shelf-grid" style={{display:'flex', gap:'32px', overflowX:'auto', paddingBottom:'16px', scrollbarWidth:'none'}}>
                {[
                  { name: 'GateWay Classes', handle: '204K subscribers' },
                  { name: 'Coke Studio', handle: '14M subscribers' },
                  { name: 'Lofi Girl', handle: '14.3M subscribers' },
                  { name: 'T-Series', handle: '260M subscribers' },
                  { name: 'MKBHD', handle: '18M subscribers' },
                ].map(ch => (
                  <div key={ch.name} onClick={() => doChannelSearch(ch.name)} className="artist-card" style={{textAlign:'center', cursor:'pointer', flexShrink:0, transition:'transform 0.3s'}}>
                    <div style={{
                      width:'140px', 
                      height:'140px', 
                      borderRadius:'50%', 
                      marginBottom:'16px', 
                      background:'linear-gradient(135deg, #FF0000, #ff6b6b)',
                      display:'flex',
                      alignItems:'center',
                      justifyContent:'center',
                      boxShadow:'0 12px 24px rgba(255,0,0,0.25)', 
                      border:'2px solid rgba(255,255,255,0.1)',
                      fontSize:'42px',
                      fontWeight:'800',
                      color:'#fff'
                    }}>
                      {ch.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{fontSize:'16px', fontWeight:'700', color:'#fff'}}>{ch.name}</div>
                    <div style={{fontSize:'13px', color:'var(--text-muted)'}}>{ch.handle}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Video Categories Grid */}
            <section className="shelf" style={{marginBottom:'56px'}}>
              <h2 className="shelf-title" style={{fontSize:'26px', fontWeight:'800', marginBottom:'24px'}}>Browse Video Formats</h2>
              <div className="shelf-grid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'24px'}}>
                {[
                  { name: 'Trending Clips', color: '#e52d27', color2: '#b31217', icon: '🎬' },
                  { name: 'Live Gaming Streams', color: '#7F00FF', color2: '#E100FF', icon: '🎮' },
                  { name: 'Premium Podcasts', color: '#11998e', color2: '#38ef7d', icon: '🎙️' },
                  { name: 'Cinematic Hits', color: '#f12711', color2: '#f5af19', icon: '🎥' },
                  { name: 'Educational Tutorials', color: '#00c6ff', color2: '#0072ff', icon: '🎓' },
                  { name: 'Comedy & Vlogs', color: '#ff4b1f', color2: '#ff9068', icon: '🔥' },
                ].map(genre => (
                  <div 
                    key={genre.name} 
                    onClick={() => doSearch(genre.name)} 
                    style={{
                      height:'150px', 
                      background: `linear-gradient(135deg, ${genre.color}, ${genre.color2})`, 
                      borderRadius:'20px', 
                      padding:'24px', 
                      position:'relative',
                      cursor:'pointer',
                      boxShadow:'0 15px 30px rgba(0,0,0,0.4)',
                      overflow:'hidden',
                      transition:'all 0.3s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.6)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.4)'; }}
                  >
                    <div style={{ fontSize:'22px', fontWeight:'900', color:'#fff', lineHeight:'1.2', textShadow:'0 2px 4px rgba(0,0,0,0.3)' }}>{genre.name}</div>
                    <div style={{ position:'absolute', bottom:'-10px', right:'-10px', fontSize:'80px', opacity:'0.25', transform:'rotate(-15deg)' }}>{genre.icon}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      );
    }

    return (
      <main className="main">
        {loading && <Loading />}
        
        {/* Premium Hero Banner */}
        <div className="hero-banner" style={{
          width: '100%',
          height: '340px',
          borderRadius: '24px',
          marginBottom: '48px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          padding: '0 60px',
          background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7))',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        }}>
          <img 
            src="/home/dell/.gemini/antigravity/brain/be2ee8e0-bd23-48e2-820c-e2b003c7b6f0/hero_banner_music_1778416149254.png" 
            alt="Hero" 
            style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', objectFit:'cover', zIndex:-1, filter:'brightness(0.7)' }}
          />
          <div className="hero-content" style={{ zIndex:1, maxWidth:'600px' }}>
            <h1 style={{ fontSize:'clamp(32px, 5vw, 56px)', fontWeight:'900', color:'#fff', marginBottom:'16px', lineHeight:'1.1', textShadow:'0 4px 12px rgba(0,0,0,0.5)' }}>
              Explore the World <br/> of Music
            </h1>
            <p style={{ fontSize:'18px', color:'rgba(255,255,255,0.8)', marginBottom:'32px', maxWidth:'500px' }}>
              Discover new releases, trending artists, and curated playlists tailored just for you.
            </p>
            <div style={{ display:'flex', gap:'16px' }}>
              <button className="btn-play" onClick={() => doSearch('Top Hits')} style={{ padding:'12px 32px', fontSize:'16px', borderRadius:'100px' }}>Listen Now</button>
              <button className="btn-secondary" onClick={() => setView('library')} style={{ padding:'12px 32px', fontSize:'16px', borderRadius:'100px', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)' }}>View Library</button>
            </div>
          </div>
        </div>

        <div className="home-sections">
          <section className="shelf" style={{marginBottom:'56px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'24px'}}>
              <h2 className="shelf-title" style={{fontSize:'26px', fontWeight:'800'}}>Top Artists</h2>
              <span onClick={() => setView('artists')} style={{fontSize:'14px', color:'var(--accent)', fontWeight:'600', cursor:'pointer'}}>See All</span>
            </div>
            <div className="shelf-grid" style={{display:'flex', gap:'32px', overflowX:'auto', paddingBottom:'16px', scrollbarWidth:'none'}}>
              {[
                { name: 'Arijit Singh', img: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300&h=300&fit=crop' },
                { name: 'Sidhu Moose Wala', img: 'https://images.unsplash.com/photo-1520127877030-df4f6a4b33b9?w=300&h=300&fit=crop' },
                { name: 'Diljit Dosanjh', img: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop' },
                { name: 'The Weeknd', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop' },
                { name: 'Taylor Swift', img: 'https://images.unsplash.com/photo-1514525253361-bee8718a300a?w=300&h=300&fit=crop' },
              ].map(artist => (
                <div key={artist.name} onClick={() => doSearch(artist.name)} className="artist-card" style={{textAlign:'center', cursor:'pointer', flexShrink:0, transition:'transform 0.3s'}}>
                  <div style={{width:'150px', height:'150px', borderRadius:'50%', marginBottom:'16px', overflow:'hidden', boxShadow:'0 12px 24px rgba(0,0,0,0.4)', border:'2px solid rgba(255,255,255,0.1)'}}>
                    <img src={artist.img} alt={artist.name} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                  </div>
                  <div style={{fontSize:'16px', fontWeight:'700', color:'#fff'}}>{artist.name}</div>
                  <div style={{fontSize:'13px', color:'var(--text-muted)'}}>Artist</div>
                </div>
              ))}
            </div>
          </section>

          <section className="shelf" style={{marginBottom:'56px'}}>
            <h2 className="shelf-title" style={{fontSize:'26px', fontWeight:'800', marginBottom:'24px'}}>Explore Genres & Eras</h2>
            <div className="shelf-grid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'24px'}}>
              {[
                { name: 'Lofi', color: '#8E2DE2', color2: '#4A00E0', icon: '🎧' },
                { name: 'Hip Hop', color: '#11998e', color2: '#38ef7d', icon: '🎤' },
                { name: 'Pop', color: '#fc466b', color2: '#3f5efb', icon: '🌟' },
                { name: '90s Hits', color: '#f7971e', color2: '#ffd200', icon: '📼' },
                { name: '80s Retro', color: '#ff00cc', color2: '#3333ff', icon: '🕶️' },
                { name: '70s Classics', color: '#56ab2f', color2: '#a8e063', icon: '📻' },
                { name: '60s Oldies', color: '#614385', color2: '#516395', icon: '💿' },
                { name: 'Bollywood', color: '#f8ff00', color2: '#3ad59f', icon: '🎬' },
                { name: 'Rock', color: '#eb3349', color2: '#f45c43', icon: '🎸' },
              ].map(genre => (
                <div 
                  key={genre.name} 
                  onClick={() => doSearch(genre.name)} 
                  style={{
                    height:'140px', 
                    background: `linear-gradient(135deg, ${genre.color}, ${genre.color2})`, 
                    borderRadius:'20px', 
                    padding:'24px', 
                    position:'relative',
                    cursor:'pointer',
                    boxShadow:'0 15px 30px rgba(0,0,0,0.4)',
                    overflow:'hidden',
                    transition:'all 0.3s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.6)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.4)'; }}
                >
                  <div style={{ fontSize:'24px', fontWeight:'900', color:'#fff', textShadow:'0 2px 4px rgba(0,0,0,0.3)' }}>{genre.name}</div>
                  <div style={{ position:'absolute', bottom:'-10px', right:'-10px', fontSize:'80px', opacity:'0.2', transform:'rotate(-15deg)' }}>{genre.icon}</div>
                </div>
              ))}
            </div>
          </section>

          {playlists["Most Played"]?.length > 0 && (
            <section className="shelf" style={{marginBottom:'56px'}}>
              <h2 className="shelf-title" style={{fontSize:'26px', fontWeight:'800', marginBottom:'24px'}}>Your Top Tracks</h2>
              <div className="shelf-grid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:'24px'}}>
                {playlists["Most Played"].slice(0, 6).map(s => (
                  <div key={s.id} className="playlist-card" onClick={() => playSong(s)} style={{background:'rgba(255,255,255,0.03)', padding:'16px', borderRadius:'16px', transition:'all 0.3s'}}>
                    <img src={s.thumbnail} alt="" style={{width:'100%', aspectRatio:'1', objectFit:'cover', borderRadius:'12px', marginBottom:'16px', boxShadow:'0 8px 16px rgba(0,0,0,0.3)'}} />
                    <div className="p-title" style={{fontSize:'16px', fontWeight:'700', marginBottom:'4px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{s.title}</div>
                    <div className="p-count" style={{fontSize:'14px', color:'var(--accent)'}}>{s.playCount} plays</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    );
  }

  if (view === 'library') {
    if (activePlaylist) {
      const tracks = playlists[activePlaylist] || [];
      return (
        <main className="main">
          {loading && <Loading />}
          <button className="btn-back" onClick={() => setActivePlaylist(null)}>← Back to Library</button>
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

        {/* ── Saved Videos (Watch Later) ── */}
        {savedVideos.length > 0 && (
          <section style={{marginBottom:'48px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
              <h2 style={{fontSize:'20px', fontWeight:'700', display:'flex', alignItems:'center', gap:'10px'}}>
                <svg viewBox="0 0 24 24" style={{width:22,height:22,fill:'var(--accent)'}}><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/></svg>
                Watch Later
              </h2>
              <span style={{fontSize:'13px', color:'var(--text-muted)'}}>{savedVideos.length} videos</span>
            </div>
            <div className="video-grid">
              {savedVideos.map((v, i) => (
                <div key={`saved-${v.id}-${i}`} className="video-card">
                  <div className="video-thumb-wrap" onClick={() => onPlayVideo(v)}>
                    <img src={v.thumbnail} alt={v.title} className="video-thumb" loading="lazy" />
                    <div className="video-play-overlay">
                      <div className="video-play-btn"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
                    </div>
                    {v.duration > 0 && <span className="video-duration-badge">{fmt(v.duration)}</span>}
                  </div>
                  <div className="video-card-info">
                    <p className="video-card-title" onClick={() => onPlayVideo(v)}>{v.title}</p>
                    <div className="video-card-meta">
                      <span className="video-card-channel video-card-channel-link" onClick={() => doChannelSearch(v.channel)}>{v.channel}</span>
                      <button className="video-save-btn saved" onClick={() => toggleSaveVideo(v)} title="Remove">
                        <svg viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
                        Saved
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Music Playlists ── */}
        <h2 style={{fontSize:'20px', fontWeight:'700', marginBottom:'20px'}}>Music Playlists</h2>
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

  // ── CHANNEL VIEW ─────────────────────────────────────────────────────
  if (view === 'channel') {
    return (
      <main className="main">
        {loading && <Loading />}
        <button className="btn-back" onClick={() => setView('search')}>← Back to Results</button>
        <div className="channel-header">
          <div className="channel-avatar">
            {channelName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="header-title" style={{marginBottom:6}}>{channelName}</h1>
            <p style={{color:'var(--text-muted)', fontSize:14}}>{results.length} videos found</p>
          </div>
        </div>
        {results.length === 0 ? (
          <div className="video-empty">
            <p style={{color:'var(--text-muted)'}}>No videos found for this channel</p>
          </div>
        ) : (
          <div className="video-grid">
            {results.map((v, i) => (
              <div key={`ch-${v.id}-${i}`} className="video-card">
                <div className="video-thumb-wrap" onClick={() => onPlayVideo(v)}>
                  <img src={v.thumbnail} alt={v.title} className="video-thumb" loading="lazy" />
                  <div className="video-play-overlay">
                    <div className="video-play-btn"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
                  </div>
                  {v.duration > 0 && <span className="video-duration-badge">{fmt(v.duration)}</span>}
                  {v.duration > 0 && v.duration < 60 && <span className="video-shorts-badge">Shorts</span>}
                </div>
                <div className="video-card-info">
                  <p className="video-card-title" onClick={() => onPlayVideo(v)}>{v.title}</p>
                  <div className="video-card-meta">
                    <span className="video-card-channel">{v.channel}</span>
                    <button
                      className={`video-save-btn ${isSaved(v.id) ? 'saved' : ''}`}
                      onClick={(e) => { e.stopPropagation(); toggleSaveVideo(v); }}
                    >
                      {isSaved(v.id) ? (
                        <svg viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
                      ) : (
                        <svg viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/></svg>
                      )}
                      {isSaved(v.id) ? 'Saved' : 'Watch Later'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
    // ── VIDEO MODE ───────────────────────────────────────────────────────────
    if (mode === 'video') {
      if (results.length === 0) return (
        <main className="main">
          {loading && <Loading />}
          <div className="video-empty">
            <svg viewBox="0 0 24 24" style={{width:64,height:64,fill:'rgba(255,255,255,0.15)',marginBottom:16}}>
              <path d="M21 3H3a2 2 0 00-2 2v14a2 2 0 002 2h18a2 2 0 002-2V5a2 2 0 00-2-2zm-9 13l-6-4 6-4v8z"/>
            </svg>
            <p style={{color:'var(--text-muted)',fontSize:16}}>Search for YouTube videos above</p>
          </div>
        </main>
      );
      return (
        <main className="main">
          {loading && <Loading />}
          <div className="video-mode-header">
            <h1 className="header-title" style={{marginBottom:0}}>Results for "{searchQuery}"</h1>
            <p style={{color:'var(--text-muted)',fontSize:14,marginTop:4}}>{results.length} videos found</p>
          </div>
          <div className="video-grid">
            {results.map((v, i) => (
              <div
                key={`${v.id}-${i}`}
                className="video-card"
                id={`video-card-${v.id}`}
              >
                <div className="video-thumb-wrap" onClick={() => onPlayVideo(v)}>
                  <img src={v.thumbnail} alt={v.title} className="video-thumb" loading="lazy" />
                  <div className="video-play-overlay">
                    <div className="video-play-btn">
                      <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                  {v.duration > 0 && (
                    <span className="video-duration-badge">{fmt(v.duration)}</span>
                  )}
                </div>
                <div className="video-card-info">
                  <p className="video-card-title" onClick={() => onPlayVideo(v)}>{v.title}</p>
                  <div className="video-card-meta">
                    <span
                      className="video-card-channel video-card-channel-link"
                      onClick={() => doChannelSearch(v.channel)}
                      title={`See videos from ${v.channel}`}
                    >
                      {v.channel}
                    </span>
                    <button
                      className={`video-save-btn ${isSaved(v.id) ? 'saved' : ''}`}
                      title={isSaved(v.id) ? 'Remove from Watch Later' : 'Save to Watch Later'}
                      onClick={(e) => { e.stopPropagation(); toggleSaveVideo(v); }}
                    >
                      {isSaved(v.id) ? (
                        <svg viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
                      ) : (
                        <svg viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/></svg>
                      )}
                      {isSaved(v.id) ? 'Saved' : 'Watch Later'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      );
    }

    // ── MUSIC MODE (unchanged) ───────────────────────────────────────────────
    if (results.length === 0) return <main className="main">{loading && <Loading />}<div className="empty-msg">No results found</div></main>;
    const topHit = results[0];
    return (
      <main className="main">
        {loading && <Loading />}
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
            <div key={`${s.id}-${i}`} className={`track-item ${current?.id === s.id ? 'playing' : ''}`} style={{position:'relative'}}>
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
              <div style={{fontSize:'16px', fontWeight:'500'}}>Dynamic Theme</div>
              <div style={{fontSize:'13px', color:'var(--text-muted)'}}>Match color to current song artwork</div>
            </div>
            <button 
              onClick={() => setAutoTheme(!autoTheme)}
              style={{
                width: '50px',
                height: '26px',
                borderRadius: '13px',
                background: autoTheme ? themeColor : 'rgba(255,255,255,0.1)',
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
                left: autoTheme ? '28px' : '4px',
                transition: 'all 0.3s'
              }}></div>
            </button>
          </div>

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
