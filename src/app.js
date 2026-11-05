const express = require("express");
const redis = require("redis");

const app = express();

const PORT = process.env.PORT || 3000;

const REDIS_URL =
  process.env.REDIS_URL ||
  "redis://localhost:6379";

const client = redis.createClient({
  url: REDIS_URL,
});

client.on("error", (err) => {
  console.log("Redis error:", err.message);
});

client.connect().catch(console.error);

app.get("/", (req, res) => {
  res.send("Control de visitas");
});

app.get("/health", (req, res) => {
  res.json({
    status: "activo",
  });
});

app.get("/api/visitas", async (req, res) => {
  try {
    const visitas =
      await client.incr("contador_visitas");

    res.json({
      visitas,
    });
  } catch (error) {
    res.status(500).json({
      error: "Redis no disponible",
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor ejecutándose en ${PORT}`);
});