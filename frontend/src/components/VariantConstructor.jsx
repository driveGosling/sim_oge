import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVariant } from "./../contexts/VariantContext";
import "./VariantConstructor.css";
import fakeData from "./../data/data.js";

const VariantConstructor = () => {
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [topicQuestionCount, setTopicQuestionCount] = useState({});
  const { handleCustomVariant } = useVariant();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/topics");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const topics = await response.json();
        const initialCounts = {};
        topics.forEach((topic) => {
          initialCounts[topic.id] = 0;
        });

        setTopics(topics);
        setTopicQuestionCount(initialCounts);
      } catch (e) {
        console.log("Error fetching topics:", e);
        const initialCounts = {};
        fakeData.topics.forEach((topic) => {
          initialCounts[topic.id] = 0;
        });

        setTopicQuestionCount(initialCounts);
        setTopics(fakeData.topics);
      }
    };

    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/questions");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const questions = await response.json();

        setQuestions(questions);
      } catch (e) {
        console.log("Error fetching topics:", e);
        setQuestions(fakeData.questions);
      }
    };

    fetchTopics();
    fetchQuestions();
  }, []);

  const handleChange = (topicId, e) => {
    const value = Math.max(0, Number(e.target.value));
    if (!isNaN(value)) {
      setTopicQuestionCount((prev) => ({
        ...prev,
        [topicId]: value,
      }));
    }
  };

  const handleIncrement = (topicId) => {
    setTopicQuestionCount((prev) => ({
      ...prev,
      [topicId]: (prev[topicId] || 0) + 1,
    }));
  };

  const handleDecrement = (topicId) => {
    setTopicQuestionCount((prev) => ({
      ...prev,
      [topicId]: Math.max(0, (prev[topicId] || 0) - 1),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedQuestions = [];

    for (const [topicId, count] of Object.entries(topicQuestionCount)) {
      // Ищем вопросы, соответствующие текущей теме
      const questionsForTopic = questions.filter(
        (q) => q.topic_id === Number(topicId)
      );

      // Перемешиваем вопросы случайным образом
      const shuffledQuestions = questionsForTopic.sort(
        () => Math.random() - 0.5
      );

      // Добавляем максимум count вопросов в массив selectedQuestions
      const numQuestionsToSelect = Math.min(count, shuffledQuestions.length);

      for (let i = 0; i < numQuestionsToSelect; i++) {
        selectedQuestions.push(shuffledQuestions[i]);
      }
    }

    if (selectedQuestions.length > 0) {
      const variant = {
        id: Date.now(),
        name: `Вариант ${new Date().toLocaleTimeString()}`,
        questions: selectedQuestions,
      };

      handleCustomVariant(variant);
      navigate("/test/custom");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="constructor">
        <div className="constructor-topicList">
          <div className="constructor-head">
            <h3>Количество</h3>
            <h3>Тема</h3>
          </div>
          <div className="constructor-body">
            <ul>
              {topics.map(({ id, name }) => (
                <li key={id}>
                  <div className="counter">
                    <button
                      onClick={() => handleDecrement(id)}
                      className="counter-decrease"
                      type="button"
                    >
                      -
                    </button>
                    <input
                      className="counter-input"
                      type="tel"
                      value={topicQuestionCount[id] || 0}
                      onChange={(e) => handleChange(id, e)}
                    />
                    <button
                      onClick={() => handleIncrement(id)}
                      className="counter-increase"
                      type="button"
                    >
                      +
                    </button>
                  </div>
                  <div className="constructor-topicDescr">{name}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="constructor-buttons">
          <button className="submit" type="submit">
            Составить вариант
          </button>
        </div>
      </div>
    </form>
  );
};

export default VariantConstructor;
