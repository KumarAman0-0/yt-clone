import React from 'react';

export default function Sidebar({ view, setView, mode, setMode }) {
  const handleModeToggle = () => {
    if (mode === 'video') {
      setMode('music');
      setView('home');
    } else {
      setMode('video');
      setView('search');
    }
  };

  return (
    <nav className="sidebar">
      <button 
        className={`nav-item ${view === 'home' ? 'active' : ''}`} 
        onClick={() => setView('home')}
      >
        <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        <span>Home</span>
      </button>
      <button 
        className={`nav-item ${view === 'library' ? 'active' : ''}`} 
        onClick={() => setView('library')}
      >
        <svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM10 9v3h4v-3h-4z"/></svg>
        <span>Library</span>
      </button>

      {/* Mode Toggle */}
      <button
        className={`nav-item nav-mode-toggle ${mode === 'video' ? 'nav-mode-video' : 'nav-mode-music'}`}
        id="nav-mode-toggle"
        onClick={handleModeToggle}
      >
        {mode === 'video' ? (
          <>
            <svg viewBox="0 0 24 24"><path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z"/></svg>
            <span>Music</span>
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24"><path d="M21 3H3a2 2 0 00-2 2v14a2 2 0 002 2h18a2 2 0 002-2V5a2 2 0 00-2-2zm-9 13l-6-4 6-4v8z"/></svg>
            <span>Video</span>
          </>
        )}
      </button>

      <button
        className={`nav-item ${view === 'themes' ? 'active' : ''}`} 
        onClick={() => setView('themes')}
      >
        <svg viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
        <span>Themes</span>
      </button>
    </nav>
  );
}

