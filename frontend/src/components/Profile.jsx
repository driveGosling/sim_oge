import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const [stats, setStats] = useState({
    attempts: 0,
    correct: 0,
    successRate: 0,
    history: []
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch('/api/user/stats');
        const data = response.ok ? await response.json() : {
          attempts: 15,
          correct: 12,
          successRate: 80,
          history: Array(5).fill().map((_, i) => ({
            date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
            theme: ["Математика", "История", "Литература"][i % 3],
            result: i % 4 !== 0 ? "Правильно" : "Неправильно",
            score: Math.floor(Math.random() * 100)
          }))
        };
        setStats(data);
      } catch {
        console.log("Using mock data");
      }
    };
    loadStats();
  }, []);

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Мой профиль</h1>
        <Link to="/" className="back-button">← На главную</Link>
      </div>

      <div className="profile-content">
        <section className="user-info">
          <div className="avatar">ИИ</div>
          <div className="user-details">
            <h2>Иван Иванов</h2>
            <p>example@email.com</p>
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
              {stats.history.map((item, index) => (
                <tr key={index}>
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