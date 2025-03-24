import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import tests from "./data";
import "./App.css";
import Header from "./components/Header.jsx";
import Test from "./components/Test.jsx";

const App = () => {
  const [testList, setTestList] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      const response = await fetch("http://localhost:5000/api/data");
      const tests = await response.json();
      setTestList(tests);
    };

    fetchTests();
  }, []);

  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1>Тренировочные варианты</h1>
              <ul>
                {testList.map((test) => (
                  <li key={test.id}>
                    <Link to={`/test/${test.id}`}>{test.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          }
        />
        {testList.map((test) => (
          <Route
            key={test.id}
            path={`/test/${test.id}`}
            element={<Test test={test} />}
          />
        ))}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
