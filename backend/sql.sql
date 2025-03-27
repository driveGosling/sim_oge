-- CREATE TABLE topics (
--     id SERIAL PRIMARY KEY,
--     name TEXT NOT NULL
-- );

-- CREATE TABLE variants (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(255) NOT NULL
-- );

-- CREATE TABLE questions (
--     id SERIAL PRIMARY KEY,
--     text TEXT NOT NULL,
--     correct_answer VARCHAR(255) NOT NULL,
--     topic_id INT REFERENCES topics(id) ON DELETE CASCADE
-- );

-- INSERT INTO topics (name) VALUES
-- ('Тема 1'),
-- ('Тема 2');

-- INSERT INTO questions (text, correct_answer, topic_id) VALUES
-- ('Вопрос 1 Темы 1', 'Ответ 1', 1),
-- ('Вопрос 2 Темы 1', 'Ответ 2', 1);

-- INSERT INTO questions (text, correct_answer, topic_id) VALUES
-- ('Вопрос 1 Темы 2', 'Ответ 1', 2),
-- ('Вопрос 2 Темы 2', 'Ответ 2', 2);





CREATE TABLE Topics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE Variants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE Questions (
    id SERIAL PRIMARY KEY,
	text TEXT NOT NULL,
	correct_answer VARCHAR(255) NOT NULL,
    topic_id INT,
    FOREIGN KEY (topic_id) REFERENCES Topics(id)
);

CREATE TABLE Questions_Variants (
    id SERIAL PRIMARY KEY,
    question_id INT,
    variant_id INT,
    FOREIGN KEY (question_id) REFERENCES Questions(id),
    FOREIGN KEY (variant_id) REFERENCES Variants(id),
    UNIQUE (question_id, variant_id)  -- предотвращаем дублирование
);

INSERT INTO Topics (name) VALUES
('Тема 1'),
('Тема 2');

INSERT INTO Variants (name) VALUES
('Вариант 1'),
('Вариант 2');

INSERT INTO Questions (text, correct_answer, topic_id) VALUES
('Вопрос 1 Темы 1', 'Ответ 1', 1),
('Вопрос 2 Темы 1', 'Ответ 2', 1);

INSERT INTO Questions (text, correct_answer, topic_id) VALUES
('Вопрос 1 Темы 2', 'Ответ 1', 2),
('Вопрос 2 Темы 2', 'Ответ 2', 2);

INSERT INTO Questions_Variants (variant_id, question_id) VALUES 
(1, 1),
(1, 2),
(2, 3),
(2, 4);
