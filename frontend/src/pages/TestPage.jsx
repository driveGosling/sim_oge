import { useState, useEffect } from "react";
import Question from "../components/Question";
import { Link } from "react-router-dom";

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
  const { name, questions } = variant;

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(10); // 10800
  const timeLeft = secondsToHMS(secondsLeft);

  const handleAnswerChange = (id, value) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [id]: value }));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setIsSubmitted(true);
  };

  useEffect(() => {
    if (secondsLeft <= 0) {
      setIsSubmitted(true);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>{name}</h2>
        {!isSubmitted ? <p>Осталось: {timeLeft}</p> : ""}
        {questions.map((question) => (
          <Question
            key={question.id}
            question={question}
            isSubmitted={isSubmitted}
            userAnswer={answers[question.id] || ""}
            onAnswerChange={handleAnswerChange}
          />
        ))}

        <button type="submit" disabled={isSubmitted}>
          Завершить тест
        </button>
      </form>
      <Link to="/">Вернуться на главную</Link>
    </>
  );
};

export default Test;
