const express = require("express");
const mongoose = require("mongoose");
const redis = require("redis");
const { Client: PGClient } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

//
// ─── MONGODB SETUP ─────────────────────────────────────────────
//

const MONGO_CONFIG = {
  user: "root",
  password: "password",
  host: "mongo",
  port: "27017",
};

const MONGO_URI = `mongodb://${MONGO_CONFIG.user}:${MONGO_CONFIG.password}@${MONGO_CONFIG.host}:${MONGO_CONFIG.port}`;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

//
// ─── POSTGRESQL SETUP ──────────────────────────────────────────
//

const pgClient = new PGClient({
  connectionString: "postgresql://postgres:postgres@postgres:5432",
});

pgClient
  .connect()
  .then(() => console.log("✅ PostgreSQL connected"))
  .catch((err) => console.error("❌ PostgreSQL connection error:", err));

//
// ─── REDIS SETUP ───────────────────────────────────────────────
//

const REDIS_CONFIG = {
  host: "redis",
  port: "6379",
};

const redisClient = redis.createClient({
  url: `redis://${REDIS_CONFIG.host}:${REDIS_CONFIG.port}`,
});

redisClient.on("error", (err) => console.error("❌ Redis error:", err));
redisClient.on("connect", () => console.log("✅ Redis connected"));
redisClient.connect();

//
// ─── ROUTES ────────────────────────────────────────────────────
//

app.get("/", async (req, res) => {
  await redisClient.set("test", "WELCOME TO NODEJS");
  res.send("Hello, World!!");
});

app.get("/data", async (req, res) => {
  const data = await redisClient.get("test");
  res.send(data || "No data found");
});

//
// ─── SERVER ────────────────────────────────────────────────────
//

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
