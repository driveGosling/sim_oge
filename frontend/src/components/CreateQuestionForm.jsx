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
    body: "",
    imageFile: null,
  });

  useEffect(() => {
    fetch("/api/topics")
      .then((res) => res.json())
      .then((data) => setTopics(data));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData((prev) => ({ ...prev, imageFile: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const snakeCaseData = convertKeysToSnakeCase({
      text: formData.text,
      correctAnswer: formData.correctAnswer,
      answerType: formData.answerType,
      topicId: formData.topicId,
      body: formData.body,
    });

    const formPayload = new FormData();
    Object.entries(snakeCaseData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formPayload.append(key, value);
      }
    });

    if (formData.imageFile) {
      formPayload.append("image", formData.imageFile);
    }

    console.log(formPayload);

    fetch("/api/questions", {
      method: "POST",
      body: formPayload,
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Question created successfully!");
        setFormData({
          text: "",
          correctAnswer: "",
          answerType: "short",
          topicId: "",
          body: "",
          imageFile: null,
        });
      })
      .catch((err) => alert("Error creating question"));
  };

  return (
    <form
      className="form-container"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <label className="form-label">Question Text:</label>
      <textarea
        className="form-input"
        name="text"
        value={formData.text}
        onChange={handleChange}
        required
      />

      <label className="form-label">Body:</label>
      <textarea
        className="form-input"
        name="body"
        value={formData.body}
        onChange={handleChange}
      />

      <label className="form-label">Upload Image:</label>
      <input
        className="form-input"
        type="file"
        name="image"
        accept="image/*"
        onChange={handleChange}
      />

      <label className="form-label">Correct Answer:</label>
      <input
        className="form-input"
        name="correctAnswer"
        value={formData.correctAnswer}
        onChange={handleChange}
        required
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
