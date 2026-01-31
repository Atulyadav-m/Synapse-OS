import React, { useState } from 'react';
import Editor from './views/Editor'; // Editor import kiya

// Pehle wali testing ke liye functions (zaroorat nahi par rakhenge backup ke liye)
import { invoke } from '@tauri-apps/api/core';

function App() {
  // State to switch between "Dev Mode" (JSON) and "Visual Editor"
  const [mode, setMode] = useState<'editor' | 'dev'>('editor');

  return (
    <div className="container" style={{ height: '100vh', margin: 0, padding: 0 }}>
      
      {/* --- NAV BAR --- */}
      <nav style={{
        background: '#1e293b', color: 'white', padding: '10px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>🧠 Synapse-OS</div>
        
        <div>
          <button 
            onClick={() => setMode('editor')}
            style={{
              background: mode === 'editor' ? '#ef6c00' : '#334155',
              border: 'none', color: 'white', padding: '8px 16px',
              marginRight: '10px', borderRadius: '4px', cursor: 'pointer'
            }}
          >
            🎨 Visual Editor
          </button>
          <button 
            onClick={() => setMode('dev')}
            style={{
              background: mode === 'dev' ? '#ef6c00' : '#334155',
              border: 'none', color: 'white', padding: '8px 16px',
              borderRadius: '4px', cursor: 'pointer'
            }}
          >
            ⚙️ Dev Mode (JSON)
          </button>
        </div>
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <div style={{ height: 'calc(100vh - 50px)' }}>
        {mode === 'editor' ? (
          <Editor /> 
        ) : (
          // Old Dev Mode Content (JSON Testing)
          <div style={{ padding: '20px', textAlign: 'center', marginTop: '50px' }}>
            <h2>Dev Mode (JSON Testing)</h2>
            <p>Backend commands ke liye testing interface yahan ayega.</p>
            {/* (Purana logic short mein) */}
          </div>
        )}
      </div>

    </div>
  );
}

export default App;
