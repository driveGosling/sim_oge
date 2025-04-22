CREATE TABLE Topics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    questions_type VARCHAR(20) CHECK (questions_type IN ('short', 'long'))
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

CREATE OR REPLACE FUNCTION validate_question_type()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM Topics 
        WHERE id = NEW.topic_id 
        AND questions_type != NEW.answer_type
    ) THEN
        RAISE EXCEPTION 'The questions_type of the topic does not match the answer_type of the question.';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_question_type
BEFORE INSERT OR UPDATE ON Questions
FOR EACH ROW EXECUTE FUNCTION validate_question_type();


CREATE OR REPLACE FUNCTION validate_answer_options()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM Questions 
        WHERE id = NEW.question_id 
        AND answer_type = 'long'
    ) THEN
        RAISE EXCEPTION 'Cannot insert answer options for questions with answer_type "long".';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_answer_options
BEFORE INSERT ON Answer_Options
FOR EACH ROW EXECUTE FUNCTION validate_answer_options();

INSERT INTO Topics (name, questions_type) VALUES
('Тема с краткими вопросами', 'short'),
('Тема с развернутыми вопросами', 'long');

INSERT INTO Variants (name) VALUES
('Вариант 1'),
('Вариант 2');

INSERT INTO Questions (text, correct_answer, topic_id, answer_type) VALUES
('Вопрос 1 Темы 1', 'Правильный ответ на Вопрос 1 Темы 1', 1, 'short'),
('Вопрос 2 Темы 1', 'Правильный ответ на Вопрос 2 Темы 1', 1, 'short'),
('Вопрос 1 Темы 2', null, 2, 'long'),
('Вопрос 2 Темы 2', null, 2, 'long');

INSERT INTO Questions_Variants (variant_id, question_id) VALUES 
(1, 1),
(1, 2),
(2, 3),
(2, 4);

INSERT INTO Answer_Options (question_id, option_text) VALUES 
(1, 'Правильный ответ на Вопрос 1 Темы 1'),
(1, 'Неправильный ответ 1 на Вопрос 1 Темы 1'),
(1, 'Неправильный ответ 2 на Вопрос 1 Темы 1'),
(1, 'Неправильный ответ 3 на Вопрос 1 Темы 1'),
(2, 'Правильный ответ на Вопрос 2 Темы 1'),
(2, 'Неправильный ответ 1 на Вопрос 2 Темы 1'),
(2, 'Неправильный ответ 2 на Вопрос 2 Темы 1'),
(2, 'Неправильный ответ 3 на Вопрос 2 Темы 1');
