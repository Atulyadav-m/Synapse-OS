
// Synapse-OS: Tauri Commands
// Ye file woh functions hai jo React UI se call honge.

use serde::{Deserialize, Serialize};
use tauri::State;

// --- DATA TYPES ---
// Ye define karta hai ki Node ka data structure kaise hoga

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkflowNode {
    pub id: String,
    #[serde(rename = "type")] // "type" Rust mein reserved keyword hai
    pub node_type: String,
    pub data: serde_json::Value,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ExecutionResult {
    pub success: bool,
    pub message: String,
    pub logs: Vec<String>,
}

// --- COMMANDS ---

/// Command 1: Simple Connection Test
/// Ye check karne ke liye hai ki Backend chal raha hai ya nahi.
#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! Synapse-OS Backend is online.", name)
}

/// Command 2: Run Workflow (The Main Heart)
/// React se workflow (nodes list) aayegi, yeh execute karega.
#[tauri::command]
pub async fn run_workflow(nodes: Vec<WorkflowNode>) -> Result<ExecutionResult, String> {
    println!("🚀 Workflow Execution Started...");
    println!("📦 Total Nodes Received: {}", nodes.len());

    let mut logs = Vec::new();
    let mut success_count = 0;

    // Abhi ke liye hum logic simulate kar rahe hain.
    // Baad mein isme hum "Core Engine" ko call karenge.
    
    for node in nodes {
        println!("⚙️ Executing Node: {} ({})", node.id, node.node_type);
        logs.push(format!("Processing node: {} ({})", node.id, node.node_type));

        // Mock Logic: Different nodes ke liye alag behavior
        match node.node_type.as_str() {
            "log" => {
                let msg = node.data["message"].as_str().unwrap_or("No message");
                logs.push(format!("LOG OUTPUT: {}", msg));
            }
            "delay" => {
                let ms = node.data["ms"].as_u64().unwrap_or(1000);
                // Fake delay ke liye tokio::time::sleep use karenge future mein
                logs.push(format!("Waiting for {}ms...", ms));
            }
            "file_move" => {
                let src = node.data["source"].as_str().unwrap_or("?");
                let dest = node.data["dest"].as_str().unwrap_or("?");
                logs.push(format!("Moving {} to {}", src, dest));
            }
            _ => {
                logs.push(format!("⚠️ Unknown node type: {}", node.node_type));
            }
        }

        success_count += 1;
    }

    println!("✅ Workflow Completed.");

    Ok(ExecutionResult {
        success: true,
        message: format!("Executed {} nodes successfully.", success_count),
        logs,
    })
}

/// Command 3: System Info
/// User ko batayega ki CPU/Memory kitni khali hai (Load check).
#[tauri::command]
pub fn get_system_info() -> SystemInfo {
    SystemInfo {
        os: std::env::consts::OS.to_string(),
        arch: std::env::consts::ARCH.to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
    }
}

#[derive(Serialize)]
pub struct SystemInfo {
    os: String,
    arch: String,
    version: String,
}
