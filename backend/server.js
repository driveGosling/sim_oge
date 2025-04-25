const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get("/api/variants", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        v.id AS id,
        v.name AS name,
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'id', q.id,
                'text', q.text,
                'correctAnswer', q.correct_answer,
                'answerType', q.answer_type,
                'answerOptions', (
                SELECT JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'id', ao.id,
                        'optionText', ao.option_text
                    )
                )
                FROM Answer_Options ao
                WHERE ao.question_id = q.id
            )
            )
        ) AS questions
    FROM 
        Variants v
    LEFT JOIN 
        Questions_Variants qv ON v.id = qv.variant_id
    LEFT JOIN 
        Questions q ON q.id = qv.question_id
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
    const result = await pool.query(`SELECT * FROM topics`);

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

app.get("/api/questions", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM questions`);

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
