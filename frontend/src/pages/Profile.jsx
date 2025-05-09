import { useEffect, useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import "./Profile.css";
import profileImg from "../assets/OrangeProfile.png";

export default function Profile() {
  const navigate = useNavigate();
  const { user, stats, loading, logout, API } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      API.get("/profile").catch(() => {});
    }
  }, [loading, user, API]);

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Мой профиль</h1>
        <div className="header-buttons">
          <Link to="/" className="back-button">
            На главную
          </Link>
          <button onClick={handleLogout} className="logout-button">
            Выйти
          </button>
        </div>
      </div>

      <div className="profile-content">
        <section className="user-info">
          <img src={profileImg} alt="avatar" className="avatar" />
          <div className="user-details">
            <h2>{user.username}</h2>
            <p>{user.email}</p>
          </div>
        </section>

        <section className="stats-section">
          <h3>Статистика</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-value">{stats.attempts}</span>
              <span className="stat-label">Попыток</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.correct}</span>
              <span className="stat-label">Правильно</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.successRate}%</span>
              <span className="stat-label">Успешность</span>
            </div>
          </div>
        </section>

        <section className="history-section">
          <h3>История попыток</h3>
          <table className="attempts-table">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Id варианта</th>
                <th>Результат</th>
                <th>Правильных ответов</th>
                <th>Неправильных ответов</th>
                <th>Всего вопросов</th>
              </tr>
            </thead>
            <tbody>
              {stats.history.map(
                (
                  {
                    date,
                    variantId,
                    result,
                    correctAnswersCount,
                    incorrectAnswersCount,
                    totalQuestions,
                  },
                  i
                ) => (
                  <tr key={i}>
                    <td>{date}</td>
                    <td>{variantId}</td>
                    <td
                      className={`result ${
                        result === "Правильно" ? "correct" : "incorrect"
                      }`}
                    >
                      {result}
                    </td>
                    <td>{correctAnswersCount}</td>
                    <td>{incorrectAnswersCount}</td>
                    <td>{totalQuestions}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
