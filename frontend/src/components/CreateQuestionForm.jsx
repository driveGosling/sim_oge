import { useState, useEffect } from "react";
import "./CreateQuestionForm.css";

import { convertKeysToSnakeCase } from "../utils/stringUtils";

function CreateQuestionForm() {
  const [topics, setTopics] = useState([]);
  const [formData, setFormData] = useState({
    text: "",
    correctAnswer: "",
    answerType: "short",
    topicId: "",
  });

  useEffect(() => {
    fetch("/api/topics")
      .then((res) => res.json())
      .then((data) => setTopics(data));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    const payload = convertKeysToSnakeCase(formData);
    console.log(payload);
    e.preventDefault();
    fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Question created successfully!");
      })
      .catch((err) => alert("Error creating question"));
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <label className="form-label">Question Text:</label>
      <textarea
        className="form-input"
        name="text"
        value={formData.text}
        onChange={handleChange}
        required
      />

      <label className="form-label">Correct Answer:</label>
      <input
        className="form-input"
        name="correctAnswer"
        value={formData.correctAnswer}
        onChange={handleChange}
      />

      <label className="form-label">Answer Type:</label>
      <select
        name="answerType"
        value={formData.answerType}
        onChange={handleChange}
      >
        <option value="short">Short</option>
        <option value="long">Long</option>
      </select>

      <label className="form-label">Topic:</label>
      <select
        name="topicId"
        value={formData.topicId}
        onChange={handleChange}
        required
      >
        <option value="">Select Topic</option>
        {topics.map((topic) => (
          <option key={topic.id} value={topic.id}>
            {topic.name}
          </option>
        ))}
      </select>

      <button className="form-button" type="submit">
        Create Question
      </button>
    </form>
  );
}

export default CreateQuestionForm;
