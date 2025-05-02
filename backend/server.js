const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const multer = require("multer");
require("dotenv").config();

const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.use("/images", express.static(path.join(__dirname, "public/uploads")));

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

app.post("/api/questions", upload.single("image"), async (req, res) => {
  const { text, correct_answer, answer_type, topic_id, body } = req.body;

  const imageFile = req.file;

  const imagePath = imageFile ? imageFile.filename : null;

  console.log(imagePath);

  try {
    const result = await pool.query(
      `INSERT INTO Questions (text, correct_answer, answer_type, topic_id, body, image)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [text, correct_answer, answer_type, topic_id, body, imagePath]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create question" });
  }
});

app.post("/api/variants", async (req, res) => {
  const { name, questionIds } = req.body;

  if (!name || !questionIds || !Array.isArray(questionIds)) {
    return res.status(400).json({ error: "Invalid data" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      "INSERT INTO Variants (name) VALUES ($1) RETURNING *",
      [name]
    );
    const newVariant = result.rows[0];

    const insertPromises = questionIds.map((questionId) =>
      client.query(
        "INSERT INTO Questions_Variants (question_id, variant_id) VALUES ($1, $2)",
        [questionId, newVariant.id]
      )
    );

    await Promise.all(insertPromises);
    await client.query("COMMIT");

    res.json({ message: "Variant created successfully", variant: newVariant });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Failed to create variant" });
  } finally {
    client.release();
  }
});

// END API routes

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
