import "./Question.css";

const Question = ({ question, isSubmitted, userAnswer, onAnswerChange }) => {

  return (
    <div className="question-card">
      <h3>{question.text}</h3>

      <label>
        {question.answerType === "short" ? (
          question.answerOptions.map(({ id, optionText }) => (
            <div
              key={id}
              className={
                isSubmitted                                      // Время кончилось
                  ? optionText === question.correctAnswer        // Опция является правильным ответом и подсвечивается зеленым
                    ? "correct"
                    : userAnswer === optionText                  // Пользователь отвечает неправильно, его ответ подсвечивается красным
                    ? "wrong"
                    : ""
                  : ""
              }
            >
              <input
                type="radio"
                name={question.id}
                value={optionText}
                checked={userAnswer === optionText}
                disabled={isSubmitted}
                onChange={(e) => onAnswerChange(question.id, e.target.value)}
              />
              {optionText}
            </div>
          ))
        ) : (
          <>
            <p>
              Решения заданий с развернутым ответом не проверяются
              автоматически.
            </p>
            <textarea
              name={question.id}
              disabled={isSubmitted}
              value={userAnswer}
              onChange={(e) => onAnswerChange(question.id, e.target.value)}
              rows={15}
              cols={100}
            ></textarea>
          </>
        )}
      </label>
    </div>
  );
};

export default Question;
