const QuestionCard = ({ questionData }) => {
  const {question, options} = questionData;

  return (
    <div className="question-card">
      <h3>{question}</h3>
      <ul>
        {options.map((option, index) => (
          <li key={index}>{option}</li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionCard;
