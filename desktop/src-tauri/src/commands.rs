use serde::{Deserialize, Serialize};
use tauri::State;
use enigo::{Enigo, MouseControllable, KeyControllable, Keyboard, Key};

// --- DATA TYPES ---
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkflowNode {
    pub id: String,
    #[serde(rename = "type")]
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

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! Synapse-OS Backend is online.", name)
}

#[tauri::command]
pub async fn run_workflow(nodes: Vec<WorkflowNode>) -> Result<ExecutionResult, String> {
    println!("🚀 Workflow Execution Started...");
    
    // Enigo setup (Mouse/Keyboard Controller)
    let mut enigo = Enigo::new(&Settings::default()).map_err(|e| e.to_string())?;
    
    let mut logs = Vec::new();
    let mut success_count = 0;

    for node in nodes {
        println!("⚙️ Executing Node: {}", node.node_type);
        
        // --- NEW LOGIC: REAL AUTOMATION ---
        match node.node_type.as_str() {
            "log" => {
                let msg = node.data["message"].as_str().unwrap_or("No message");
                logs.push(format!("LOG: {}", msg));
            }
            
            "mouse_move" => {
                let x = node.data["x"].as_u64().unwrap_or(100);
                let y = node.data["y"].as_u64().unwrap_or(100);
                logs.push(format!("🖱️ Moving mouse to ({}, {})", x, y));
                enigo.mouse_move_to(x as i32, y as i32).map_err(|e| e.to_string())?;
                // Thoda wait taaki user dekh sake
                std::thread::sleep(std::time::Duration::from_millis(500));
            }

            "mouse_click" => {
                logs.push("🖱️ Clicking Left Mouse Button".to_string());
                enigo.mouse_click(MouseButton::Left).map_err(|e| e.to_string())?;
                std::thread::sleep(std::time::Duration::from_millis(200));
            }

            "type_text" => {
                let text = node.data["text"].as_str().unwrap_or("Hello World");
                logs.push(format!("⌨️ Typing: {}", text));
                enigo.key_sequence(text).map_err(|e| e.to_string())?;
            }

            "delay" => {
                let ms = node.data["ms"].as_u64().unwrap_or(1000);
                logs.push(format!("⏳ Waiting {}ms...", ms));
                std::thread::sleep(std::time::Duration::from_millis(ms));
            }

            _ => {
                logs.push(format!("⚠️ Unknown node type: {}", node.node_type));
            }
        }

        success_count += 1;
    }

    Ok(ExecutionResult {
        success: true,
        message: format!("Automation Complete! Executed {} nodes.", success_count),
        logs,
    })
}

// Note: MouseButton enum is needed. Enigo exports it usually, 
// if compile error occurs, ensure version matches or import properly.
