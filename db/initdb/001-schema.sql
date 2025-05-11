-- 001-schema.sql

CREATE TABLE IF NOT EXISTS Topics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    questions_type VARCHAR(20)
      CHECK (questions_type IN ('short', 'long'))
);

CREATE TABLE IF NOT EXISTS Variants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Questions (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    body TEXT,
    image VARCHAR(255),
    correct_answer VARCHAR(255),  -- Nullable для long-ответов
    answer_type VARCHAR(20)
      CHECK (answer_type IN ('short', 'long')),
    topic_id INT
      REFERENCES Topics(id)
);

CREATE TABLE IF NOT EXISTS Questions_Variants (
    id SERIAL PRIMARY KEY,
    question_id INT
      REFERENCES Questions(id),
    variant_id INT
      REFERENCES Variants(id),
    UNIQUE (question_id, variant_id)
);

-- здесь можно раскомментировать и подключить триггер на проверку соответствия
-- CREATE OR REPLACE FUNCTION validate_question_type()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     IF EXISTS (
--         SELECT 1 FROM Topics
--         WHERE id = NEW.topic_id
--           AND questions_type != NEW.answer_type
--     ) THEN
--         RAISE EXCEPTION
--           'The questions_type of the topic does not match the answer_type of the question.';
--     END IF;
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
--
-- CREATE TRIGGER check_question_type
--   BEFORE INSERT OR UPDATE ON Questions
--   FOR EACH ROW EXECUTE FUNCTION validate_question_type();

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email    VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS Attempts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL
      REFERENCES users(id),
    variant_id BIGINT NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_questions INTEGER NOT NULL,
    successful BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
