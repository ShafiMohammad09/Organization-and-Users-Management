import { createServer } from "./index";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = createServer();

// Serve static files from the built client
app.use(express.static(path.join(__dirname, "../spa")));

// Handle all other routes by serving the index.html
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../spa/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
