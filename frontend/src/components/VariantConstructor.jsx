import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVariant } from "../contexts/VariantContext";
import "./VariantConstructor.css";
import fakeData from "../data/data.js";

const VariantConstructor = () => {
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [topicQuestionCount, setTopicQuestionCount] = useState({});
  const [briefAnswer, setBriefAnswer] = useState(false);
  const [detailedAnswer, setDetailedAnswer] = useState(false);
  const { handleCustomVariant } = useVariant();
  const navigate = useNavigate();

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
        setTopicQuestionCount(Object.fromEntries(all.map(t => [t.id, 0])));
      } catch {
        const base = fakeData.topics;
        const all = dedupe([...base, ...extraTopics]);
        setTopics(all);
        setTopicQuestionCount(Object.fromEntries(all.map(t => [t.id, 0])));
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
    const v = Math.max(0, Number(e.target.value));
    if (!isNaN(v)) setTopicQuestionCount(p => ({ ...p, [id]: v }));
  };
  const handleInc = id => setTopicQuestionCount(p => ({ ...p, [id]: (p[id]||0) + 1 }));
  const handleDec = id => setTopicQuestionCount(p => ({ ...p, [id]: Math.max(0,(p[id]||0)-1) }));

  const handleSubmit = e => {
    e.preventDefault();
    const sel = [];
    Object.entries(topicQuestionCount).forEach(([tid, cnt]) => {
      const qs = questions.filter(q => q.topic_id === Number(tid));
      const sh = [...qs].sort(() => Math.random()-0.5);
      sel.push(...sh.slice(0, Math.min(cnt, sh.length)));
    });
    if (sel.length) {
      handleCustomVariant({
        id: Date.now(),
        name: `Вариант ${new Date().toLocaleTimeString()}`,
        questions: sel
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
              {topics.map(({ id, name }) => (
                <li className="li-constructor" key={id}>
                  <div className="counter">
                    <button type="button" onClick={() => handleDec(id)}>−</button>
                    <input
                      className="counter-input"
                      type="tel"
                      value={topicQuestionCount[id]||0}
                      onChange={e => handleChange(id, e)}
                    />
                    <button type="button" onClick={() => handleInc(id)}>＋</button>
                  </div>
                  <div className="constructor-topicDescr">{name}</div>
                </li>
              ))}
              <div className="li-divider">Развернутый ответ</div>
            </ul>
          </div>
        </div>

        <div className="constructor-buttons">
          <div className="button-frame">
            <button className="submit" type="submit">Составить вариант</button>
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
            <span className="corner-bl" />
            <span className="corner-br" />
          </div>
        </div>
      </div>
    </form>
  );
};

export default VariantConstructor;
