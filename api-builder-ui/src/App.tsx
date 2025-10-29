import { useState, useEffect } from "react";
import ApiForm from "./components/ApiForm";
import ApiList from "./components/ApiList";
import axios from "axios";

export default function App() {
  const [apis, setApis] = useState<any[]>([]);

  const loadApis = async () => {
    try {
      const res = await axios.get("http://localhost:4000/_builder/list");
      setApis(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadApis();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Dynamic API Builder</h1>
      <ApiForm onApiCreated={(api) => setApis((prev) => [...prev, api])} />
      <ApiList apis={apis} />
    </div>
  );
}
