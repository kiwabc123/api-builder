import express from "express";
import fs from "fs";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let db;
let apiDefinitions = [];
const registeredRoutes = new Set();

// ✅ Init DB
async function initDB() {
    db = await open({ filename: "./data.db", driver: sqlite3.Database });

await db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
  );
`);

await db.exec(`
  CREATE TABLE IF NOT EXISTS wallets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);


}

// ✅ Load API definitions
function loadAPIs() {
    if (!fs.existsSync("./db.json")) fs.writeFileSync("./db.json", "[]");
    const data = fs.readFileSync("./db.json", "utf-8");
    apiDefinitions = JSON.parse(data);
}

// ✅ Register dynamic routes
function registerRoutes() {
    apiDefinitions.forEach(api => {
        const { method, path, type, query, response } = api;
        const httpMethod = method.toLowerCase();
        if (!path) return;
        const key = httpMethod + path;
        if (registeredRoutes.has(key)) return;

        const handler = async (req, res) => {
            try {
               if (type === "database") {
  if (!query) return res.status(400).json({ error: "Missing query" });

  if (httpMethod === "post") {
    const tableMatch = query.match(/INTO (\w+)/i);
    const table = tableMatch ? tableMatch[1] : null;
    if (!table) return res.status(400).json({ error: "Cannot detect table" });
    const values = Object.values(req.body);
    await db.run(query, values);
    res.json({ status: "success" });
  } else if (httpMethod === "get") {
    // ถ้า query เป็น SELECT JOIN ใช้ query ตรง ๆ
    const result = await db.all(query);
    res.json(result);
  }
}
 else {
                    res.json(response);
                }
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        };

        app[httpMethod](path, handler);
        registeredRoutes.add(key);
        console.log(`✅ Registered: [${method}] ${path}`);
    });
}

// ✅ Create API dynamically
app.post("/_builder/create", (req, res) => {
    const { method, path, type, query, response } = req.body;
    const exists = apiDefinitions.find(api => api.method === method && api.path === path);
    if (exists) return res.status(400).json({ error: "API exists" });

    const newApi = { id: Date.now(), method, path, type, query, response };
    apiDefinitions.push(newApi);
    fs.writeFileSync("./db.json", JSON.stringify(apiDefinitions, null, 2));
    registerRoutes();
    res.json({ status: "created", api: newApi });
});

// ✅ List APIs
app.get("/_builder/list", (req, res) => {
    res.set("Cache-Control", "no-store");
    res.json(apiDefinitions);
});

// ✅ Start server
(async () => {
    await initDB();
    loadAPIs();
    registerRoutes();
    app.listen(4000, () => console.log("🚀 Server running on http://localhost:4000"));
})();
