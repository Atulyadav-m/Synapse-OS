import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Tauri ke core API ko import kiya (Rust ke pass jane ke liye)
import { invoke } from '@xyflow/react'; // Note: Actually from '@tauri-apps/api/core'
import { invoke as tauriInvoke } from '@tauri-apps/api/core';

// --- INITIAL DATA ---
const initialNodes: Node[] = [
  { id: '1', type: 'input', data: { label: '🟢 Start' }, position: { x: 250, y: 25 } },
  { id: '2', data: { label: '📝 Log: Hello World' }, position: { x: 100, y: 125 } },
  { id: '3', data: { label: '⏳ Delay: 2s' }, position: { x: 400, y: 125 } },
  { id: '4', type: 'output', data: { label: '🔴 End' }, position: { x: 250, y: 250 } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e3-4', source: '3', target: '4' },
];

export default function Editor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // Logs ke liye state (Rust se wapas ayega)
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // --- MAIN EXECUTION FUNCTION ---
  const handleRunWorkflow = async () => {
    setIsRunning(true);
    setLogs([]); // Purane logs saaf karo
    setLogs((prev) => [...prev, "🚀 Sending workflow to Rust Engine..."]);

    try {
      // 1. React Flow ka data Rust ke format mein convert karna
      const nodesForRust = nodes.map((node) => ({
        id: node.id,
        node_type: node.type || 'default', // Agar type nahi hai to 'default'
        data: node.data,
      }));

      // 2. Rust Backend ko command bhejna
      const result: any = await tauriInvoke('run_workflow', { 
        nodes: nodesForRust 
      });

      // 3. Result ka display
      if (result.success) {
        setLogs((prev) => [...prev, "✅ " + result.message]);
        if (result.logs) {
          setLogs((prev) => [...prev, ...result.logs]);
        }
      } else {
        setLogs((prev) => [...prev, "❌ Error: " + result.message]);
      }

    } catch (error) {
      console.error(error);
      setLogs((prev) => [...prev, "⚠️ System Error: Check console"]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* TOP BAR */}
      <div style={{
        background: '#1e293b', color: 'white', padding: '10px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 10, borderBottom: '1px solid #334155'
      }}>
        <div>
          <strong>🧠 Synapse-OS Editor</strong>
        </div>
        
        <button 
          onClick={handleRunWorkflow}
          disabled={isRunning}
          style={{
            backgroundColor: isRunning ? '#94a3b8' : '#10b981', // Green or Grey
            color: 'white', border: 'none',
            padding: '8px 20px', borderRadius: '6px', cursor: 'pointer',
            fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          {isRunning ? '⏳ Running...' : '▶ Run Workflow'}
        </button>
      </div>

      {/* SPLIT SCREEN: CANVAS + LOGS */}
      <div style={{ display: 'flex', flex: 1, height: 'calc(100vh - 60px)' }}>
        
        {/* LEFT: VISUAL EDITOR (80%) */}
        <div style={{ width: '80%', height: '100%' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            style={{ backgroundColor: '#f8f9fa' }}
          >
            <Controls />
            <MiniMap nodeColor="#ef6c00" />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>

        {/* RIGHT: LOGS PANEL (20%) */}
        <div style={{
          width: '20%', backgroundColor: '#0f172a', color: '#38bdf8',
          padding: '15px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '12px',
          borderLeft: '1px solid #334155'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: 'white' }}>📜 Execution Logs</h4>
          {logs.length === 0 ? (
            <span style={{ color: '#64748b' }}>Waiting for execution...</span>
          ) : (
            logs.map((log, index) => (
              <div key={index} style={{ marginBottom: '5px', borderBottom: '1px solid #1e293b', paddingBottom: '2px' }}>
                {log}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
