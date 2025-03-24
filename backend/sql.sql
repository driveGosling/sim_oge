CREATE TABLE tests (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL
);

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    test_id INT REFERENCES tests(id) ON DELETE CASCADE
);

INSERT INTO tests (title) VALUES
('Вариант 1'),
('Вариант 2');

INSERT INTO questions (text, correct_answer, test_id) VALUES
('Вопрос 1 Теста 1', 'Ответ 1', 1),
('Вопрос 2 Теста 1', 'Ответ 2', 1);

INSERT INTO questions (text, correct_answer, test_id) VALUES
('Вопрос 1 Теста 2', 'Ответ 1', 2),
('Вопрос 2 Теста 2', 'Ответ 2', 2);
