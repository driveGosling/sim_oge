import "./Question.css";

const Question = ({ question, isSubmitted, userAnswer, onAnswerChange }) => {
  const isCorrect = isSubmitted && userAnswer === question.correctAnswer;

  return (
    <div className="question-card">
      <h3>{question.text}</h3>

      <label>
        {question.answerType === "short" ? (
          question.answerOptions.map((option) => (
            <div key={option.id}>
              <input
                type="radio"
                name={question.id}
                value={option.optionText}
                checked={userAnswer === option.optionText}
                disabled={isSubmitted}
                onChange={(e) => onAnswerChange(question.id, e.target.value)}
              />
              {option.optionText}
            </div>
          ))
        ) : (
          <>
            <p>
              Решения заданий с развернутым ответом не проверяются
              автоматически.
            </p>
            <input
              type="text"
              name={question.id}
              disabled={isSubmitted}
              value={userAnswer}
              onChange={(e) => onAnswerChange(question.id, e.target.value)}
              className={isSubmitted ? (isCorrect ? "correct" : "wrong") : ""}
            />
          </>
        )}
      </label>

      {isSubmitted ? !isCorrect ? <div>{question.correctAnswer}</div> : "" : ""}
    </div>
  );
};

export default Question;
