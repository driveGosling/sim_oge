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

const toCamelCase = (obj) => {
  const newObj = {};
  for (const key in obj) {
    const camelCaseKey = key.replace(/(_\w)/g, (m) => m[1].toUpperCase());
    newObj[camelCaseKey] = obj[key];
  }
  return newObj;
};

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
    const result = await pool.query(`SELECT id, name, questions_type AS "questionsType" FROM topics`);

    const topics = result.rows.map(topic => ({
      id: topic.id,
      name: topic.name,
      questionsType: topic.questionsType
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
        JSON_BUILD_OBJECT(
          'id', q.id,
          'topicId', q.topic_id,
          'answerType', q.answer_type,
          'correctAnswer', q.correct_answer,
          'text', q.text
        )
      FROM 
        Questions q
    `);

    const questions = result.rows.map(row => row.json_build_object);

    res.json(questions);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

app.get("/api/answerOptions", async (req, res) => {
  const questionIds = req.query.ids;
  if (!questionIds) {
    return res.status(400).send("No question IDs provided");
  }

  const ids = questionIds.split(",").map(id => parseInt(id, 10));

  try {
    const result = await pool.query(`
      SELECT 
        ao.id AS id,
        ao.option_text,
        ao.question_id
      FROM 
        Answer_Options ao
      WHERE 
        ao.question_id = ANY($1)
    `, [ids]);

    const answerOptions = result.rows.map(toCamelCase);
    
    console.log(answerOptions)

    res.json(answerOptions);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
