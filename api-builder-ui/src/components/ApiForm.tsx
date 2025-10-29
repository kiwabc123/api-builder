import { useState } from "react";
import axios from "axios";

interface ApiFormProps {
  onApiCreated: (api: any) => void;
}

export default function ApiForm({ onApiCreated }: ApiFormProps) {
  const [method, setMethod] = useState("GET");
  const [path, setPath] = useState("");
  const [type, setType] = useState("database");
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("{}");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/_builder/create", {
        method,
        path,
        type,
        query: type === "database" ? query : undefined,
        response: type === "static" ? JSON.parse(response) : undefined,
      });
      onApiCreated(res.data.api);
      alert("API created!");
      setPath("");
      setQuery("");
      setResponse("{}");
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: 20,
        marginBottom: 20,
        border: "1px solid #ccc",
        borderRadius: 8,
        backgroundColor: "#f9f9f9",
        maxWidth: 600,
      }}
    >
      <h2 style={{ marginBottom: 15 }}>Create New API</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <div style={{ flex: 1 }}>
          <label>Method:</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            style={{ width: "100%", padding: 5, borderRadius: 4 }}
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
          </select>
        </div>

        <div style={{ flex: 2 }}>
          <label>Path:</label>
          <input
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="/users"
            style={{ width: "100%", padding: 5, borderRadius: 4, border: "1px solid #ccc" }}
          />
        </div>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Type:</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ width: "100%", padding: 5, borderRadius: 4 }}
        >
          <option value="database">Database</option>
          <option value="static">Static Response</option>
        </select>
      </div>

      {type === "database" && (
        <div style={{ marginBottom: 10 }}>
          <label>Query:</label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 4,
              border: "1px solid #ccc",
              minHeight: 80,
            }}
          />
        </div>
      )}

      {type === "static" && (
        <div style={{ marginBottom: 10 }}>
          <label>Response (JSON):</label>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 4,
              border: "1px solid #ccc",
              minHeight: 80,
            }}
          />
        </div>
      )}

      <button
        type="submit"
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Create API
      </button>
    </form>
  );
}
