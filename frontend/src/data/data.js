// data.js

const data = {
  variants: [
    {
      id: 1,
      name: "Вариант 1",
      questions: [
        {
          id: 1,
          text: "Вопрос 1 Варианта 1",
          correctAnswer: "гав",
          answerType: "short",
          answerOptions: [
            { id: 1, optionText: "мяу" },
            { id: 2, optionText: "гав" },
          ],
        },
        {
          id: 2,
          text: "Вопрос 2 Варианта 1",
          correctAnswer: null,
          answerType: "long",
        },
      ],
    },
    {
      id: 2,
      name: "Вариант 2",
      questions: [
        {
          id: 1,
          text: "Вопрос",
          correctAnswer: null,
          answerType: "long",
        },
      ],
    },
  ],
  topics: [
    {
      id: 1,
      name: "Тема с короткими вопросами",
      questionsType: "short",
    },
    {
      id: 2,
      name: "Тема с развернутыми вопросами",
      questionsType: "long",
    },
  ],
  questions: [
    {
      id: 1,
      text: "Какой-то вопрос относящийся к теме с id 1",
      correctAnswer: "ДА",
      answerType: "short",
      topicId: 1,
    },
    {
      id: 2,
      text: "Еще какой-то вопрос относящийся к теме с id 1",
      correctAnswer: "ну да",
      answerType: "short",
      topicId: 1,
    },
    {
      id: 3,
      text: "Вопрос 1 Темы 2",
      correctAnswer: null,
      answerType: "long",
      topicId: 2,
    },
    {
      id: 4,
      text: "Вопрос 2 Темы 2",
      correctAnswer: null,
      answerType: "long",
      topicId: 2,
    },
  ],
  answerOptions: [
    { id: 1, optionText: "ДА", questionId: 1 },
    { id: 2, optionText: "НЕТ", questionId: 1 },

    { id: 3, optionText: "Получается так", questionId: 2 },
    { id: 4, optionText: "ну да", questionId: 2 },
  ],
};

export default data;
