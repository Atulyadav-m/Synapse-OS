
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

// --- INITIAL WORKFLOW DATA (Demo Nodes) ---
// Ye starting mein dikhenge ki editor khali nahi hai
const initialNodes: Node[] = [
  { id: '1', type: 'input', data: { label: '🟢 Start Trigger' }, position: { x: 250, y: 25 } },
  { id: '2', data: { label: '🤖 AI Agent (Chat)' }, position: { x: 100, y: 125 } },
  { id: '3', data: { label: '📁 File: Save to Disk' }, position: { x: 400, y: 125 } },
  { id: '4', type: 'output', data: { label: '🔴 End' }, position: { x: 250, y: 250 } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, label: 'Run' },
  { id: 'e2-3', source: '2', target: '3', label: 'Result' },
  { id: 'e3-4', source: '3', target: '4', animated: true },
];

export default function Editor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Jab aap ek node ko se doosri node ke "handle" se connect karoge
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // Workflow ko save karna (Console print karke test kar rahe hain)
  const handleSave = () => {
    const workflowData = { nodes, edges };
    console.log("💾 Workflow Saved:", workflowData);
    alert("Workflow structure ready! Check Console (F12) for JSON.");
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      
      {/* TOP BAR */}
      <div style={{
        position: 'absolute', top: 10, left: 10, zIndex: 10,
        background: 'white', padding: '10px', borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <strong style={{ marginRight: '15px' }}>🧠 Synapse-OS Editor</strong>
        <button 
          onClick={handleSave}
          style={{
            backgroundColor: '#ef6c00', color: 'white', border: 'none',
            padding: '5px 15px', borderRadius: '4px', cursor: 'pointer'
          }}
        >
          Save JSON
        </button>
      </div>

      {/* MAIN CANVAS */}
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
  );
}
