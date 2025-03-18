// App.jsx

import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import tests from './data';
import QuestionCard from './QuestionCard';
import './App.css';

const App = () => {
  const [testList] = useState(tests);

  return (
    <Router>
      <div>
        <h1>History Tests</h1>
        <ul>
          {testList.map((test) => (
            <li key={test.id}>
              <Link to={`/test/${test.id}`}>{test.title}</Link>
            </li>
          ))}
        </ul>

        <Routes>
          <Route
            exact
            path="/"
            element={<h2>Select a test from the list above.</h2>}
          />

          {testList.map((test) => (
            <Route
              key={test.id}
              path={`/test/${test.id}`}
              element={
                <>
                  <h2>{test.title}</h2>
                  {test.questions.map((question) => (
                    <QuestionCard key={question.id} questionData={question} />
                  ))}
                </>
              }
            />
          ))}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
