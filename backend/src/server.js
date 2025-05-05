const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const apiRouter = require("./routes");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
console.log(">> Using DATABASE_URL:", process.env.DATABASE_URL);

app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.use("/images", express.static(path.join(__dirname, "../public/uploads")));

app.use("/api", apiRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
