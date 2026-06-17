import { useState } from "react";

export default function IssueDescription({ setIssueData }) {
  const [issue, setIssue] = useState("");
  const [urgency, setUrgency] = useState("normal");

  const handleChange = (text) => {
    setIssue(text);
    setIssueData({
      description: text,
      urgency: urgency
    });
  };

  const handleUrgency = (level) => {
    setUrgency(level);
    setIssueData({
      description: issue,
      urgency: level
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      
      <label><b>Describe your issue</b></label>
      
      <textarea
        placeholder="Example: Tap leaking in kitchen, water dripping continuously"
        value={issue}
        onChange={(e) => handleChange(e.target.value)}
        rows={4}
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      <div>
        <b>Urgency Level</b>
        <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
          
          <button onClick={() => handleUrgency("low")}>
            Low
          </button>

          <button onClick={() => handleUrgency("normal")}>
            Normal
          </button>

          <button onClick={() => handleUrgency("urgent")}>
            Urgent ⚡
          </button>

        </div>
      </div>

    </div>
  );
}