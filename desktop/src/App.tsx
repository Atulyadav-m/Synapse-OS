
import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import './App.css'; // Default styling, hum ise baad mein customize karenge

function App() {
  // --- STATES ---
  const [greetMsg, setGreetMsg] = useState('');
  const [name, setName] = useState('');
  const [workflowJson, setWorkflowJson] = useState(
    JSON.stringify([
      { id: "1", type: "log", data: { message: "Hello from Synapse-OS" } },
      { id: "2", type: "delay", data: { ms: 2000 } }
    ], null, 2)
  );
  const [resultLogs, setResultLogs] = useState<string[]>([]);

  // --- FUNCTIONS ---

  // 1. Test Connection
  async function greet() {
    // Rust backend mein "greet" command ko call karega
    setGreetMsg(await invoke('greet', { name }));
  }

  // 2. Run Workflow
  async function runTheWorkflow() {
    setResultLogs([]);
    try {
      // Rust backend mein "run_workflow" command ko call karega
      const result: any = await invoke('run_workflow', { 
        nodes: JSON.parse(workflowJson) 
      });
      
      console.log("Result from Rust:", result);
      
      if (result.success) {
        alert("✅ Success: " + result.message);
        setResultLogs(result.logs);
      } else {
        alert("❌ Error: " + result.message);
      }
    } catch (error) {
      console.error(error);
      alert("⚠️ JSON Parse Error. Check format.");
    }
  }

  return (
    <div className="container" style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* HEADER */}
      <div style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1>🧠 Synapse-OS</h1>
        <p>Visual Automation Platform (Dev Mode)</p>
      </div>

      {/* SECTION 1: CONNECTION TEST */}
      <div style={{ marginBottom: '40px', padding: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
        <h3>🔌 Connection Test</h3>
        <p>Rust Backend se baat karne ke liye button dabayein.</p>
        
        <div style={{ marginTop: '10px' }}>
          <input 
            type="text" 
            onChange={(e) => setName(e.currentTarget.value)} 
            placeholder="Enter a name..." 
            style={{ padding: '8px', marginRight: '10px' }}
          />
          <button type="button" onClick={() => greet()} style={{ padding: '8px 16px', cursor: 'pointer' }}>
            Greet
          </button>
        </div>
        <p><strong>Rust Response:</strong> {greetMsg}</p>
      </div>

      {/* SECTION 2: WORKFLOW EXECUTION (JSON MODE) */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
        <h3>⚙️ Run Workflow (JSON)</h3>
        <p>Niche JSON mein nodes modify karke 'Execute' dabayein. (Ye Visual Node Editor ki jagah abhi manual hai)</p>
        
        <textarea 
          rows={10} 
          style={{ 
            width: '100%', 
            fontFamily: 'monospace', 
            marginTop: '10px',
            backgroundColor: '#f4f4f4'
          }}
          value={workflowJson}
          onChange={(e) => setWorkflowJson(e.currentTarget.value)}
        />
        
        <br /><br />
        <button 
          onClick={runTheWorkflow} 
          style={{ 
            backgroundColor: '#28a745', 
            color: 'white', 
            padding: '10px 20px', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ▶ Execute Workflow
        </button>

        {/* LOGS DISPLAY */}
        {resultLogs.length > 0 && (
          <div style={{ marginTop: '20px', backgroundColor: '#333', color: '#0f0', padding: '10px', fontFamily: 'monospace', borderRadius: '4px' }}>
            <strong>📜 Execution Logs:</strong>
            <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
              {resultLogs.map((log, index) => (
                <li key={index}>{log}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

    </div>
  );
}

export default App;
