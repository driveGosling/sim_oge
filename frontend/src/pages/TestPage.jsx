import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Question from "../components/Question";
import "./TestPage.css";

const secondsToHMS = (sec) => {
  const dateObj = new Date(sec * 1000);
  const hours = dateObj.getUTCHours();
  const minutes = dateObj.getUTCMinutes();
  const seconds = dateObj.getSeconds();
  return (
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0")
  );
};

const Test = ({ variant }) => {
  const { id, questions } = variant;

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(10800);
  const timeLeft = secondsToHMS(secondsLeft);

  const handleAnswerChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  // const handleTableChange = (id, idx, value) => {
  //   setAnswers((prev) => {
  //     const arr = prev[id] || [];
  //     const newArr = [...arr];
  //     newArr[idx] = value;
  //     return { ...prev, [id]: newArr };
  //   });
  // };

  const handleSubmit = (e) => {
    e?.preventDefault();
    setIsSubmitted(true);
  };

  useEffect(() => {
    if (secondsLeft <= 0) {
      setIsSubmitted(true);
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <h2 className="name-variant">Вариант № {id}</h2>

        {!isSubmitted ? (
          <div>
            <p>Осталось: {timeLeft}</p>
            {questions.map((question) => (
              <Question
                key={question.id}
                question={question}
                isSubmitted={isSubmitted}
                userAnswer={answers[question.id] || ""}
                onAnswerChange={handleAnswerChange}
              />
            ))}
          </div>
        ) : (
          <div>
            <h3>Результаты теста</h3>
            <table>
              <thead>
                <tr>
                  <th>№</th>
                  <th>Тип</th>
                  <th>Ваш ответ</th>
                  <th>Правильный ответ</th>
                </tr>
              </thead>
              <tbody>
                {questions.map(({ id, answerType, correctAnswer }) => (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{answerType}</td>
                    <td
                      className={
                        answerType === "long"
                          ? ""
                          : (answers[id] === correctAnswer && "correct") ||
                            "wrong"
                      }
                    >
                      {answers[id]}
                    </td>
                    <td>{correctAnswer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* // if (idx === 0){" "}
          //   return (
          //     <div key={question.id} className="question-card">
          //       <h3 className="question-header">{question.text}</h3>
          //       <div className="answer-row">
          //         <table className="answer-table">
          //           <thead>
          //             <tr>
          //               <th>А</th>
          //               <th>Б</th>
          //               <th>В</th>
          //             </tr>
          //           </thead>
          //           <tbody>
          //             <tr>
          //               {[0, 1, 2].map((i) => (
          //                 <td key={i}>
          //                   <input
          //                     type="text"
          //                     maxLength={1}
          //                     className="table-input"
          //                     disabled={isSubmitted}
          //                     value={answers[question.id]?.[i] || ""}
          //                     onChange={(e) => handleTableChange(question.id, i, e.target.value)}
          //                   />
          //                 </td>
          //               ))}
          //             </tr>
          //           </tbody>
          //         </table>
          //       </div>
          //     </div>
          //   );
          // }
          // return (
          //   <div key={question.id} className="question-card">
          //     <h3 className="question-header">{question.text}</h3>
          //     <div className="answer-row">
          //       <span className="answer-label">Ответ:</span>
          //       <input
          //         type="text"
          //         className="answer-input"
          //         value={answers[question.id] || ""}
          //         disabled={isSubmitted}
          //         onChange={(e) => handleAnswerChange(question.id, e.target.value)}
          //       />
          //     </div>
          //   </div>
          // ); */}

        <button type="submit" disabled={isSubmitted} className="submit-button">
          Завершить тест
        </button>
      </form>
      <button className="back-btn">
      <Link to="/">Вернуться на главную</Link>
      </button>
    </main>
  );
};

export default Test;
