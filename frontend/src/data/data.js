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
          correctAnswer: "Ответ 1",
        },
        {
          id: 2,
          text: "Вопрос 2 Варианта 1",
          correctAnswer: "Ответ 2",
        },
      ],
    },
    {
      id: 2,
      name: "Вариант 2",
      questions: [
        {
          id: 1,
          text: "Вопрос 1 Варианта 2",
          correctAnswer: "Ответ 1",
        },
        {
          id: 2,
          text: "Вопрос 2 Варианта 2",
          correctAnswer: "Ответ 2",
        },
      ],
    },
  ],
  topics: [
    {
      id: 1,
      name: "Тема 1",
    },
    {
      id: 2,
      name: "Тема 2",
    },
  ],
  questions: [
    {
      id: 1,
      text: "Вопрос 1 Темы 1",
      correctAnswer: "Ответ 1",
      topic_id: 1
    },
    {
      id: 2,
      text: "Вопрос 2 Темы 1",
      correctAnswer: "Ответ 2",
      topic_id: 1
    },
    {
      id: 3,
      text: "Вопрос 1 Темы 2",
      correctAnswer: "Ответ 1",
      topic_id: 2
    },
    {
      id: 4,
      text: "Вопрос 2 Темы 2",
      correctAnswer: "Ответ 2",
      topic_id: 2
    }
  ]
};

export default data;

