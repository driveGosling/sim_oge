const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const apiRouter = require("./routes");
const { Pool }  = require("pg");

const app = express();
const port = process.env.PORT || 5000;
const pool = new Pool({
  host:     process.env.DATABASE_HOST,
  port:     process.env.DATABASE_PORT,
  user:     process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

app.use(cors());
app.use(express.json());
console.log(">> Using DATABASE_URL:", process.env.DATABASE_URL);

app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.use("/images", express.static(path.join(__dirname, "../public/uploads")));

app.get("/api/health", async (_, res) => {
  try {
    const { rows } = await pool.query("SELECT NOW()");
    res.json({ dbTime: rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB connection failed" });
  }
});


app.use("/api", apiRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on http:${port}`);
});
