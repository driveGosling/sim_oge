import "./Question.css";

const Question = ({ question, isSubmitted, userAnswer, onAnswerChange }) => {
  const renderInputType = () => {
    switch (question.inputType) {
      case "text":
        return (
          <input
            type="text"
            name={question.id}
            value={userAnswer}
            disabled={isSubmitted}
            onChange={(e) => onAnswerChange(question.id, e.target.value)}
          />
        );
      case "radio":
        return question.answerOptions.map(({ id, optionText }) => (
          <div
            key={id}
            // className={
            //   isSubmitted // Время кончилось
            //     ? optionText === question.correctAnswer // Опция является правильным ответом и подсвечивается зеленым
            //       ? "correct"
            //       : userAnswer === optionText // Пользователь отвечает неправильно, его ответ подсвечивается красным
            //       ? "wrong"
            //       : ""
            //     : ""
            // }
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
        ));
      default:
        return null;
    }
  };

  return (
    <div className="question-card">
      <h3 className="question-title">Вопрос {question.id}</h3>
      <div className="question-text">{question.text}</div>

      {question.body && (
        <div className="question-body">{question.body}</div>
      )}

      {question.image && (
        <img
          src={`/images/${question.image}`}
          style={{ width: "300px", height: "auto" }}
        />
      )}

      <div className="question-input">
        Ответ: 
        {question.answerType === "short" ? (
          renderInputType()
        ) : (
          <div className="textarea-container">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Question;
