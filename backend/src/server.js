const express = require("express");
const cors    = require("cors");
require("dotenv").config();
const apiRouter = require("./routes");
const pool = require("./config/db.js");

const app  = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", async (_, res) => {
  try {
    const { rows } = await pool.query("SELECT NOW()");
    res.json({ dbTime: rows[0].now });
  } catch (err) {
    console.error("DB health error:", err);
    res.status(500).json({ error: "Database unavailable" });
  }
});

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
