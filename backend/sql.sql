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
	correct_answer VARCHAR(255), -- Nullable for long answer questions
    answer_type VARCHAR(20) CHECK (answer_type IN ('short', 'long')),
    topic_id INT,
    FOREIGN KEY (topic_id) REFERENCES Topics(id)
);

CREATE TABLE Answer_Options (
    id SERIAL PRIMARY KEY,
    question_id INT REFERENCES Questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL
);

CREATE TABLE Questions_Variants (
    id SERIAL PRIMARY KEY,
    question_id INT,
    variant_id INT,
    FOREIGN KEY (question_id) REFERENCES Questions(id),
    FOREIGN KEY (variant_id) REFERENCES Variants(id),
    UNIQUE (question_id, variant_id)
);

INSERT INTO Topics (name) VALUES
('Тема 1'),
('Тема 2');

INSERT INTO Variants (name) VALUES
('Вариант 1'),
('Вариант 2');

INSERT INTO Questions (text, correct_answer, topic_id, answer_type) VALUES
('Вопрос 1 Темы 1', 'Ответ 1', 1, 'short'),
('Вопрос 2 Темы 1', 'Ответ 2', 1, 'long'),
('Вопрос 1 Темы 2', 'Ответ 1', 2, 'short'),
('Вопрос 2 Темы 2', 'Ответ 2', 2, 'long');

INSERT INTO Questions_Variants (variant_id, question_id) VALUES 
(1, 1),
(1, 2),
(2, 3),
(2, 4);

INSERT INTO Answer_Options (question_id, option_text) VALUES 
(1, 'Answer Option 1 for Question 1'),
(1, 'Answer Option 2 for Question 1'),
(3, 'Answer Option 1 for Question 3'),
(3, 'Answer Option 2 for Question 3');
