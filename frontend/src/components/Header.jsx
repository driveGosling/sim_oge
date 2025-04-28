import { useState } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import logoSrc from '../assets/logo.png';
import peterSrc from '../assets/peter.png';
import bookSrc from '../assets/book.png';
import profile from '../assets/OrangeProfile.png';

import Profile from './Profile.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [openForm, setOpenForm] = useState(null); // null | 'login' | 'register'

  const handleLogin = creds => {
    setIsAuthenticated(true);
    setOpenForm(null);
  };

  const handleRegister = formData => {
    setIsAuthenticated(true);
    setOpenForm(null);
  };

  return (
    <header className={`header ${openForm ? 'expanded' : ''}`}>
      <div className="logo-container">
        <Link to="/">
          <img src={logoSrc} alt="logo" className="logo" />
        </Link>
        <h2 className="subtitle">История россии</h2>
      </div>

      {!isAuthenticated ? (
        <>
          <div className="auth-buttons">
            <button
              className="btn-login"
              onClick={() => setOpenForm(openForm === 'login' ? null : 'login')}
            >
              Войти
            </button>
            <button
              className="btn-register"
              onClick={() => setOpenForm(openForm === 'register' ? null : 'register')}
            >
              Регистрация
            </button>
          </div>

          <div className="header-panel">
            {openForm === 'login' && <Login onSubmit={handleLogin} />}
            {openForm === 'register' && <Register onSubmit={handleRegister} />}
          </div>
        </>
      ) : (
        <div className="stats-container">
          <table className="stats-table">
            <thead>
              <tr>
                <th colSpan="3" className="stats-header-cell">
                  <button className="stats-button">
                    <img src={profile} alt="prf" className="profile-icon" />
                    <span className="profile-text">Профиль</span>
                  </button>
                </th>
              </tr>
              <tr>
                <th>Попытки</th>
                <th>Правильно</th>
                <th>Успех</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>0</td>
                <td>0</td>
                <td>0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="photo-container">
        <img src={bookSrc} alt="Книги" className="books" />
        <img src={peterSrc} alt="Пётр Первый" className="photo" />
      </div>
    </header>
  );
};

export default Header;
