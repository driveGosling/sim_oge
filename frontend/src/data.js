// data.js

const tests = [
  {
    id: 1,
    title: 'The American Revolution',
    questions: [
      {
        id: 1,
        question: 'What year did the American Revolution begin?',
        options: ['1775', '1781', '1765', '1790'],
        correctAnswer: '1775',
      },
      {
        id: 2,
        question: 'Who wrote the Declaration of Independence?',
        options: [
          'George Washington',
          'Thomas Jefferson',
          'Benjamin Franklin',
          'John Adams',
        ],
        correctAnswer: 'Thomas Jefferson',
      },
    ],
  },
  {
    id: 2,
    title: 'World War II',
    questions: [
      {
        id: 1,
        question: 'Which event triggered World War II?',
        options: [
          'The invasion of Poland',
          'Attack on Pearl Harbor',
          'D-Day',
          'The signing of the Treaty of Versailles',
        ],
        correctAnswer: 'The invasion of Poland',
      },
      {
        id: 2,
        question: 'What year did World War II end?',
        options: ['1944', '1945', '1946', '1947'],
        correctAnswer: '1945',
      },
    ],
  },
];

export default tests;
