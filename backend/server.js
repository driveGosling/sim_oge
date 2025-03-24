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

app.get("/api/data", async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT 
            t.id AS test_id, 
            t.title, 
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id', q.id,
                    'text', q.text,
                    'correctAnswer', q.correct_answer
                )
            ) AS questions
        FROM 
            tests t
        LEFT JOIN 
            questions q ON t.id = q.test_id
        GROUP BY 
            t.id, t.title
        ORDER BY 
            t.id;
        `);

    const tests = result.rows.map((row) => ({
      id: row.test_id,
      title: row.title,
      questions: row.questions || [],
    }));

    res.json(tests);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
