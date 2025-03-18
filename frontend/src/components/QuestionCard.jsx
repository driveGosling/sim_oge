// const QuestionCard = ({
//   question,
//   options,
//   selectedAnswer,
//   onSelectAnswer,
//   onNextQuestion,
// }) => {
//   return (
//     <div className="question-card">
//       <h3>{question}</h3>
//       <div className="options">
//         {options.map((option, index) => (
//           <button
//             key={index}
//             onClick={() => onSelectAnswer(option)}
//             className={selectedAnswer === option ? 'selected' : ''}
//           >
//             {option}
//           </button>
//         ))}
//       </div>
//       <button onClick={onNextQuestion} disabled={!selectedAnswer}>
//         Далее
//       </button>
//     </div>
//   );
// };

// export default QuestionCard;
