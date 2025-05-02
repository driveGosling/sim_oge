import { useEffect, useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import './Profile.css';
import profileImg from '../assets/OrangeProfile.png';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, API } = useAuth();
  const [stats, setStats] = useState({
    attempts: 0,
    correct: 0,
    successRate: 0,
    history: []
  });

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    API.get("/profile").catch(() => {});
    const mockHistory = Array(5).fill().map((_, i) => ({
      date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
      theme: ["Математика", "История", "Литература"][i % 3],
      result: i % 4 !== 0 ? "Правильно" : "Неправильно",
      score: Math.floor(Math.random() * 100)
    }));
    setStats({ attempts: 15, correct: 12, successRate: 80, history: mockHistory });
  }, [API]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Мой профиль</h1>
        <div className="header-buttons">
          <Link to="/" className="back-button">На главную</Link>
          <button onClick={handleLogout} className="logout-button">Выйти</button>
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
                <th>Тема</th>
                <th>Результат</th>
                <th>Баллы</th>
              </tr>
            </thead>
            <tbody>
              {stats.history.map((item, i) => (
                <tr key={i}>
                  <td>{item.date}</td>
                  <td>{item.theme}</td>
                  <td className={`result ${item.result === "Правильно" ? "correct" : "incorrect"}`}>
                    {item.result}
                  </td>
                  <td>{item.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
