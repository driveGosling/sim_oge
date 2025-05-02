const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.use("/images", express.static(path.join(__dirname, "public/images")));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// START API routes

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
      FROM 
        Variants v
      LEFT JOIN 
        Questions_Variants qv ON v.id = qv.variant_id
      LEFT JOIN 
        Questions q ON q.id = qv.question_id
      LEFT JOIN
        Topics t ON q.topic_id = t.id
      GROUP BY 
        v.id, v.name
      ORDER BY 
        v.id;
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

    const topics = result.rows.map((topic) => ({
      id: topic.id,
      name: topic.name,
      questionsType: topic.questionsType,
    }));

    res.json(topics);
  } catch (err) {
    console.log(err);
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
      FROM 
        Questions q
      LEFT JOIN 
        Topics t ON q.topic_id = t.id
    `);

    res.json(result.rows[0].questions);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

app.post("/api/questions", async (req, res) => {
  const { text, correct_answer, answer_type, topic_id } = req.body;

  console.log(text, correct_answer, answer_type, topic_id);
});

// END API routes

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
