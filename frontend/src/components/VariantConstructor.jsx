import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVariant } from "../contexts/VariantContext";
import "./VariantConstructor.css";
import fakeData from "../data/data.js";

const VariantConstructor = () => {
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [topicQuestionCount, setTopicQuestionCount] = useState({}); // Хранит информацию о количестве вопросов из выбранных тем в виде { id_темы: число_вопросов }
  const [briefAnswer, setBriefAnswer] = useState(false);
  const [detailedAnswer, setDetailedAnswer] = useState(false);
  const { handleCustomVariant } = useVariant();
  const navigate = useNavigate();

  const shortQTopics = topics.filter(
    (topic) => topic.questionsType === "short"
  );
  const longQTopics = topics.filter((topic) => topic.questionsType === "long");

  useEffect(() => {
    const dedupe = (arr) => {
      const map = new Map(arr.map((t) => [t.name, t]));
      return Array.from(map.values());
    };
    const extraTopics = Array.from({ length: 15 }, (_, idx) => ({
      id: `extra-${idx + 1}`,
      name: `Дополнительная тема ${idx + 1}`,
    }));

    const fetchTopics = async () => {
      try {
        const resp = await fetch("http://localhost:5000/api/topics");
        if (!resp.ok) throw new Error();
        const apiTopics = await resp.json();
        const all = dedupe([...apiTopics, ...extraTopics]);
        setTopics(all);
        setTopicQuestionCount(Object.fromEntries(all.map((t) => [t.id, 0])));
      } catch {
        const base = fakeData.topics;
        const all = dedupe([...base, ...extraTopics]);
        setTopics(all);
        setTopicQuestionCount(Object.fromEntries(all.map((t) => [t.id, 0])));
      }
    };

    const fetchQuestions = async () => {
      try {
        const resp = await fetch("http://localhost:5000/api/questions");
        if (!resp.ok) throw new Error();
        setQuestions(await resp.json());
      } catch {
        setQuestions(fakeData.questions);
      }
    };

    fetchTopics();
    fetchQuestions();
  }, []);

  const handleChange = (id, e) => {
    const questionCount = Math.max(0, Number(e.target.value));
    if (!isNaN(questionCount))
      setTopicQuestionCount((prev) => ({ ...prev, [id]: questionCount }));
  };

  const handleInc = (id) =>
    setTopicQuestionCount((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

  const handleDec = (id) =>
    setTopicQuestionCount((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1),
    }));

  // Функция из преисподней, не пытайтесь пока разобраться, я её упрощу
  // Вкратнце: это все нужно чтобы сформировать список вопросов для варианта
  // Поскольку вопросы выбирались на основе темы и типа, а не конкретного id вопроса,
  // вопросы с нужной темой и типом извлекаются из общего списка похожих вопросов случайным образом
  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedQuestions = [];
    const selectedQuestionIds = [];

    Object.entries(topicQuestionCount).forEach(([selectedTopicId, count]) => {
      const filteredQuestions = questions.filter(
        (question) => question.topicId === Number(selectedTopicId)
      );

      const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
      const questionsToSelect = shuffled.slice(
        0,
        Math.min(count, shuffled.length)
      );
      selectedQuestions.push(...questionsToSelect);
      selectedQuestionIds.push(...questionsToSelect.map(question => question.id));
    });

    let questionsWithAnswerOptions = [];

    if (selectedQuestions.length) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/answerOptions?ids=${selectedQuestionIds.join(
            ","
          )}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch answer options");
        }
        const answerOptions = await response.json();

        const answerOptionsMap = answerOptions.reduce((acc, option) => {
          if (!acc[option.questionId]) {
            acc[option.questionId] = [];
          }
          acc[option.questionId].push(option);
          return acc;
        }, {});

        questionsWithAnswerOptions = selectedQuestions.map((question) => ({
          ...question,
          answerOptions: answerOptionsMap[question.id] || [],
        }));
      } catch (error) {
        questionsWithAnswerOptions = selectedQuestions.map((question) => {
          const fakeQuestion = fakeData.questions.find(
            (q) => q.id === question.id
          );

          return {
            ...fakeQuestion,
            answerOptions: fakeQuestion?.answerOptions || [],
          };
        });
      }
      await handleCustomVariant({
        id: Date.now(),
        name: `Вариант ${new Date().toLocaleTimeString()}`,
        questions: questionsWithAnswerOptions,
      });
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

          <div className="brief-label">Краткий ответ</div>
          <div className="constructor-body">
            <ul>
              {shortQTopics.map(({ id, name }) => (
                <li className="li-constructor" key={id}>
                  <div className="counter">
                    <button type="button" onClick={() => handleDec(id)}>
                      −
                    </button>
                    <input
                      className="counter-input"
                      type="tel"
                      value={topicQuestionCount[id] || 0}
                      onChange={(e) => handleChange(id, e)}
                    />
                    <button type="button" onClick={() => handleInc(id)}>
                      ＋
                    </button>
                  </div>
                  <div className="constructor-topicDescr">{name}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="li-divider">Развернутый ответ</div>
          <div className="constructor-body">
            <ul>
              {longQTopics.map(({ id, name }) => (
                <li className="li-constructor" key={id}>
                  <div className="counter">
                    <button type="button" onClick={() => handleDec(id)}>
                      −
                    </button>
                    <input
                      className="counter-input"
                      type="tel"
                      value={topicQuestionCount[id] || 0}
                      onChange={(e) => handleChange(id, e)}
                    />
                    <button type="button" onClick={() => handleInc(id)}>
                      ＋
                    </button>
                  </div>
                  <div className="constructor-topicDescr">{name}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="constructor-buttons">
          <div className="button-frame">
            <button className="submit" type="submit">
              Составить вариант
            </button>
            <div className="answer-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={briefAnswer}
                  onChange={() => setBriefAnswer(!briefAnswer)}
                />
                Краткий ответ
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={detailedAnswer}
                  onChange={() => setDetailedAnswer(!detailedAnswer)}
                />
                Развернутый ответ
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default VariantConstructor;
