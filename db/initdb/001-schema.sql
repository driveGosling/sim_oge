-- 001-schema.sql
CREATE TABLE
  topics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    questions_type VARCHAR(20) CHECK (questions_type IN ('short', 'long'))
  );

CREATE TABLE
  variants (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL);

CREATE TABLE
  questions (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    body TEXT,
    image VARCHAR(255),
    correct_answer VARCHAR(255), -- Nullable for long answer questions
    answer_type VARCHAR(20) CHECK (answer_type IN ('short', 'long')),
    topic_id INT,
    FOREIGN KEY (topic_id) REFERENCES topics (id)
  );

CREATE TABLE
  questions_variants (
    id SERIAL PRIMARY KEY,
    question_id INT,
    variant_id INT,
    FOREIGN KEY (question_id) REFERENCES questions (id),
    FOREIGN KEY (variant_id) REFERENCES variants (id),
    UNIQUE (question_id, variant_id)
  );

CREATE TABLE
  IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP
    WITH
      TIME ZONE DEFAULT now ()
  );

CREATE TABLE
  IF NOT EXISTS attempts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    variant_id INTEGER REFERENCES variants (id) ON DELETE SET NULL,
    total_questions INTEGER NOT NULL,
    correct_questions INTEGER NOT NULL,
    successful BOOLEAN NOT NULL,
    created_at TIMESTAMP
    WITH
      TIME ZONE DEFAULT now ()
  );