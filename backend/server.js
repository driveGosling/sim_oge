require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

app.use(cors());
app.use(express.json());
console.log(">> Using DATABASE_URL:", process.env.DATABASE_URL);

app.post("/api/auth/register", async (req, res) => {
  console.log(">> POST /api/auth/register, body:", req.body);
  const { username, email, password } = req.body;
  try {
    const exists = await pool.query(
      "SELECT id FROM users WHERE email=$1 OR username=$2",
      [email, username]
    );
    console.log(">> exists.rows.length =", exists.rows.length);

    if (exists.rows.length) {
      console.log(">> Registration failed: email/username taken");
      return res.status(400).json({ message: "Email или имя занято" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3) RETURNING id, username, email`,
      [username, email, password_hash]
    );
    console.log(">> New user inserted:", result.rows[0]);
    const token = jwt.sign({ userId: result.rows[0].id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ user: result.rows[0], token });
  } catch (err) {
    console.error(">> Registration error on server:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Логин
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (!result.rows.length) {
      return res.status(400).json({ message: "Неверный email или пароль" });
    }
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(400).json({ message: "Неверный email или пароль" });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      user: { id: user.id, username: user.username, email: user.email },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Токен не предоставлен" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ message: "Неверный токен" });
  }
}

app.get("/api/profile", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, created_at FROM users WHERE id = $1",
      [req.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.get("/api/variants", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        v.id AS id,
        v.name AS name,
        CASE 
          WHEN COUNT(q.id) = 0 THEN NULL
          ELSE JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', q.id,
              'text', q.text,
              'body', q.body,
              'image', q.image,
              'correctAnswer', q.correct_answer,
              'answerType', q.answer_type,
              'topic', json_build_object(
                'id', t.id,
                'name', t.name
              )
            )
          )
        END AS questions
      FROM Variants v
      LEFT JOIN Questions_Variants qv ON v.id = qv.variant_id
      LEFT JOIN Questions q ON q.id = qv.question_id
      LEFT JOIN Topics t ON q.topic_id = t.id
      GROUP BY v.id, v.name
      ORDER BY v.id;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get("/api/topics", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, questions_type AS "questionsType" FROM topics`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get("/api/questions", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', q.id,
              'text', q.text,
              'body', q.body,
              'image', q.image,
              'correctAnswer', q.correct_answer,
              'answerType', q.answer_type,
              'topic', json_build_object(
                'id', t.id,
                'name', t.name
              )
            )
          ) FILTER (WHERE q.id IS NOT NULL),
          '[]'
        ) AS questions
      FROM Questions q
      LEFT JOIN Topics t ON q.topic_id = t.id
    `);
    res.json(result.rows[0].questions);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.post("/api/questions", async (req, res) => {
  const { text, correct_answer, answer_type, topic_id } = req.body;
  console.log("Новый вопрос:", text, correct_answer, answer_type, topic_id);
  res.status(201).json({ message: "Вопрос получен" });
});

app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.use("/images", express.static(path.join(__dirname, "public/images")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
